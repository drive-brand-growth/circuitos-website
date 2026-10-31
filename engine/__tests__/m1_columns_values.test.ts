import { describe, expect, it } from 'vitest';
import { suggestMapping } from '../columns';
import { parseDateCell } from '../dates';
import { parseAmount } from '../money';
import { neutralize, safeText } from '../sanitize';
import { classifyStage } from '../stages';
import { parseFile } from '../parse';
import { tokenize } from '../csv';
import { HEADER5, HEADER6, enc, finding, fixtureBytes, mutate, opts, parseOk } from './helpers';

const headersOf = (name: string) => tokenize(new TextDecoder('latin1').decode(fixtureBytes(name)).replace(/^﻿|^ï»¿/, ''), ',').records[0].cells;

describe('M1 column mapping', () => {
  it('suggest_mapping_hubspot_shape', () => {
    const m = suggestMapping(headersOf('01_clean_hubspot_shape'));
    expect(m).toEqual({
      record_id: 'Record ID',
      stage: 'Deal Stage',
      amount: 'Amount',
      close_date: 'Close Date',
      created_date: 'Create Date',
      owner: 'Deal owner',
      last_modified_date: 'Last Modified Date',
    });
  });

  it('suggest_mapping_salesforce_report_and_api_names', () => {
    const report = suggestMapping(headersOf('13_salesforce_latin1_footer'));
    expect(report).toEqual({
      record_id: 'Opportunity ID',
      stage: 'Stage',
      amount: 'Amount',
      close_date: 'Close Date',
      created_date: 'Created Date',
      last_modified_date: 'Last Modified Date',
      owner: 'Opportunity Owner',
    });
    const api = suggestMapping(['Id', 'Name', 'StageName', 'Amount', 'CloseDate', 'CreatedDate', 'LastModifiedDate', 'OwnerId', 'IsWon', 'IsClosed', 'CurrencyIsoCode']);
    expect(api).toEqual({
      record_id: 'Id',
      stage: 'StageName',
      amount: 'Amount',
      close_date: 'CloseDate',
      created_date: 'CreatedDate',
      last_modified_date: 'LastModifiedDate',
      owner: 'OwnerId',
      is_won: 'IsWon',
      is_closed: 'IsClosed',
      currency: 'CurrencyIsoCode',
    });
  });

  it('suggest_mapping_spreadsheet_shape', () => {
    const m = suggestMapping(headersOf('14_spreadsheet_messy'));
    expect(m.record_id).toBeUndefined();
    expect(m).toMatchObject({ amount: 'Value', stage: 'Status', owner: 'Rep', close_date: 'Expected Close', created_date: 'Started', last_modified_date: 'Updated' });
  });

  it('missing_tier_a_column_rejected_with_header_names_only', () => {
    const text = `Record ID,Deal Stage,Close Date,Create Date\nZZ_CELL_VALUE_ZZ,Discovery,2027-01-15,2026-10-20\n`;
    const r = parseFile(enc(text), opts());
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe('missing_required_column');
      expect(String(r.error.detail?.missing)).toContain('amount');
      expect(JSON.stringify(r.error)).not.toContain('ZZ_CELL_VALUE_ZZ');
      expect(JSON.stringify(r.error)).toContain('Record ID');
    }
  });

  it('no_id_column_uses_line_numbers_and_disables_duplicate_check', () => {
    const r = parseOk(fixtureBytes('14_spreadsheet_messy'));
    expect(r.meta.hasIdColumn).toBe(false);
    expect(finding(r.findings, 'no_id_column_using_line_numbers')).toBeDefined();
    expect(new Set(r.rows.map((x) => x.idHash)).size).toBe(r.rows.length);
    const twin = parseOk(enc('Value,Status,Expected Close,Started\n1000,Open,2027-01-15,2026-10-20\n1000,Open,2027-01-15,2026-10-20\n'));
    expect(twin.rows).toHaveLength(2);
    expect(twin.rows.every((x) => !x.flags.includes('duplicate_exact'))).toBe(true);
    expect(finding(twin.findings, 'duplicate_id_exact')).toBeUndefined();
  });
});

