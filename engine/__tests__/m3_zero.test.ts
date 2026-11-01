import { describe, expect, it } from 'vitest';
import { percentileNearestRank } from '../heartbeat';
import { LABELS } from '../labels';
import * as P from '../params';
import { buildTrace } from '../trace';
import { classifyZero, REASON_CODES } from '../zero';
import { auditFixture, enc, fixtureBytes, forFixture, HEADER6, mutate, opts, params, parseOk } from './helpers';
import { heartbeatOf, has, pick, zeroFixture, zeroRows, zeroRun } from './m3_helpers';
import {
  buildMonthlyCloses, M_ALL_CLOSED, M_AMOUNT_DARK, M_AMOUNT_NEVER, M_BULK_TOUCH, M_FEW_ROWS, M_MODIFIED_AFTER_AS_OF, M_NO_HISTORY,
  M_NO_MODIFIED_COLUMN, M_REAL_ZERO_WIN_RATE, M_REAL_ZERO_WIN_RATE_ONLY, M_TYPO_YEAR, M_UNMAPPED_ONLY,
} from './mutate';

const AS_OF_DEC = params({ asOf: '2026-12-15' });

describe('M3 evidence', () => {
  it('evidence_active_days_and_usual_gap_fixture01', () => {
    const hb = heartbeatOf('01_clean_hubspot_shape', params());
    expect(hb.activeDays).toBe(15);
    expect(hb.usualGap).toBe(6);
    expect(hb.staleThreshold).toBe(12);
    expect(hb.daysSinceNewest).toBe(1);
    // the verdict carries the same numbers
    const v = pick(zeroFixture('02_quiet_week_real'), 'H2');
    expect([v.evidence.activeDays, v.evidence.usualGap, v.evidence.staleThreshold, v.evidence.daysSinceNewest]).toEqual([15, 6, 12, 1]);
  });

  it('evidence_p90_nearest_rank_small_sets', () => {
    // [gaps in the set, expected 90th percentile by nearest rank]
    const table: [number, number][] = [[1, 1], [2, 2], [10, 9], [14, 13], [15, 14]];
    for (const [n, want] of table) {
      const gaps = Array.from({ length: n }, (_, i) => i + 1);
      expect([n, percentileNearestRank(gaps, 0.9)]).toEqual([n, want]);
    }
    expect(percentileNearestRank([], 0.9)).toBeNull();
  });
});

