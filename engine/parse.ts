import { normalizeHeader, suggestMapping } from './columns';
import { sniffDelimiter, tokenize } from './csv';
import { parseDateCell, isValidTimeZone, slashParts, type DateCell } from './dates';
import { hmacSha256Hex, sha256Hex } from './hash';
import { parseAmount } from './money';
import { MAX_BYTES, MAX_ROWS } from './params';
import { safeText } from './sanitize';
import { classifyStage } from './stages';
import type { CsvRecord, DateField, DateOrder, Finding, LogicalField, Mapping, NormalRow, ParseError, ParseMeta, ParseOptions, ParseResult } from './types';

const SAMPLE = 10;
const EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const SSN = /\b\d{3}-\d{2}-\d{4}\b/;
const PHONE_CANDIDATE = /\+?\(?\d[\d\s().-]{5,}\d/g;
const DATE_FIELDS: DateField[] = ['created_date', 'close_date', 'last_modified_date'];

function fail(code: string, detail?: Record<string, number | string>): ParseResult {
  return { ok: false, error: detail ? { code, detail } : ({ code } as ParseError) };
}

function looksLikePhone(s: string): boolean {
  if (SSN.test(s)) return true;
  const hits = s.match(PHONE_CANDIDATE);
  return !!hits && hits.some((h) => h.replace(/\D/g, '').length >= 7);
}

function isBlank(cells: string[]): boolean {
  for (const c of cells) if (c.trim() !== '') return false;
  return true;
}

function parseBool(s: string): boolean | null {
  const v = s.trim().toLowerCase();
  if (['true', '1', 'yes', 'y', 't'].includes(v)) return true;
  if (['false', '0', 'no', 'n', 'f'].includes(v)) return false;
  return null;
}

class FindingBag {
  private map = new Map<string, Finding>();
  add(code: string, line: number, detail?: Record<string, number | string>): void {
    let f = this.map.get(code);
    if (!f) {
      f = { code, count: 0, lines: [] };
      if (detail) f.detail = detail;
      this.map.set(code, f);
    }
    f.count++;
    if (f.lines.length < SAMPLE && line > 0) f.lines.push(line);
  }
  set(code: string, count: number, lines: number[], detail?: Record<string, number | string>): void {
    const f: Finding = { code, count, lines: lines.slice(0, SAMPLE) };
    if (detail) f.detail = detail;
    this.map.set(code, f);
  }
  list(): Finding[] {
    return Array.from(this.map.values());
  }
}

export function parseFile(bytes: Uint8Array, o: ParseOptions): ParseResult {
  try {
    return parseInner(bytes, o);
  } catch {
    return fail('internal_error');
  }
}

function parseInner(bytes: Uint8Array, o: ParseOptions): ParseResult {
  if (!o.hmacKey) return fail('missing_hmac_key');
  if (!isValidTimeZone(o.reportTz)) return fail('invalid_report_tz');
  const maxBytes = o.maxBytes ?? MAX_BYTES;
  const maxRows = o.maxRows ?? MAX_ROWS;

  // File level checks, cheapest first, all before any text work.
  if (bytes.length > maxBytes) return fail('file_too_large', { bytes: bytes.length, max: maxBytes });
  if (bytes.length === 0) return fail('file_empty');
  if (bytes.length >= 4 && bytes[0] === 0x50 && bytes[1] === 0x4b && bytes[2] === 0x03 && bytes[3] === 0x04) return fail('zip_unsupported');
  if (bytes.length >= 4 && bytes[0] === 0xd0 && bytes[1] === 0xcf && bytes[2] === 0x11 && bytes[3] === 0xe0) return fail('not_csv');

  const bag = new FindingBag();
  let encoding: ParseMeta['encoding'] = 'utf-8';
  let text: string;
  try {
    text = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
  } catch {
    text = new TextDecoder('windows-1252').decode(bytes);
    encoding = 'windows-1252';
    bag.add('encoding_fallback_latin1', 0);
  }
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);
  if (text.trim() === '') return fail('file_empty');

  const delimiter = sniffDelimiter(text);
  const tok = tokenize(text, delimiter, maxRows * 2 + 10);
  if (tok.truncated) return fail('too_many_rows', { max: maxRows });
  const records = tok.records;

  let hi = 0;
  while (hi < records.length && isBlank(records[hi].cells)) hi++;
  if (hi >= records.length) return fail('file_empty');
  const headers = records[hi].cells.map((h) => h.trim());
  const body = records.slice(hi + 1);

  // Trailing footer: a blank line followed only by rows with just the first cell filled.
  let footerFrom = body.length;
  if (headers.length > 1) {
    let i = body.length;
    let sawBlank = false;
    let sawFooter = false;
    while (i > 0) {
      const cells = body[i - 1].cells;
      if (isBlank(cells)) sawBlank = true;
      else if (cells[0].trim() !== '' && isBlank(cells.slice(1))) sawFooter = true;
      else break;
      i--;
    }
    // the footer starts at the first blank line of that trailing run
    if (sawBlank && sawFooter) {
      let j = i;
      while (j < body.length && !isBlank(body[j].cells)) j++;
      if (j < body.length) footerFrom = j;
    }
  }

  const candidates: CsvRecord[] = [];
  const footerLines: number[] = [];
  for (let k = 0; k < body.length; k++) {
    const rec = body[k];
    if (isBlank(rec.cells)) continue;
    if (k >= footerFrom) {
      footerLines.push(rec.line);
      continue;
    }
    candidates.push(rec);
  }
  if (footerLines.length > 0) bag.set('footer_rows_skipped', footerLines.length, footerLines);
  if (candidates.length === 0) return fail('no_data_rows');

  // Headers: duplicates, then mapping.
  const seen = new Set<string>();
  for (const h of headers) {
    const n = normalizeHeader(h);
    if (n === '') continue;
    if (seen.has(n)) return fail('duplicate_header');
    seen.add(n);
  }
  const suggested = suggestMapping(headers);
  const mapping: Mapping = { ...suggested };
  if (o.mapping) {
    for (const f of Object.keys(o.mapping) as LogicalField[]) {
      const h = o.mapping[f];
      if (h !== undefined && headers.includes(h)) mapping[f] = h;
    }
  }
  const idx: Partial<Record<LogicalField, number>> = {};
  for (const f of Object.keys(mapping) as LogicalField[]) idx[f] = headers.indexOf(mapping[f] as string);
  const required: LogicalField[] = ['stage', 'amount', 'created_date', 'close_date'];
  const missing = required.filter((f) => idx[f] === undefined);
  if (missing.length > 0) {
    return fail('missing_required_column', { missing: missing.join(','), found: headers.slice(0, 50).map(safeText).join(' | '), headers: headers.length });
  }
  const col = (f: LogicalField): number => idx[f] ?? -1;
  const cell = (cells: string[], f: LogicalField): string => {
    const i = col(f);
    return i >= 0 && i < cells.length ? cells[i] : '';
  };

  // Totals rows and the ragged check.
  const usable: CsvRecord[] = [];
  const raggedLines: number[] = [];
  const totalsLines: number[] = [];
  let rowsRead = 0;
  for (const rec of candidates) {
    if (rec.cells[0].trim().toLowerCase() === 'total' && cell(rec.cells, 'created_date').trim() === '' && cell(rec.cells, 'close_date').trim() === '') {
      totalsLines.push(rec.line);
      continue;
    }
    rowsRead++;
    if (rec.cells.length !== headers.length) {
      raggedLines.push(rec.line);
      continue;
    }
    usable.push(rec);
  }
  if (totalsLines.length > 0) bag.set('totals_row_skipped', totalsLines.length, totalsLines);
  if (rowsRead === 0) return fail('no_data_rows');
  if (rowsRead > maxRows) return fail('too_many_rows', { rows: rowsRead, max: maxRows });
  if (raggedLines.length > 0) {
    if (raggedLines.length / rowsRead > 0.1) return fail('too_many_ragged_rows', { ragged: raggedLines.length, rows: rowsRead });
    bag.set('ragged_row', raggedLines.length, raggedLines);
  }
  if (usable.length === 0) return fail('no_data_rows');

  // Personal data scan on the kept text columns. Counts and header names only.
  const scan: { f: LogicalField; phone: boolean }[] = [
    { f: 'record_id', phone: false },
    { f: 'stage', phone: true },
    { f: 'currency', phone: true },
  ];
  for (const { f, phone } of scan) {
    if (col(f) < 0) continue;
    let hits = 0;
    for (const rec of usable) {
      const v = rec.cells[col(f)];
      if (EMAIL.test(v) || (phone && looksLikePhone(v))) hits++;
    }
    if (hits > 0) return fail('pii_in_kept_column', { column: safeText(headers[col(f)]), rows: hits });
  }

  // Amount format: decimal comma only with a semicolon delimiter and a consistent column.
  let decimalComma = false;
  if (delimiter === ';') {
    let comma = false;
    let dot = false;
    for (const rec of usable) {
      const v = cell(rec.cells, 'amount').trim();
      if (/,\d{1,2}$/.test(v)) comma = true;
      if (/\.\d{1,2}$/.test(v)) dot = true;
    }
    decimalComma = comma && !dot;
  }

  // Day or month order per date column.
  const orders: Partial<Record<DateField, DateOrder | null>> = {};
  for (const f of DATE_FIELDS) {
    if (col(f) < 0) continue;
    let dayFirst = false;
    let monthFirst = false;
    let slashes = 0;
    for (const rec of usable) {
      const p = slashParts(rec.cells[col(f)]);
      if (!p) continue;
      slashes++;
      if (p[0] > 12) dayFirst = true;
      if (p[1] > 12) monthFirst = true;
    }
    const chosen = o.dateOrder?.[f];
    if (chosen) orders[f] = chosen;
    else if (slashes === 0) orders[f] = null;
    else if (dayFirst && monthFirst) return fail('date_order_conflict', { column: safeText(headers[col(f)]) });
    else if (dayFirst) orders[f] = 'dmy';
    else if (monthFirst) orders[f] = 'mdy';
    else return fail('date_order_ambiguous', { column: safeText(headers[col(f)]) });
  }

  // Row normalization.
  const hasId = col('record_id') >= 0;
  const hasOwner = col('owner') >= 0;
  const hasModified = col('last_modified_date') >= 0;
  const hasCurrency = col('currency') >= 0;
  const useBools = col('is_closed') >= 0 && col('is_won') >= 0;
  const ownerKeys: string[] = [];
  const ownerSeen = new Map<string, string>();
  const rows: NormalRow[] = [];
  const exactKeys: string[] = [];
  const idKeys: (string | null)[] = [];
  const blank: Record<string, number> = { stage: 0, amount: 0, created_date: 0, close_date: 0, last_modified_date: 0 };
  const blankLines: Record<string, number[]> = { stage: [], amount: [], created_date: [], close_date: [], last_modified_date: [] };

  const dateOf = (rec: CsvRecord, f: DateField, flags: string[], tag: string): string | null => {
    if (col(f) < 0) return null;
    const r: DateCell = parseDateCell(rec.cells[col(f)], orders[f] ?? null, o.reportTz);
    if (r.kind === 'blank') {
      flags.push(`${tag}:blank`);
      blank[f]++;
      if (blankLines[f].length < SAMPLE) blankLines[f].push(rec.line);
      return null;
    }
    if (r.kind === 'invalid') {
      flags.push(`${tag}:invalid`);
      bag.add('invalid_date', rec.line);
      return null;
    }
    if (r.noOffset) {
      if (!flags.includes('datetime_without_offset')) {
        flags.push('datetime_without_offset');
        bag.add('datetime_without_offset_assumed_tz', rec.line);
      }
    }
    return r.day;
  };

  const currencies = new Set<string>();
  for (const rec of usable) {
    const flags: string[] = [];
    const line = rec.line;
    let idKey: string | null = null;
    let idText = '';
    if (hasId) {
      idText = cell(rec.cells, 'record_id').trim();
      if (idText === '') {
        flags.push('blank_id');
        bag.add('blank_id', line);
      } else idKey = idText;
    }
    const idHash = hmacSha256Hex(o.hmacKey, `id:${idKey ?? `line:${line}`}`).slice(0, 12);

    const createdDay = dateOf(rec, 'created_date', flags, 'created');
    const closeDay = dateOf(rec, 'close_date', flags, 'close');
    const modifiedDay = dateOf(rec, 'last_modified_date', flags, 'modified');

    const am = parseAmount(cell(rec.cells, 'amount'), { decimalComma });
    if (am.state === 'blank') {
      blank.amount++;
      if (blankLines.amount.length < SAMPLE) blankLines.amount.push(line);
    } else if (am.state === 'invalid') bag.add('invalid_amount', line);
    else if (am.state === 'negative') bag.add('negative_amount', line);

    let currency = am.currency ?? 'UNSTATED';
    if (hasCurrency) {
      const c = cell(rec.cells, 'currency').trim();
      if (/^[A-Za-z]{3}$/.test(c)) currency = c.toUpperCase();
      else if (c !== '') {
        flags.push('invalid_currency');
        bag.add('invalid_currency', line);
      }
    }
    currencies.add(currency);

    const stageText = cell(rec.cells, 'stage').trim();
    if (stageText === '') {
      blank.stage++;
      if (blankLines.stage.length < SAMPLE) blankLines.stage.push(line);
    }
    const bools = useBools ? { isClosed: parseBool(cell(rec.cells, 'is_closed')), isWon: parseBool(cell(rec.cells, 'is_won')) } : undefined;
    const stageClass = classifyStage(stageText, o.stageMapping, bools);

    let ownerKey: string | null = null;
    if (hasOwner) {
      const ov = cell(rec.cells, 'owner').trim();
      if (ov === '') {
        flags.push('blank_owner');
        bag.add('blank_owner', line);
      } else {
        let k = ownerSeen.get(ov);
        if (!k) {
          k = hmacSha256Hex(o.hmacKey, `owner:${ov}`).slice(0, 8);
          ownerSeen.set(ov, k);
          if (!ownerKeys.includes(k)) ownerKeys.push(k);
        }
        ownerKey = k;
      }
    }

    const row: NormalRow = {
      line,
      idHash,
      createdDay,
      closeDay,
      modifiedDay,
      stageRaw: safeText(stageText),
      stageClass,
      amountMinor: am.minor,
      amountState: am.state,
      currency,
      ownerKey,
      flags,
    };
    if (o.showIds && hasId) Object.defineProperty(row, 'idRaw', { value: idText, enumerable: false, writable: true, configurable: true });
    rows.push(row);
    idKeys.push(idKey);
    exactKeys.push([createdDay, closeDay, modifiedDay, stageText, am.state, am.minor, currency, ownerKey].join('\u0001'));
  }

  // Duplicate policy, only with a usable id column.
  if (hasId) {
    const groups = new Map<string, number[]>();
    for (let i = 0; i < rows.length; i++) {
      const k = idKeys[i];
      if (k === null) continue;
      const g = groups.get(k);
      if (g) g.push(i);
      else groups.set(k, [i]);
    }
    let exactCount = 0;
    const exactLines: number[] = [];
    let conflictIds = 0;
    const conflictLines: number[] = [];
    groups.forEach((g) => {
      if (g.length < 2) return;
      const survivors: number[] = [];
      const seenExact = new Set<string>();
      for (const i of g) {
        if (seenExact.has(exactKeys[i])) {
          rows[i].flags.push('duplicate_exact');
          exactCount++;
          exactLines.push(rows[i].line);
        } else {
          seenExact.add(exactKeys[i]);
          survivors.push(i);
        }
      }
      if (survivors.length > 1) {
        let win = survivors[0];
        for (const i of survivors) {
          const a = rows[i].modifiedDay ?? '';
          const b = rows[win].modifiedDay ?? '';
          if (a > b) win = i;
        }
        conflictIds++;
        for (const i of survivors) {
          if (i === win) continue;
          rows[i].flags.push('duplicate_conflict');
          conflictLines.push(rows[i].line);
        }
      }
    });
    if (exactCount > 0) bag.set('duplicate_id_exact', exactCount, exactLines.sort((a, b) => a - b));
    if (conflictIds > 0) bag.set('duplicate_id_conflict', conflictIds, conflictLines.sort((a, b) => a - b));
  } else {
    bag.add('no_id_column_using_line_numbers', 0);
  }

  if (!hasModified) bag.add('no_last_modified_column', 0);
  if (!hasOwner) bag.add('no_owner_column', 0);
  for (const f of ['amount', 'stage', 'created_date', 'close_date', 'last_modified_date']) {
    if (blank[f] > 0) bag.set(`blank_rate_${f}`, blank[f], blankLines[f], { rows: rows.length });
  }
  if (currencies.size > 1) bag.set('mixed_currency', currencies.size, [], { codes: Array.from(currencies).sort().join(',') });
  const entered = headers.some((h) => /^(date )?entered /i.test(h.trim()));
  if (!entered) bag.add('stage_skip_not_checkable', 0);

  const mapped = new Set<string>(Object.values(mapping) as string[]);
  const droppedHeaders = headers.filter((h) => h !== '' && !mapped.has(h)).map(safeText);
  const meta: ParseMeta = {
    fileSha256: sha256Hex(bytes),
    bytes: bytes.length,
    encoding,
    delimiter,
    reportTz: o.reportTz,
    rowsRead,
    rowsUsed: rows.length,
    droppedHeaders,
    mapping,
    hasIdColumn: hasId,
    hasModifiedColumn: hasModified,
    hasOwnerColumn: hasOwner,
    hasCurrencyColumn: hasCurrency,
    ownerKeys,
  };
  return { ok: true, rows, meta, findings: bag.list() };
}