describe('M1 values', () => {
  it('amount_parses_to_integer_cents', () => {
    const table: [string, number, string | undefined][] = [
      ['$12,000', 1200000, undefined],
      ['1,234.50', 123450, undefined],
      ['USD 10,000.00', 1000000, 'USD'],
      ['15000', 1500000, undefined],
      ['5000.00', 500000, undefined],
      ['£99', 9900, undefined],
      ['€ 1 200.5', 120050, undefined],
      ['0', 0, undefined],
      ['eur 7.25', 725, 'EUR'],
    ];
    for (const [text, minor, currency] of table) {
      const r = parseAmount(text);
      expect(r.state, text).toBe('ok');
      expect(r.minor, text).toBe(minor);
      expect(r.currency, text).toBe(currency);
    }
    expect(parseAmount('1234,5', { decimalComma: true }).minor).toBe(123450);
    expect(parseAmount('1.234,56', { decimalComma: true }).minor).toBe(123456);
  });

  it('amount_invalid_never_guessed', () => {
    for (const text of ['25k', '1e3', '=100', '(500.00)', '12.345', '1,23', '12.', 'abc', '$', '1.2.3', '--5', '１２']) {
      const r = parseAmount(text);
      expect(r.state, text).toBe('invalid');
      expect(r.minor, text).toBeNull();
    }
    const r = parseOk(enc(`${HEADER5}\nA1,Discovery,25k,2027-01-15,2026-10-20\nA2,Discovery,1000,2027-01-15,2026-10-20\n`));
    expect(r.rows[0].amountState).toBe('invalid');
    expect(finding(r.findings, 'invalid_amount')?.lines).toEqual([2]);
  });

  it('amount_blank_and_negative_flagged', () => {
    expect(parseAmount('').state).toBe('blank');
    expect(parseAmount('   ').state).toBe('blank');
    expect(parseAmount('-500').state).toBe('negative');
    const r = parseOk(fixtureBytes('11_formula_injection'));
    expect(r.rows.find((x) => x.line === 10)?.amountState).toBe('negative');
    expect(r.rows.find((x) => x.line === 9)?.amountState).toBe('invalid');
    const m = parseOk(fixtureBytes('14_spreadsheet_messy'));
    expect(m.rows.find((x) => x.line === 10)?.amountState).toBe('blank');
    expect(m.rows.find((x) => x.line === 10)?.amountMinor).toBeNull();
    expect(finding(m.findings, 'blank_rate_amount')?.count).toBe(1);
  });

  it('amount_decimal_comma_only_with_semicolon_delimiter', () => {
    const semi = parseOk(enc('Record ID;Deal Stage;Amount;Close Date;Create Date\nA1;Discovery;1234,5;2027-01-15;2026-10-20\nA2;Discovery;10,25;2027-01-15;2026-10-20\n'));
    expect(semi.rows.map((x) => x.amountMinor)).toEqual([123450, 1025]);
    const comma = parseOk(enc(`${HEADER5}\nA1,Discovery,"1,234",2027-01-15,2026-10-20\n`));
    expect(comma.rows[0].amountMinor).toBe(123400);
  });

  it('dates_iso_offset_and_zone_conversion', () => {
    const days = (tz: string) => parseOk(fixtureBytes('08_timezone_shift'), opts({ reportTz: tz })).rows.map((x) => x.createdDay);
    expect(days('America/Chicago')).toEqual(['2026-10-25', '2026-10-26', '2026-10-19', '2026-10-18', '2026-10-22', '2026-10-20']);
    expect(days('UTC')).toEqual(['2026-10-26', '2026-10-26', '2026-10-19', '2026-10-19', '2026-10-22', '2026-10-20']);
    const r = parseOk(fixtureBytes('08_timezone_shift'));
    expect(finding(r.findings, 'datetime_without_offset_assumed_tz')?.lines).toEqual([7]);
    expect(parseDateCell('2026-10-25', null, 'UTC')).toEqual({ kind: 'ok', day: '2026-10-25', noOffset: false });
    expect(parseDateCell('2026-10-20T09:00:00', null, 'UTC')).toMatchObject({ kind: 'ok', day: '2026-10-20', noOffset: true });
    expect(parseDateCell('Sep 22 2026', null, 'UTC')).toMatchObject({ kind: 'ok', day: '2026-09-22' });
    expect(parseDateCell('22 September 2026', null, 'UTC')).toMatchObject({ kind: 'ok', day: '2026-09-22' });
    expect(parseDateCell('3/4/2026', 'mdy', 'UTC')).toMatchObject({ day: '2026-03-04' });
    expect(parseDateCell('3/4/2026', 'dmy', 'UTC')).toMatchObject({ day: '2026-04-03' });
    expect(parseDateCell('2026-02-30', null, 'UTC').kind).toBe('invalid');
    expect(parseDateCell('2026-13-01', null, 'UTC').kind).toBe('invalid');
    expect(parseDateCell('soon', null, 'UTC').kind).toBe('invalid');
    expect(parseDateCell('', null, 'UTC').kind).toBe('blank');
    expect(parseDateCell('2028-02-29', null, 'UTC').kind).toBe('ok');
    expect(parseDateCell('2027-02-29', null, 'UTC').kind).toBe('invalid');
  });

  it('dates_order_inferred_or_rejected', () => {
    const sf = parseOk(fixtureBytes('13_salesforce_latin1_footer'));
    expect(sf.rows[0]).toMatchObject({ closeDay: '2026-12-15', createdDay: '2026-10-05', modifiedDay: '2026-10-20' });
    const ss = parseOk(fixtureBytes('14_spreadsheet_messy'));
    expect(ss.rows[0]).toMatchObject({ closeDay: '2026-09-10', createdDay: '2026-08-25' });
    expect(ss.rows.find((x) => x.line === 4)).toMatchObject({ closeDay: '2026-09-22', createdDay: '2026-09-02' });

    // M_AMBIGUOUS_DATES: every date has both parts 12 or less
    const bytes = mutate('14_spreadsheet_messy', (t) => {
      for (const row of t.slice(1)) for (const c of [4, 5, 6]) if (row[c]) row[c] = '3/4/2026';
    });
    const r = parseFile(bytes, opts());
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.code).toBe('date_order_ambiguous');
      expect(r.error.detail?.column).toBeDefined();
    }
    const chosen = parseFile(bytes, opts({ dateOrder: { created_date: 'mdy', close_date: 'mdy', last_modified_date: 'mdy' } }));
    expect(chosen.ok).toBe(true);

    const conflict = parseFile(enc(`${HEADER5}\nA1,Discovery,1000,13/1/2026,2026-10-20\nA2,Discovery,1000,1/13/2026,2026-10-20\n`), opts());
    expect(conflict.ok).toBe(false);
    if (!conflict.ok) expect(conflict.error.code).toBe('date_order_conflict');

    const dmy = parseOk(enc(`${HEADER5}\nA1,Discovery,1000,25/12/2026,2026-10-20\n`));
    expect(dmy.rows[0].closeDay).toBe('2026-12-25');
  });

  it('stage_class_rules_in_order', () => {
    // rule 1
    expect(classifyStage('Closed Won', undefined, { isClosed: false, isWon: false })).toBe('OPEN');
    expect(classifyStage('Discovery', undefined, { isClosed: true, isWon: true })).toBe('WON');
    expect(classifyStage('Discovery', undefined, { isClosed: true, isWon: false })).toBe('LOST');
    // rule 2
    expect(classifyStage(' shipped ', { won: ['Shipped'] })).toBe('WON');
    expect(classifyStage('Churned', { lost: ['churned'] })).toBe('LOST');
    expect(classifyStage('Closed Won', { open: ['closed won'] })).toBe('OPEN');
    expect(classifyStage('Closed Won (v2)', { won: ['Closed Won (v2)'] })).toBe('WON');
    // rule 3
    for (const l of ['Closed Won', 'closedwon', 'won', ' WON ']) expect(classifyStage(l)).toBe('WON');
    for (const l of ['Closed Lost', 'closedlost', 'lost']) expect(classifyStage(l)).toBe('LOST');
    // rule 4
    for (const l of ['Closed Won (v2)', 'Phase 2 Closed Review', 'Won Pending', 'churned', 'Cancelled', 'Lost cause']) expect(classifyStage(l), l).toBe('UNMAPPED');
    // rule 5
    for (const l of ['Discovery', 'Négociation', 'Proposal sent', '+SUM(1,1)', '', 'Open']) expect(classifyStage(l), l).toBe('OPEN');
    // wired through parse: is_closed and is_won columns beat labels
    const r = parseOk(enc(`${HEADER5},IsWon,IsClosed\nA1,Closed Won,1000,2027-01-15,2026-10-20,false,false\nA2,Discovery,1000,2027-01-15,2026-10-20,true,true\n`));
    expect(r.rows.map((x) => x.stageClass)).toEqual(['OPEN', 'WON']);
  });

  it('duplicates_exact_and_conflict_policy', () => {
    const r = parseOk(fixtureBytes('04_duplicate_ids'));
    expect(r.meta.rowsRead).toBe(19);
    expect(new Set(r.rows.map((x) => x.idHash)).size).toBe(17);
    const flags = (line: number) => r.rows.find((x) => x.line === line)?.flags ?? [];
    expect(flags(19)).toContain('duplicate_exact');
    expect(flags(12)).toContain('duplicate_conflict');
    expect(flags(20)).not.toContain('duplicate_conflict');
    expect(flags(20)).not.toContain('duplicate_exact');
    expect(flags(10)).not.toContain('duplicate_exact');
    expect(finding(r.findings, 'duplicate_id_exact')?.count).toBe(1);
    expect(finding(r.findings, 'duplicate_id_conflict')?.count).toBe(1);

    // tie on modified day: first in file wins
    const tie = parseOk(enc(`${HEADER6}\nA1,Discovery,1000,2027-01-15,2026-10-20,2026-10-21\nA1,Discovery,2000,2027-01-15,2026-10-20,2026-10-21\n`));
    expect(tie.rows[0].flags).not.toContain('duplicate_conflict');
    expect(tie.rows[1].flags).toContain('duplicate_conflict');
    // a missing modified day loses to a present one
    const nomod = parseOk(enc(`${HEADER6}\nA1,Discovery,1000,2027-01-15,2026-10-20,\nA1,Discovery,2000,2027-01-15,2026-10-20,2026-10-21\n`));
    expect(nomod.rows[0].flags).toContain('duplicate_conflict');
  });

  it('pii_allowlist_drops_columns_and_scan_rejects_kept_pii', () => {
    const r = parseOk(fixtureBytes('12_personal_data'));
    expect(r.meta.droppedHeaders).toEqual(['Deal Name', 'Contact Name', 'Contact Email', 'Contact Phone', 'Notes']);
    const json = JSON.stringify(r);
    const values = ['Pat', 'Sam', 'Lee', 'Kim', 'Ray'].flatMap((n, i) => [`${n} Example`, `${n.toLowerCase()}@example.test`, `555-010${i + 1}`]);
    values.push('Call back Tuesday', 'Prefers text', 'Met at event', 'Needs quote', 'Signed', 'Synthetic Deal P1', 'Synthetic Deal P2', 'Synthetic Deal P3', 'Synthetic Deal P4', 'Synthetic Deal P5');
    for (const v of [...values, 'example.test', '555-01', 'Rep A', 'Rep B']) expect(json, v).not.toContain(v);
    expect(r.rows).toHaveLength(5);

    const stageErr = parseFile(mutate('12_personal_data', (t) => { t[4][6] = 'Discovery, call kim@example.test'; }), opts());
    expect(stageErr).toEqual({ ok: false, error: { code: 'pii_in_kept_column', detail: { column: 'Stage', rows: 1 } } });
    const idErr = parseFile(mutate('12_personal_data', (t) => { t[2][0] = 'sam@example.test'; }), opts());
    expect(idErr).toEqual({ ok: false, error: { code: 'pii_in_kept_column', detail: { column: 'Deal ID', rows: 1 } } });
    const phoneId = parseFile(mutate('12_personal_data', (t) => { t[2][0] = '5550102345'; }), opts());
    expect(phoneId.ok).toBe(true);

    const phoneStage = parseFile(mutate('12_personal_data', (t) => { t[2][6] = 'call 512-555-0199'; }), opts());
    expect(phoneStage.ok).toBe(false);
    const ssnStage = parseFile(mutate('12_personal_data', (t) => { t[2][6] = '123-45-6789'; }), opts());
    expect(ssnStage.ok).toBe(false);
    const curErr = parseFile(enc(`${HEADER5},Currency\nA1,Discovery,1000,2027-01-15,2026-10-20,a@b.test\n`), opts());
    expect(curErr.ok).toBe(false);
    if (!curErr.ok) expect(JSON.stringify(curErr.error)).not.toContain('a@b.test');
  });
});

