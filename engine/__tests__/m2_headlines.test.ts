import { describe, expect, it } from 'vitest';
import { LABELS } from '../labels';
import {
  auditFixture, auditOk, card, enc, finding, fixtureBytes, forFixture, mutate, opts, params, HEADER6,
} from './helpers';

const lines = (c: { excluded: { line: number }[] }) => c.excluded.map((e) => e.line);

describe('M2 headline numbers', () => {
  it('h1_clean_matches_hand_sum', () => {
    const c = card(auditFixture('01_clean_hubspot_shape'), 'H1');
    expect(c.valueMinor).toBe(10300000); // 103000.00
    expect(c.includedCount).toBe(10);
    expect(c.includedLines).toEqual([9, 10, 11, 12, 13, 14, 15, 16, 17, 18]);
    expect(c.excluded).toEqual([]);
  });

  it('h2_clean_matches_hand_sum', () => {
    const c = card(auditFixture('01_clean_hubspot_shape'), 'H2');
    expect(c.valueMinor).toBe(1650000); // 16500.00
    expect(c.includedLines).toEqual([16, 17]);
    expect(c.period).toEqual({ start: '2026-10-19', end: '2026-10-25' });
  });

  it('h3_clean_win_rate', () => {
    const c = card(auditFixture('01_clean_hubspot_shape'), 'H3');
    expect(c.rate).toEqual({ num: 3, den: 6 });
    expect(c.wonAmountMinor).toBe(3450000);
    expect(c.lostAmountMinor).toBe(2200000);
    expect(c.period).toEqual({ start: '2026-09-01', end: '2026-09-30' });
    expect(c.valueIsZero).toBe(false);
  });

  it('h3_undefined_when_no_closed_rows', () => {
    const res = auditOk(fixtureBytes('01_clean_hubspot_shape'), opts(), params({ asOf: '2026-12-15' }));
    const c = card(res, 'H3');
    expect(c.rate).toBeNull(); // undefined, not 0
    expect(c.includedCount).toBe(0);
    expect(c.valueIsZero).toBe(true);
    expect(JSON.stringify(c)).not.toContain('"num":0');
  });

  it('headlines_for_fixtures_02_05_06', () => {
    const quiet = auditFixture('02_quiet_week_real');
    expect(card(quiet, 'H1').valueMinor).toBe(10300000);
    expect(card(quiet, 'H2')).toMatchObject({ valueMinor: 0, includedCount: 0, valueIsZero: true });
    expect(card(quiet, 'H3').rate).toEqual({ num: 3, den: 6 });
    // fixtures 05 and 06 change nothing about the headlines
    for (const name of ['05_missing_owner', '06_stage_skipped']) {
      const res = auditFixture(name);
      expect([name, card(res, 'H1').valueMinor]).toEqual([name, 10300000]);
      expect([name, card(res, 'H2').valueMinor]).toEqual([name, 1650000]);
      expect([name, card(res, 'H3').rate]).toEqual([name, { num: 3, den: 6 }]);
    }
    expect(finding(auditFixture('05_missing_owner').findings, 'blank_owner')?.count).toBe(3);
    expect(auditFixture('06_stage_skipped').meta.droppedHeaders).toEqual(['Deal Name', 'Pipeline', 'Date entered Qualified', 'Date entered Proposal']);
  });

  it('trace_duplicates_h1_104000 [04]', () => {
    const res = auditFixture('04_duplicate_ids');
    const h1 = card(res, 'H1');
    expect(h1.valueMinor).toBe(10400000);
    expect(h1.includedCount).toBe(10);
    expect(h1.excluded).toEqual([
      { line: 12, reason: 'duplicate_conflict', label: 'Proposal' },
      { line: 19, reason: 'duplicate_exact', label: 'Negotiation' },
    ]);
    expect(card(res, 'H2').valueMinor).toBe(1650000);
    expect(card(res, 'H3').rate).toEqual({ num: 3, den: 6 });
    expect(finding(res.findings, 'duplicate_id_conflict')?.count).toBe(1);
  });

  it('trace_unmapped_stage_excluded_and_listed [15]', () => {
    const res = auditFixture('15_stage_rename_broken_win_rate');
    const h3 = card(res, 'H3');
    expect(h3.rate).toEqual({ num: 0, den: 3 });
    expect(h3.excluded).toEqual([
      { line: 3, reason: 'unmapped_stage', label: 'Closed Won (v2)' },
      { line: 5, reason: 'unmapped_stage', label: 'Closed Won (v2)' },
      { line: 7, reason: 'unmapped_stage', label: 'Closed Won (v2)' },
    ]);
    expect(h3.unmappedInPeriod).toEqual([
      { line: 3, label: 'Closed Won (v2)' },
      { line: 5, label: 'Closed Won (v2)' },
      { line: 7, label: 'Closed Won (v2)' },
    ]);
    expect(h3.valueIsZero).toBe(true);
    const h1 = card(res, 'H1');
    expect(h1.valueMinor).toBe(10300000);
    expect(h1.includedCount).toBe(10);
    expect(card(res, 'H2').valueMinor).toBe(1650000);
    const drift = finding(res.findings, 'stage_vocab_drift');
    expect(drift).toBeDefined();
    expect(drift?.detail?.label).toBe('Closed Won (v2)');
    expect(drift?.detail?.firstSeen).toBe('2026-09-10'); // newest of modified, close, created day on the first row that carries it
    expect(drift?.detail?.lastSeen).toBe('2026-10-14');
  });

  it('trace_currency_partitions_never_mixed [07]', () => {
    const res = auditFixture('07_currency_mixed');
    expect(card(res, 'H1', 'USD')).toMatchObject({ valueMinor: 6850000, includedCount: 8 });
    expect(card(res, 'H1', 'EUR')).toMatchObject({ valueMinor: 3450000, includedCount: 2 });
    expect(card(res, 'H2', 'USD').valueMinor).toBe(1650000);
    expect(card(res, 'H2', 'EUR').valueMinor).toBe(0);
    expect(card(res, 'H3', 'USD').rate).toEqual({ num: 3, den: 6 });
    expect(card(res, 'H3', 'EUR').rate).toBeNull();
    expect(res.cards).toHaveLength(6);
    expect(res.cards.some((c) => c.metricId !== 'H3' && c.valueMinor === 10300000)).toBe(false);
    expect(finding(res.findings, 'mixed_currency')).toBeDefined();
  });

  it('trace_no_currency_column_single_unstated_partition [01]', () => {
    const res = auditFixture('01_clean_hubspot_shape');
    expect(res.cards).toHaveLength(3);
    expect(res.cards.every((c) => c.currency === 'UNSTATED')).toBe(true);
  });

  it('trace_timezone_changes_week_bucket [08]', () => {
    const chi = auditFixture('08_timezone_shift');
    expect(card(chi, 'H2')).toMatchObject({ valueMinor: 1100000, includedCount: 4 });
    expect(card(chi, 'H1').valueMinor).toBe(2200000);
    const utc = auditFixture('08_timezone_shift', 'UTC');
    expect(card(utc, 'H2')).toMatchObject({ valueMinor: 1000000, includedCount: 4 });
    expect(card(utc, 'H1').valueMinor).toBe(2200000);
    expect(card(chi, 'H2').includedLines).toEqual([2, 4, 6, 7]);
    expect(card(utc, 'H2').includedLines).toEqual([4, 5, 6, 7]);
    expect(chi.meta.reportTz).toBe('America/Chicago');
    expect(utc.meta.reportTz).toBe('UTC');
  });

  it('trace_datetime_without_offset_warns [08 T06]', () => {
    const res = auditFixture('08_timezone_shift');
    const f = finding(res.findings, 'datetime_without_offset_assumed_tz');
    expect(f?.lines).toEqual([7]);
  });

  it('trace_salesforce_shape_headlines [13]', () => {
    const res = auditFixture('13_salesforce_latin1_footer');
    expect(card(res, 'H1', 'USD')).toMatchObject({ valueMinor: 4050050, includedCount: 3 }); // 40500.50
    expect(card(res, 'H2', 'USD')).toMatchObject({ valueMinor: 550050, includedCount: 1 }); // 5500.50
    expect(card(res, 'H3', 'USD').rate).toEqual({ num: 1, den: 2 });
  });

  it('trace_spreadsheet_shape_headlines [14]', () => {
    const res = auditFixture('14_spreadsheet_messy');
    expect(card(res, 'H1')).toMatchObject({ valueMinor: 2400000, includedLines: [6, 8] });
    expect(card(res, 'H2').valueMinor).toBe(0);
    expect(card(res, 'H3').rate).toEqual({ num: 2, den: 4 });
  });

  it('trace_lists_excluded_rows_with_reason [14]', () => {
    const res = auditFixture('14_spreadsheet_messy');
    const h1 = card(res, 'H1');
    expect(h1.excluded).toEqual([
      { line: 7, reason: 'invalid_amount', label: 'Negotiating' },
      { line: 10, reason: 'blank_amount', label: 'Open' },
    ]);
    expect(h1.byReason).toEqual({ invalid_amount: 1, blank_amount: 1 });
    const h2 = card(res, 'H2');
    expect(h2.excluded).toEqual([{ line: 10, reason: 'blank_amount', label: 'Open' }]);
    expect(h2.notComputable).toBe(false); // one blank row is below dark_min_rows
    expect(h2.valueMinor).toBe(0);
  });

  it('trace_formula_fixture_totals [11]', () => {
    const res = auditFixture('11_formula_injection');
    const h1 = card(res, 'H1');
    expect(h1.valueMinor).toBe(3600000);
    expect(h1.includedCount).toBe(8);
    expect(h1.excluded.map((e) => [e.line, e.reason])).toEqual([[9, 'invalid_amount'], [10, 'negative_amount']]);
    expect(JSON.stringify(res)).not.toContain('HYPERLINK');
  });

  it('trace_reason_priority_order', () => {
    // duplicate_conflict beats blank_amount
    const dup = auditOk(mutate('04_duplicate_ids', (t) => { t[11][3] = ''; }), opts(), forFixture('04_duplicate_ids').p);
    expect(card(dup, 'H1').excluded.find((e) => e.line === 12)?.reason).toBe('duplicate_conflict');

    const rows = [
      'A1,Closed Won (v2),,2027-01-15,notadate,2026-10-21', // invalid_date beats unmapped_stage and blank_amount
      'A2,Phase 2 Closed Review,,2027-01-15,2026-10-20,2026-10-21', // unmapped_stage beats blank_amount
      'A3,Discovery,,2027-01-15,2062-01-01,2026-10-21', // impossible_date beats blank_amount
      'A4,Discovery,25k,2027-01-15,2026-10-20,2026-10-21', // invalid_amount
      'A5,Discovery,-5,2027-01-15,2026-10-20,2026-10-21', // negative_amount
      'A6,Discovery,10,2027-01-15,2026-10-20,2026-10-21',
    ];
    const res = auditOk(enc(`${HEADER6}\n${rows.join('\n')}\n`), opts(), params());
    const h1 = card(res, 'H1');
    expect(h1.excluded.map((e) => [e.line, e.reason])).toEqual([
      [2, 'invalid_date'],
      [3, 'unmapped_stage'],
      [4, 'impossible_date'],
      [5, 'invalid_amount'],
      [6, 'negative_amount'],
    ]);
    expect(h1.valueMinor).toBe(1000);
  });

  it('h1_ignores_rows_created_after_as_of_as_impossible', () => {
    const res = auditOk(enc(`${HEADER6}\nA1,Discovery,500,2027-01-15,2026-11-20,2026-10-21\n`), opts(), params());
    expect(card(res, 'H1').excluded[0]?.reason).toBe('impossible_date');
    expect(card(res, 'H1').valueMinor).toBe(0);
  });

  it('h3_closed_row_with_close_before_created_is_impossible', () => {
    const res = auditOk(enc(`${HEADER6}\nA1,Closed Won,500,2026-09-10,2026-09-20,2026-10-21\nA2,Closed Won,700,2026-09-12,2026-09-01,2026-10-21\n`), opts(), params());
    const h3 = card(res, 'H3');
    expect(h3.rate).toEqual({ num: 1, den: 1 });
    expect(h3.excluded.map((e) => [e.line, e.reason])).toEqual([[2, 'impossible_date']]);
  });

  it('all_amounts_blank_is_not_computable_not_zero', () => {
    const body = ['A1', 'A2', 'A3'].map((id) => `${id},Discovery,,2027-01-15,2026-10-20,2026-10-21`).join('\n');
    const res = auditOk(enc(`${HEADER6}\n${body}\n`), opts(), params());
    const h1 = card(res, 'H1');
    expect(h1.notComputable).toBe(true);
    expect(h1.valueMinor).toBeNull();
    expect(h1.valueIsZero).toBe(true);
    expect(card(res, 'H2').notComputable).toBe(true);
  });

  it('labels_hold_the_trace_words', () => {
    expect(LABELS.trace.noWeakHop).toBe('No weak hop found in this file.');
    expect(lines({ excluded: [{ line: 1 }] })).toEqual([1]);
  });
});
