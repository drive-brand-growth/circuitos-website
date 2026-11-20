import type { CsvRecord } from './types';

// RFC 4180 tokenizer. Quoted fields may hold the delimiter, doubled quotes and newlines.
// A quote only opens a quoted field at the start of a field. Lone CR, CRLF and LF all end a record.
// `limit` stops reading once more than `limit` records were produced and reports truncated.
export function tokenize(text: string, delimiter: string, limit?: number): { records: CsvRecord[]; truncated: boolean } {
  const records: CsvRecord[] = [];
  let cells: string[] = [];
  let field = '';
  let inQuotes = false;
  let fieldStart = true; // at the first char of a field
  let hasContent = false; // anything seen since the last record break
  let line = 1;
  let recordLine = 1;
  const n = text.length;

  const endField = () => {
    cells.push(field);
    field = '';
    fieldStart = true;
  };
  const endRecord = (): boolean => {
    endField();
    records.push({ line: recordLine, cells });
    cells = [];
    hasContent = false;
    return limit !== undefined && records.length > limit;
  };

  for (let i = 0; i < n; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        if (ch === '\n') line++;
        field += ch;
      }
      continue;
    }
    if (!hasContent) recordLine = line;
    if (ch === '"' && fieldStart) {
      inQuotes = true;
      fieldStart = false;
      hasContent = true;
    } else if (ch === delimiter) {
      hasContent = true;
      endField();
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      if (endRecord()) {
        line++;
        return { records, truncated: true };
      }
      line++;
    } else {
      field += ch;
      fieldStart = false;
      hasContent = true;
    }
  }
  if (hasContent || inQuotes) endRecord();
  return { records, truncated: false };
}

function quoteCell(c: string, delimiter: string): string {
  if (c === '' || c.includes(delimiter) || c.includes('"') || c.includes('\n') || c.includes('\r')) return `"${c.replace(/"/g, '""')}"`;
  return c;
}

export function serialize(table: string[][], delimiter = ','): string {
  return table.map((row) => row.map((c) => quoteCell(c, delimiter)).join(delimiter)).join('\n');
}

// Counts a delimiter outside quotes on one line.
function countOutsideQuotes(line: string, d: string): number {
  let inQ = false;
  let n = 0;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') inQ = !inQ;
    else if (!inQ && ch === d) n++;
  }
  return n;
}

// Looks at the first 20 non blank lines. The delimiter whose count on the header line is repeated
// on the most later lines wins. A tie goes to comma, then semicolon, then tab.
export function sniffDelimiter(text: string): string {
  const lines = text
    .split(/\r\n|\n|\r/)
    .filter((l) => l.trim() !== '')
    .slice(0, 20);
  if (lines.length === 0) return ',';
  let best = ',';
  let bestScore = -1;
  for (const d of [',', ';', '\t']) {
    const head = countOutsideQuotes(lines[0], d);
    if (head === 0) continue;
    let score = 0;
    for (const l of lines) if (countOutsideQuotes(l, d) === head) score++;
    if (score > bestScore) {
      best = d;
      bestScore = score;
    }
  }
  return best;
}