describe('M1 privacy and safety', () => {
  it('owner_hashed_and_raw_never_in_result', () => {
    const r = parseOk(fixtureBytes('05_missing_owner'));
    const json = JSON.stringify(r);
    for (const v of ['Rep A', 'Rep B', 'Rep C']) expect(json).not.toContain(v);
    expect(r.rows.every((x) => x.ownerKey === null || /^[0-9a-f]{8}$/.test(x.ownerKey))).toBe(true);
    expect(r.meta.ownerKeys).toHaveLength(3);
    const blank = finding(r.findings, 'blank_owner');
    expect(blank?.count).toBe(3);
    expect(blank?.lines).toEqual([10, 14, 18]);
    expect(r.rows.find((x) => x.line === 10)?.ownerKey).toBeNull();
    const again = parseOk(fixtureBytes('05_missing_owner'));
    expect(again.rows.map((x) => x.ownerKey)).toEqual(r.rows.map((x) => x.ownerKey));
    const other = parseOk(fixtureBytes('05_missing_owner'), opts({ hmacKey: 'another-key' }));
    expect(other.rows.find((x) => x.line === 2)?.ownerKey).not.toBe(r.rows.find((x) => x.line === 2)?.ownerKey);
    const f11 = parseOk(fixtureBytes('11_formula_injection'));
    expect(JSON.stringify(f11)).not.toContain('HYPERLINK');
  });

  it('formula_cells_neutralized_in_every_echoed_string', () => {
    const r = parseOk(fixtureBytes('11_formula_injection'));
    const trigger = /^[=+\-@\t\r＝＋－＠]/;
    for (const row of r.rows) expect(row.stageRaw, `line ${row.line}`).not.toMatch(trigger);
    expect(r.rows.find((x) => x.line === 4)?.stageRaw).toBe("'+SUM(1,1)");
    expect(r.rows.find((x) => x.line === 5)?.stageRaw).toBe("'-2+3");
    expect(r.rows.find((x) => x.line === 7)?.stageRaw).toBe('Discovery');
    expect(r.rows.find((x) => x.line === 8)?.stageRaw.startsWith("'")).toBe(true);
    expect(r.rows.filter((x) => [2, 4, 5, 6, 7, 8, 11].includes(x.line)).every((x) => x.stageClass === 'OPEN')).toBe(true);
    expect(r.rows.find((x) => x.line === 3)?.idRaw).toBeUndefined();

    for (const c of ['=', '+', '-', '@', '\t', '\r', '＝', '＋', '－', '＠']) {
      expect(neutralize(`${c}x`).startsWith("'"), JSON.stringify(c)).toBe(true);
      expect(neutralize(`${c}x`)).not.toMatch(trigger);
    }
    expect(neutralize('plain')).toBe('plain');
    expect(safeText('x'.repeat(100))).toHaveLength(40);
    expect(safeText('=' + 'x'.repeat(100))).toHaveLength(40);
    expect(safeText('=' + 'x'.repeat(100)).startsWith("'")).toBe(true);

    const hdr = parseOk(enc(`${HEADER5},=cmd\nA1,Discovery,1000,2027-01-15,2026-10-20,x\n`));
    expect(hdr.meta.droppedHeaders).toEqual(["'=cmd"]);
  });

  it('show_ids_keeps_raw_id_in_memory_only', () => {
    const r = parseOk(fixtureBytes('11_formula_injection'), opts({ showIds: true }));
    expect(r.rows.find((x) => x.line === 3)?.idRaw).toBe('=1+1');
    expect(JSON.stringify(r)).not.toContain('=1+1');
    const hidden = parseOk(fixtureBytes('01_clean_hubspot_shape'));
    expect(hidden.rows.every((x) => x.idRaw === undefined)).toBe(true);
  });

  it('clean_fixture_01_rows_are_normalized', () => {
    const r = parseOk(fixtureBytes('01_clean_hubspot_shape'));
    expect(r.rows).toHaveLength(17);
    expect(r.meta).toMatchObject({ rowsRead: 17, rowsUsed: 17, droppedHeaders: ['Deal Name', 'Pipeline'], hasIdColumn: true, hasModifiedColumn: true });
    expect(r.rows[0]).toMatchObject({ line: 2, createdDay: '2026-08-25', closeDay: '2026-09-10', modifiedDay: '2026-09-10', stageRaw: 'Closed Won', stageClass: 'WON', amountMinor: 1200000, amountState: 'ok', currency: 'UNSTATED' });
    expect(r.rows[0].idHash).toMatch(/^[0-9a-f]{12}$/);
    expect(r.meta.fileSha256).toMatch(/^[0-9a-f]{64}$/);
    expect(JSON.stringify(r)).not.toMatch(/D0\d\d|Synthetic Deal/);
    expect(finding(r.findings, 'stage_skip_not_checkable')).toBeDefined();
  });

  it('currency_column_and_text_codes_set_row_currency', () => {
    const r = parseOk(fixtureBytes('07_currency_mixed'));
    expect(r.rows.filter((x) => x.currency === 'EUR').map((x) => x.line)).toEqual([10, 15]);
    expect(finding(r.findings, 'mixed_currency')).toBeDefined();
    const sf = parseOk(fixtureBytes('13_salesforce_latin1_footer'));
    expect(sf.rows.every((x) => x.currency === 'USD')).toBe(true);
    const bad = parseFile(enc(`${HEADER5},Currency\nA1,Discovery,1000,2027-01-15,2026-10-20,dollars\n`), opts());
    if (bad.ok) expect(bad.rows[0].flags).toContain('invalid_currency');
  });

  it('missing_modified_and_owner_columns_degrade_with_warnings', () => {
    const r = parseOk(enc(`${HEADER5}\nA1,Discovery,1000,2027-01-15,2026-10-20\n`));
    expect(r.meta.hasModifiedColumn).toBe(false);
    expect(r.rows[0].modifiedDay).toBeNull();
    expect(finding(r.findings, 'no_last_modified_column')).toBeDefined();
    expect(finding(r.findings, 'no_owner_column')).toBeDefined();
  });

  it('unusable_dates_are_flagged_not_dropped', () => {
    const r = parseOk(enc(`${HEADER6}\nA1,Discovery,1000,2027-01-15,notadate,2026-10-21\nA2,Discovery,1000,,2026-10-20,2026-10-21\n`));
    expect(r.rows).toHaveLength(2);
    expect(r.rows[0].createdDay).toBeNull();
    expect(r.rows[0].flags).toContain('created:invalid');
    expect(r.rows[1].closeDay).toBeNull();
    expect(r.rows[1].flags).toContain('close:blank');
    expect(finding(r.findings, 'invalid_date')?.lines).toEqual([2]);
  });

  it('invalid_timezone_is_a_typed_error', () => {
    const r = parseFile(fixtureBytes('01_clean_hubspot_shape'), opts({ reportTz: 'Not/AZone' }));
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe('invalid_report_tz');
  });
});