describe('M3 acceptance tests', () => {
  it('zero_nonzero_value_gets_no_verdict', () => {
    const { o, p } = forFixture('01_clean_hubspot_shape');
    const { rows } = parseOk(fixtureBytes('01_clean_hubspot_shape'), o);
    expect(zeroRows(rows, p)).toEqual([]);
    const card = buildTrace('H1', rows, p)[0];
    expect(classifyZero(card, { rows, params: p, hasModifiedColumn: true })).toBeNull();
  });

  it('zero_quiet_week_is_real (AT1) [02]', () => {
    const v = pick(zeroFixture('02_quiet_week_real'), 'H2');
    expect([v.verdict, v.rule, v.reason]).toEqual(['REAL', 'Z7', 'quiet_period']);
    expect(v.evidence).toMatchObject({
      activeDays: 15, usualGap: 6, staleThreshold: 12, daysSinceNewest: 1, modifiedDaysInPeriod: 2,
      baselineChecked: 8, producedPeriods: 8, fieldPopulated: { num: 14, den: 14 },
    });
    expect(v.period).toEqual({ start: '2026-10-19', end: '2026-10-25' });
  });

  it('zero_dead_pipe_is_broken (AT2) [03]', () => {
    const vs = zeroRun(fixtureBytes('03_dead_pipe_stale'), opts(), AS_OF_DEC);
    const h2 = pick(vs, 'H2');
    expect([h2.verdict, h2.rule, h2.reason]).toEqual(['BROKEN', 'Z4', 'export_stale']);
    expect(h2.period).toEqual({ start: '2026-12-07', end: '2026-12-13' });
    expect(h2.evidence).toMatchObject({ daysSinceNewest: 47, usualGap: 6, staleThreshold: 12 });
    const closed = pick(vs, 'closed_count');
    expect([closed.verdict, closed.rule, closed.reason]).toEqual(['BROKEN', 'Z4', 'export_stale']);
    expect(has(vs, 'H3')).toBe(false); // the rate is undefined, so no rate is printed and no verdict is given for it
    expect(has(vs, 'H1')).toBe(false);
    // the sidecar of fixture 03 carries the same date
    expect(auditFixture('03_dead_pipe_stale').cards.length).toBeGreaterThan(0);
  });

  it('zero_blank_is_not_zero (AT3) M_AMOUNT_DARK', () => {
    const v = pick(zeroRun(M_AMOUNT_DARK()), 'H2');
    expect([v.verdict, v.rule, v.reason]).toEqual(['BROKEN', 'Z2', 'field_went_blank']);
    expect(v.evidence.darkRows).toBe(6);
    expect(v.verdict).not.toBe('REAL');
  });

  it('zero_never_populated_is_unknown M_AMOUNT_NEVER', () => {
    const v = pick(zeroRun(M_AMOUNT_NEVER()), 'H1');
    expect([v.verdict, v.rule, v.reason]).toEqual(['UNKNOWN', 'Z2b', 'field_never_populated']);
    expect(v.evidence.fieldPopulated?.num).toBe(0);
  });

  it('zero_unknown_is_default (AT4) inline: no history, no companion measure', () => {
    const v = pick(zeroRun(M_NO_HISTORY()), 'H2');
    expect([v.verdict, v.rule, v.reason]).toEqual(['UNKNOWN', 'Z8', 'no_evidence']);
    expect(v.evidence.producedPeriods).toBe(0);
  });

  it('zero_stage_rename_is_broken (AT5) [15]', () => {
    const v = pick(zeroFixture('15_stage_rename_broken_win_rate'), 'H3');
    expect([v.verdict, v.rule, v.reason]).toEqual(['BROKEN', 'Z1', 'unmapped_label']);
    expect(v.evidence.unmapped).toEqual([{ label: 'Closed Won (v2)', count: 3, lines: [3, 5, 7], firstSeen: '2026-09-10', lastSeen: '2026-09-22' }]);
    expect(v.line).toContain('Closed Won (v2)');
  });

  it('zero_real_win_rate_zero M_REAL_ZERO_WIN_RATE', () => {
    const v = pick(zeroRun(M_REAL_ZERO_WIN_RATE()), 'H3');
    expect([v.verdict, v.rule, v.reason]).toEqual(['REAL', 'Z7', 'no_wins_in_period']);
    expect(v.evidence.producedPeriods).toBeGreaterThanOrEqual(1);
    // Without a single earlier win there is no positive evidence, so the default holds.
    const bare = pick(zeroRun(M_REAL_ZERO_WIN_RATE_ONLY()), 'H3');
    expect([bare.verdict, bare.rule, bare.reason]).toEqual(['UNKNOWN', 'Z8', 'no_evidence']);
  });

  it('zero_too_little_history_unknown M_FEW_ROWS', () => {
    const v = pick(zeroRun(M_FEW_ROWS()), 'H2');
    expect([v.verdict, v.rule, v.reason]).toEqual(['UNKNOWN', 'Z6', 'insufficient_activity_history']);
    expect(v.evidence.activeDays).toBe(4);
  });

  it('zero_bulk_touch_unknown M_BULK_TOUCH', () => {
    const v = pick(zeroRun(M_BULK_TOUCH()), 'H2');
    expect([v.verdict, v.rule, v.reason]).toEqual(['UNKNOWN', 'Z6', 'insufficient_activity_history']);
    expect(v.evidence.activeDays).toBe(1);
  });

  it('zero_closed_count_real_rate_undefined (example 7)', () => {
    const vs = zeroRun(buildMonthlyCloses([4, 0, 3, 2, 0, 5, 1, 3]));
    const v = pick(vs, 'closed_count');
    expect([v.verdict, v.rule, v.reason]).toEqual(['REAL', 'Z7', 'quiet_period']);
    expect(v.evidence).toMatchObject({ activeDays: 14, usualGap: 5, staleThreshold: 10, daysSinceNewest: 2, producedPeriods: 6, baselineChecked: 8 });
    expect(has(vs, 'H3')).toBe(false); // the rate is printed as "no closed deals in this period", with no verdict
    expect(LABELS.trace.undefinedRate).toBe('No closed deals in this period.');
  });

  it('zero_empty_open_pipeline_real M_ALL_CLOSED', () => {
    const v = pick(zeroRun(M_ALL_CLOSED()), 'H1');
    expect([v.verdict, v.rule, v.reason]).toEqual(['REAL', 'Z7', 'quiet_period']);
    expect(v.note).toBe('An empty open pipeline is a fact worth a look.');
  });

  it('zero_only_unmapped_labels_broken M_UNMAPPED_ONLY', () => {
    const v = pick(zeroRun(M_UNMAPPED_ONLY()), 'H1');
    expect([v.verdict, v.rule, v.reason]).toEqual(['BROKEN', 'Z1', 'unmapped_label']);
    expect(v.evidence.unmapped.map((u) => u.label).sort()).toEqual(['Phase 2 Closed Review', 'Won Pending']);
    expect(v.line).toContain('Phase 2 Closed Review');
    expect(v.line).toContain('Won Pending');
  });

  it('zero_per_currency_real_and_unknown [07]', () => {
    const vs = zeroFixture('07_currency_mixed');
    const eur = pick(vs, 'H2', 'EUR');
    expect([eur.verdict, eur.rule, eur.reason]).toEqual(['REAL', 'Z7', 'quiet_period']);
    expect(eur.evidence).toMatchObject({ producedPeriods: 2, baselineChecked: 8 });
    const eurClosed = pick(vs, 'closed_count', 'EUR');
    expect([eurClosed.verdict, eurClosed.rule, eurClosed.reason]).toEqual(['UNKNOWN', 'Z8', 'no_evidence']);
    expect(has(vs, 'H2', 'USD')).toBe(false); // USD is nonzero, so no verdict
    expect(vs).toHaveLength(2);
  });

  it('zero_typo_years_broken M_TYPO_YEAR', () => {
    const v = pick(zeroRun(M_TYPO_YEAR()), 'H2');
    expect([v.verdict, v.rule, v.reason]).toEqual(['BROKEN', 'Z3', 'dates_unusable']);
    expect(v.evidence.badDates).toEqual({ num: 5, den: 8 });
  });

  it('zero_no_modified_column_unknown M_NO_MODIFIED_COLUMN', () => {
    const vs = zeroRun(M_NO_MODIFIED_COLUMN());
    expect(vs.length).toBeGreaterThan(0);
    for (const v of vs) expect([v.verdict, v.rule, v.reason]).toEqual(['UNKNOWN', 'Z5', 'no_last_modified']);
  });

  it('zero_modified_after_as_of_warns_and_treats_gap_zero', () => {
    const v = pick(zeroRun(M_MODIFIED_AFTER_AS_OF()), 'H2');
    expect(v.warnings).toContain('modified_after_as_of');
    expect(v.evidence.daysSinceNewest).toBe(0);
    expect(pick(zeroFixture('02_quiet_week_real'), 'H2').warnings).toEqual([]);
  });

  it('zero_threshold_comes_from_history_not_constant', () => {
    // Two files, same days since newest (20), different usual gaps. The threshold follows the gaps.
    const build = (days: string[]) =>
      enc([HEADER6, ...days.map((d, i) => `X${i},Discovery,1000,2027-01-15,2026-0${(i % 6) + 1}-10,${d}`)].join('\n') + '\n');
    const fast = ['2026-09-01', '2026-09-02', '2026-09-03', '2026-09-04', '2026-09-05', '2026-09-06', '2026-09-07', '2026-09-08', '2026-09-09', '2026-09-10'];
    const slow = ['2026-06-01', '2026-06-11', '2026-06-21', '2026-07-01', '2026-07-11', '2026-07-21', '2026-07-31', '2026-08-10', '2026-08-20', '2026-09-10'];
    const a = pick(zeroRun(build(fast), opts(), params({ asOf: '2026-09-30' })), 'H2');
    const b = pick(zeroRun(build(slow), opts(), params({ asOf: '2026-09-30' })), 'H2');
    expect(a.evidence.daysSinceNewest).toBe(20);
    expect(b.evidence.daysSinceNewest).toBe(20);
    expect(a.evidence.staleThreshold).toBe(2); // usual gap 1
    expect(b.evidence.staleThreshold).toBe(20); // usual gap 10
    expect([a.verdict, a.reason]).toEqual(['BROKEN', 'export_stale']);
    expect(b.reason).not.toBe('export_stale');
  });

  it('zero_rule_order_z1_before_z4', () => {
    // Fixture 15 read a month later: the file is stale and the October close sits on a label the engine cannot place.
    const { o } = forFixture('15_stage_rename_broken_win_rate');
    const vs = zeroRun(fixtureBytes('15_stage_rename_broken_win_rate'), o, params({ asOf: '2026-11-30' }));
    const v = pick(vs, 'closed_count');
    expect([v.verdict, v.rule, v.reason]).toEqual(['BROKEN', 'Z1', 'unmapped_label']);
    expect(v.evidence.daysSinceNewest).toBeGreaterThan(v.evidence.staleThreshold as number); // Z4 was also true
  });

  it('zero_dark_min_rows_respected [14]', () => {
    const vs = zeroFixture('14_spreadsheet_messy');
    const v = pick(vs, 'H2');
    expect(v.evidence.darkRows).toBe(1);
    expect([v.verdict, v.rule, v.reason]).toEqual(['UNKNOWN', 'Z6', 'insufficient_activity_history']);
    expect(v.evidence.activeDays).toBe(8);
  });

  it('zero_evidence_line_uses_only_file_numbers (examples 1, 2, 5)', () => {
    expect(pick(zeroFixture('02_quiet_week_real'), 'H2').line).toBe(
      'Zero new pipeline in the week of Oct 19 to Oct 25. Rows were modified on 2 days in that week. The usual gap between active days in this file is 6 days. Rows were created in 8 of the 8 weeks before.',
    );
    expect(pick(zeroRun(fixtureBytes('03_dead_pipe_stale'), opts(), AS_OF_DEC), 'H2').line).toBe(
      'Zero new pipeline in the week of Dec 7 to Dec 13. The newest row was modified 47 days before the as of date. The usual gap between active days is 6 days, so the stale threshold is 12 days.',
    );
    expect(pick(zeroFixture('15_stage_rename_broken_win_rate'), 'H3').line).toBe(
      'Zero wins among 3 closed deals in the month of Sep 1 to Sep 30. The stage label "Closed Won (v2)" is on 3 rows in scope (lines 3, 5, 7) and the audit could not place it as open, won or lost. The newest row with a won label closed on Aug 12.',
    );
  });
});

