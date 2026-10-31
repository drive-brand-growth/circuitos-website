import { describe, expect, it } from 'vitest';
import { parseFile } from '../parse';
import { serialize, tokenize } from '../csv';
import { LABELS } from '../labels';
import { HEADER5, HEADER6, enc, finding, fixtureBytes, mutate, opts, parseOk, tableOf } from './helpers';

function errCode(bytes: Uint8Array, o = opts()): string | undefined {
  const r = parseFile(bytes, o);
  return r.ok ? undefined : r.error.code;
}

describe('M1 file level', () => {
  it('file_empty_zero_bytes_rejected', () => {
    const r = parseFile(fixtureBytes('09_empty_file'), opts());
    expect(r).toEqual({ ok: false, error: { code: 'file_empty' } });
  });

  it('file_empty_bom_and_whitespace_rejected', () => {
    expect(errCode(new Uint8Array([0xef, 0xbb, 0xbf, 0x20, 0x0a, 0x0d, 0x0a, 0x20]))).toBe('file_empty');
    expect(errCode(enc('   \n\n  \r\n'))).toBe('file_empty');
  });

  it('header_only_rejected_no_data_rows', () => {
    expect(errCode(enc(`${HEADER6}\n`))).toBe('no_data_rows');
    expect(errCode(enc(`${HEADER6}\n\n\n`))).toBe('no_data_rows');
  });

  it('zip_magic_bytes_rejected_with_unzip_hint', () => {
    const zip = new Uint8Array([0x50, 0x4b, 0x03, 0x04, 0x14, 0x00, 0x00, 0x00]);
    expect(errCode(zip)).toBe('zip_unsupported');
    expect(String(LABELS.errors?.zip_unsupported)).toMatch(/unzip/i);
  });

  it('binary_xls_rejected_not_csv', () => {
    const xls = new Uint8Array([0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]);
    expect(errCode(xls)).toBe('not_csv');
  });

  it('utf8_bom_stripped', () => {
    const r = parseOk(fixtureBytes('14_spreadsheet_messy'));
    expect(r.meta.droppedHeaders).toContain('Deal');
    expect(r.meta.droppedHeaders.some((h) => h.includes('﻿'))).toBe(false);
    const r2 = parseOk(enc(`﻿${HEADER6}\nA1,Discovery,1000,2027-01-15,2026-10-20,2026-10-21\n`));
    expect(r2.meta.mapping.record_id).toBe('Record ID');
  });

  it('invalid_utf8_falls_back_to_windows1252_with_warning', () => {
    const r = parseOk(fixtureBytes('13_salesforce_latin1_footer'));
    expect(r.meta.encoding).toBe('windows-1252');
    expect(finding(r.findings, 'encoding_fallback_latin1')).toBeDefined();
    const clean = parseOk(fixtureBytes('01_clean_hubspot_shape'));
    expect(clean.meta.encoding).toBe('utf-8');
    expect(finding(clean.findings, 'encoding_fallback_latin1')).toBeUndefined();
  });

  it('latin1_char_decodes_correctly', () => {
    const r = parseOk(fixtureBytes('13_salesforce_latin1_footer'));
    expect(r.rows.find((x) => x.line === 3)?.stageRaw).toBe('Négociation');
  });

  it('delimiter_sniff_comma_semicolon_tab', () => {
    const body = ['A1,Discovery,1000,2027-01-15,2026-10-20', 'A2,Qualified,2000,2027-01-16,2026-10-21'];
    for (const d of [',', ';', '\t']) {
      const text = [HEADER5, ...body].map((l) => l.split(',').join(d)).join('\n');
      const r = parseOk(enc(text));
      expect(r.meta.delimiter).toBe(d);
      expect(r.rows.map((x) => x.amountMinor)).toEqual([100000, 200000]);
    }
  });

  it('parse_rfc4180_quoted_comma', () => {
    expect(tokenize('a,"b,c",d', ',').records[0].cells).toEqual(['a', 'b,c', 'd']);
    const r = parseOk(fixtureBytes('14_spreadsheet_messy'));
    expect(r.rows.find((x) => x.line === 5)?.amountMinor).toBe(500000);
  });

  it('parse_rfc4180_embedded_newline_in_quotes', () => {
    const t = tokenize('a,"line one\nline two",c\nx,y,z\n', ',');
    expect(t.records.map((x) => x.cells)).toEqual([['a', 'line one\nline two', 'c'], ['x', 'y', 'z']]);
    expect(t.records.map((x) => x.line)).toEqual([1, 3]);
    const text = `${HEADER5},Notes\nA1,Discovery,1000,2027-01-15,2026-10-20,"first\nsecond"\nA2,Qualified,2000,2027-01-16,2026-10-21,none\n`;
    const r = parseOk(enc(text));
    expect(r.rows.map((x) => x.line)).toEqual([2, 4]);
    expect(finding(r.findings, 'ragged_row')).toBeUndefined();
  });

  it('parse_rfc4180_doubled_quotes', () => {
    expect(tokenize('a,"he said ""hi""",c', ',').records[0].cells).toEqual(['a', 'he said "hi"', 'c']);
    expect(tokenize('"",x', ',').records[0].cells).toEqual(['', 'x']);
  });

  it('crlf_and_lf_both_accepted', () => {
    const crlf = parseOk(fixtureBytes('14_spreadsheet_messy'));
    const text = new TextDecoder().decode(fixtureBytes('14_spreadsheet_messy')).replace(/\r\n/g, '\n');
    const lf = parseOk(enc(text));
    expect(JSON.stringify(lf.rows)).toBe(JSON.stringify(crlf.rows));
    const inline = parseOk(enc(`${HEADER5}\r\nA1,Discovery,1000,2027-01-15,2026-10-20\r\nA2,Discovery,2000,2027-01-15,2026-10-20`));
    expect(inline.rows).toHaveLength(2);
  });

  it('ragged_row_excluded_with_reason', () => {
    const lines = [HEADER5];
    for (let i = 1; i <= 20; i++) lines.push(`A${i},Discovery,1000,2027-01-15,2026-10-20`);
    lines[5] = 'A5,Discovery,1000,2027-01-15,2026-10-20,extra';
    const r = parseOk(enc(lines.join('\n')));
    expect(r.rows).toHaveLength(19);
    expect(r.rows.some((x) => x.line === 6)).toBe(false);
    const f = finding(r.findings, 'ragged_row');
    expect(f?.count).toBe(1);
    expect(f?.lines).toEqual([6]);
  });

  it('more_than_ten_percent_ragged_rejects_file', () => {
    const make = (raggedCount: number) => {
      const lines = [HEADER5];
      for (let i = 1; i <= 10; i++) lines.push(i <= raggedCount ? `A${i},Discovery` : `A${i},Discovery,1000,2027-01-15,2026-10-20`);
      return enc(lines.join('\n'));
    };
    expect(errCode(make(2))).toBe('too_many_ragged_rows');
    expect(errCode(make(1))).toBeUndefined(); // exactly 10 percent is not more than 10 percent
  });

  it('duplicate_header_rejected', () => {
    expect(errCode(enc('Record ID,Deal Stage,Amount,Amount,Close Date,Create Date\nA,B,C,D,E,F\n'))).toBe('duplicate_header');
    expect(errCode(enc('Record ID,Deal Stage,Amount, amount ,Close Date,Create Date\nA,B,C,D,E,F\n'))).toBe('duplicate_header');
  });

  it('footer_rows_skipped_with_warning', () => {
    const r = parseOk(fixtureBytes('13_salesforce_latin1_footer'));
    expect(r.rows).toHaveLength(5);
    const f = finding(r.findings, 'footer_rows_skipped');
    expect(f?.count).toBe(2);
    expect(r.meta.rowsRead).toBe(5);
  });

  it('totals_row_and_blank_rows_skipped', () => {
    const r = parseOk(fixtureBytes('14_spreadsheet_messy'));
    expect(r.rows.map((x) => x.line)).toEqual([2, 3, 4, 5, 6, 7, 8, 10]);
    const f = finding(r.findings, 'totals_row_skipped');
    expect(f?.lines).toEqual([11]);
    expect(finding(r.findings, 'ragged_row')).toBeUndefined();
    expect(r.meta.rowsRead).toBe(8);
  });

  it('file_over_max_bytes_rejected_before_parse (default limit)', () => {
    const big = new Uint8Array(26214401).fill(0x61);
    const r = parseFile(big, opts());
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe('file_too_large');
  });

  it('serialize_and_tokenize_agree_on_fixture_14_table', () => {
    const t = tableOf(fixtureBytes('14_spreadsheet_messy'));
    expect(tokenize(serialize(t), ',').records.map((x) => x.cells)).toEqual(t);
    expect(mutate('14_spreadsheet_messy', () => undefined).length).toBeGreaterThan(0);
  });
});