describe('M3 twelve worked examples (SPEC 6.4, typed by hand)', () => {
  type Row = { n: number; bytes: () => Uint8Array; p?: () => ReturnType<typeof params>; metric: 'H1' | 'H2' | 'H3' | 'closed_count'; currency?: string; rule: string; verdict: string; reason: string };
  const rows: Row[] = [
    { n: 1, bytes: () => fixtureBytes('02_quiet_week_real'), metric: 'H2', rule: 'Z7', verdict: 'REAL', reason: 'quiet_period' },
    { n: 2, bytes: () => fixtureBytes('03_dead_pipe_stale'), p: () => AS_OF_DEC, metric: 'H2', rule: 'Z4', verdict: 'BROKEN', reason: 'export_stale' },
    { n: 3, bytes: M_AMOUNT_DARK, metric: 'H2', rule: 'Z2', verdict: 'BROKEN', reason: 'field_went_blank' },
    { n: 4, bytes: M_AMOUNT_NEVER, metric: 'H1', rule: 'Z2b', verdict: 'UNKNOWN', reason: 'field_never_populated' },
    { n: 5, bytes: () => fixtureBytes('15_stage_rename_broken_win_rate'), metric: 'H3', rule: 'Z1', verdict: 'BROKEN', reason: 'unmapped_label' },
    { n: 6, bytes: M_FEW_ROWS, metric: 'H2', rule: 'Z6', verdict: 'UNKNOWN', reason: 'insufficient_activity_history' },
    { n: 7, bytes: () => buildMonthlyCloses([4, 0, 3, 2, 0, 5, 1, 3]), metric: 'closed_count', rule: 'Z7', verdict: 'REAL', reason: 'quiet_period' },
    { n: 8, bytes: M_BULK_TOUCH, metric: 'H2', rule: 'Z6', verdict: 'UNKNOWN', reason: 'insufficient_activity_history' },
    { n: 9, bytes: M_ALL_CLOSED, metric: 'H1', rule: 'Z7', verdict: 'REAL', reason: 'quiet_period' },
    { n: 10, bytes: M_UNMAPPED_ONLY, metric: 'H1', rule: 'Z1', verdict: 'BROKEN', reason: 'unmapped_label' },
    { n: 11, bytes: () => fixtureBytes('07_currency_mixed'), metric: 'H2', currency: 'EUR', rule: 'Z7', verdict: 'REAL', reason: 'quiet_period' },
    { n: 12, bytes: M_TYPO_YEAR, metric: 'H2', rule: 'Z3', verdict: 'BROKEN', reason: 'dates_unusable' },
  ];
  it('zero_all_twelve_worked_examples', () => {
    expect(rows).toHaveLength(12);
    for (const r of rows) {
      const v = pick(zeroRun(r.bytes(), opts(), r.p ? r.p() : params()), r.metric, r.currency);
      expect([r.n, v.verdict, v.rule, v.reason]).toEqual([r.n, r.verdict, r.rule, r.reason]);
    }
  });
});

describe('M3 parameters and codes', () => {
  it('zero_params_printed_in_report_data', () => {
    const real = pick(zeroFixture('02_quiet_week_real'), 'H2');
    expect(real.params).toMatchObject({ minActiveDays: P.MIN_ACTIVE_DAYS, staleMultiple: P.STALE_MULTIPLE, baselinePeriods: P.BASELINE_PERIODS, fieldPopMin: P.FIELD_POP_MIN });
    const typo = pick(zeroRun(M_TYPO_YEAR()), 'H2');
    expect(typo.params).toEqual({ badDateMax: P.BAD_DATE_MAX });
    const dark = pick(zeroRun(M_AMOUNT_DARK()), 'H2');
    expect(dark.params).toMatchObject({ darkMinRows: P.DARK_MIN_ROWS, fieldPopMin: P.FIELD_POP_MIN });
    // A changed default is what gets printed.
    const { o } = forFixture('02_quiet_week_real');
    const changed = pick(zeroRun(fixtureBytes('02_quiet_week_real'), o, params({ minActiveDays: 20 })), 'H2');
    expect([changed.rule, changed.params.minActiveDays]).toEqual(['Z6', 20]);
  });

  it('zero_reason_codes_are_closed_set', () => {
    expect(new Set(REASON_CODES).size).toBe(REASON_CODES.length);
    expect(REASON_CODES).toContain('no_wins_in_period'); // added to the rule table for win metrics
    const all = [
      ...zeroFixture('02_quiet_week_real'), ...zeroFixture('07_currency_mixed'), ...zeroFixture('14_spreadsheet_messy'), ...zeroFixture('15_stage_rename_broken_win_rate'),
      ...zeroRun(M_AMOUNT_DARK()), ...zeroRun(M_AMOUNT_NEVER()), ...zeroRun(M_NO_HISTORY()), ...zeroRun(M_REAL_ZERO_WIN_RATE()), ...zeroRun(M_TYPO_YEAR()),
      ...zeroRun(M_NO_MODIFIED_COLUMN()), ...zeroRun(M_UNMAPPED_ONLY()), ...zeroRun(M_ALL_CLOSED()), ...zeroRun(M_BULK_TOUCH()),
    ];
    expect(all.length).toBeGreaterThan(10);
    for (const v of all) {
      expect(REASON_CODES).toContain(v.reason);
      expect(['REAL', 'BROKEN', 'UNKNOWN']).toContain(v.verdict);
      expect(v.line.length).toBeGreaterThan(0);
    }
  });

  it('zero_runAudit_carries_the_verdicts', () => {
    const res = auditFixture('02_quiet_week_real');
    expect(res.zeros).toEqual(zeroFixture('02_quiet_week_real'));
  });

  it('zero_constants_live_in_params_only', async () => {
    const fs = await import('node:fs');
    const src = fs.readFileSync(new URL('../zero.ts', import.meta.url), 'utf8');
    const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '').replace(/'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`/g, '""');
    const nums = (code.match(/(?<![\w.])\d+(?:\.\d+)?(?![\w])/g) ?? []).filter((n) => n !== '0' && n !== '1');
    expect(nums).toEqual([]);
    expect(fs.readFileSync(new URL('../params.ts', import.meta.url), 'utf8')).toMatch(/BASELINE_PERIODS/);
  });
});

// keep mutate in the import list used (lint of unused imports is not run on tests)
void mutate;
