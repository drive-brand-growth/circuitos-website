import { describe, expect, it } from 'vitest';
import { runAudit } from '../audit';
import { pickWeakest } from '../trace';
import { LABELS } from '../labels';
import { allFixtureNames, auditFixture, auditOk, card, fixtureBytes, forFixture, opts, params, parseOk } from './helpers';

const REASONS = ['ragged_row', 'duplicate_exact', 'duplicate_conflict', 'invalid_date', 'impossible_date', 'unmapped_stage', 'blank_amount', 'invalid_amount', 'negative_amount'];
const PARSEABLE = allFixtureNames().filter((n) => !n.startsWith('09_'));

describe('M2 trace structure', () => {
  it('trace_sum_equals_reported_number (AT6) on every parseable fixture', () => {
    let cards = 0;
    for (const name of PARSEABLE) {
      const { o, p } = forFixture(name);
      const parsed = parseOk(fixtureBytes(name), o);
      const byLine = new Map(parsed.rows.map((r) => [r.line, r]));
      const res = auditOk(fixtureBytes(name), o, p);
      for (const c of res.cards) {
        cards++;
        const inc = c.includedLines.map((l) => byLine.get(l)!);
        if (c.metricId === 'H3') {
          const won = inc.filter((r) => r.stageClass === 'WON').length;
          const lost = inc.filter((r) => r.stageClass === 'LOST').length;
          if (c.rate) expect([name, c.rate]).toEqual([name, { num: won, den: won + lost }]);
          else expect([name, won + lost]).toEqual([name, 0]);
          const wonSum = inc.filter((r) => r.stageClass === 'WON').reduce((s, r) => s + (r.amountMinor ?? 0), 0);
          expect([name, c.wonAmountMinor]).toEqual([name, wonSum]);
        } else if (c.valueMinor !== null) {
          const sum = inc.reduce((s, r) => s + (r.amountMinor as number), 0);
          expect([name, c.metricId, c.valueMinor]).toEqual([name, c.metricId, sum]);
          expect(inc.every((r) => r.amountState === 'ok' && r.currency === c.currency)).toBe(true);
        }
      }
    }
    expect(cards).toBeGreaterThan(30);
  });

  it('trace_every_in_scope_row_included_or_excluded_once', () => {
    for (const name of PARSEABLE) {
      const { o, p } = forFixture(name);
      const parsed = parseOk(fixtureBytes(name), o);
      const res = auditOk(fixtureBytes(name), o, p);
      for (const c of res.cards) {
        const total = parsed.rows.filter((r) => r.currency === c.currency).length;
        expect([name, c.metricId, c.includedCount + c.excluded.length + c.outOfScope]).toEqual([name, c.metricId, total]);
        const exLines = c.excluded.map((e) => e.line);
        expect(new Set(exLines).size).toBe(exLines.length);
        expect(exLines.some((l) => c.includedLines.includes(l))).toBe(false);
        for (const e of c.excluded) expect(REASONS).toContain(e.reason);
        expect(Object.values(c.byReason).reduce((a, b) => a + b, 0)).toBe(c.excluded.length);
      }
    }
  });

  it('trace_weakest_hop_selected_by_severity_and_tiebreak', () => {
    const z = { definition: 0, filter: 0, field_health: 0, source: 0, heartbeat: 0 };
    expect(pickWeakest(z)).toBeNull();
    expect(pickWeakest({ ...z, filter: 0.5, field_health: 0.5, heartbeat: 1 })).toBe('heartbeat');
    expect(pickWeakest({ ...z, filter: 0.3, field_health: 0.3 })).toBe('filter');
    expect(pickWeakest({ ...z, field_health: 0.2, heartbeat: 0.2 })).toBe('field_health');
    expect(pickWeakest({ ...z, filter: 0.1, field_health: 0.4 })).toBe('field_health');
    expect(pickWeakest({ definition: 0.5, filter: 0.5, field_health: 0.5, source: 0.5, heartbeat: 0.5 })).toBe('definition');

    const clean = card(auditFixture('01_clean_hubspot_shape'), 'H1');
    expect(clean.weakest).toBeNull();
    expect(clean.weakestSentence).toBe(LABELS.trace.noWeakHop);

    const messy = card(auditFixture('14_spreadsheet_messy'), 'H1');
    expect(messy.weakest?.kind).toBe('filter');
    expect(messy.weakest?.severity).toBe(0.5);
    expect(messy.weakestSentence).toBe('2 of 4 rows in scope were left out of this number. Most common reason: amount is blank.');

    const dead = auditOk(fixtureBytes('03_dead_pipe_stale'), opts(), params({ asOf: '2026-12-15' }));
    const h2 = card(dead, 'H2');
    expect(h2.weakest?.kind).toBe('heartbeat');
    expect(h2.weakestSentence).toBe(
      'The newest change in this file is 47 days before the as of date. The usual gap between active days is 6 days, so the stale threshold is 12 days.',
    );
  });

  it('trace_heartbeat_hop_matches_hand_facts [01 and 03]', () => {
    const hb = (c: ReturnType<typeof card>) => c.hops.find((h) => h.kind === 'heartbeat');
    expect(hb(card(auditFixture('01_clean_hubspot_shape'), 'H2'))).toMatchObject({
      activeDays: 15, usualGap: 6, staleThreshold: 12, newestModifiedDay: '2026-10-29', daysSinceNewest: 1, stale: false, modifiedAfterAsOf: false, severity: 0,
    });
    const dead = auditOk(fixtureBytes('03_dead_pipe_stale'), opts(), params({ asOf: '2026-12-15' }));
    expect(hb(card(dead, 'H1'))).toMatchObject({ daysSinceNewest: 47, stale: true, severity: 1 });
    expect(dead.findings.some((f) => f.code === 'export_stale_warning')).toBe(true);
    expect(card(dead, 'H1').valueMinor).toBe(10300000);
    expect(card(dead, 'H2').valueMinor).toBe(0);
    expect(card(dead, 'H3').rate).toBeNull();
  });

  it('trace_heartbeat_modified_after_as_of_is_flagged_and_gap_is_zero', () => {
    const res = auditOk(fixtureBytes('01_clean_hubspot_shape'), opts(), params({ asOf: '2026-10-20' }));
    expect(res.findings.some((f) => f.code === 'modified_after_as_of')).toBe(true);
    expect(card(res, 'H1').hops.find((h) => h.kind === 'heartbeat')).toMatchObject({ modifiedAfterAsOf: true, daysSinceNewest: 0 });
  });

  it('trace_hops_carry_source_and_field_health', () => {
    const c = card(auditFixture('01_clean_hubspot_shape'), 'H1');
    expect(c.hops.map((h) => h.kind)).toEqual(['definition', 'filter', 'field_health', 'source', 'heartbeat']);
    const src = c.hops.find((h) => h.kind === 'source');
    expect(src).toMatchObject({ rowsRead: 17, rowsUsed: 17, asOf: '2026-10-30', reportTz: 'America/Chicago', encoding: 'utf-8', delimiter: ',', droppedHeaders: ['Deal Name', 'Pipeline'] });
    const def = c.hops.find((h) => h.kind === 'definition');
    expect(def).toMatchObject({ text: 'Sum of amount over rows that are open as of 2026-10-30.' });
    const fh = card(auditFixture('14_spreadsheet_messy'), 'H1').hops.find((h) => h.kind === 'field_health');
    expect(fh).toMatchObject({ severity: 0.25 });
  });

  it('trace_ids_hashed_in_serialized_output_and_lines_present [01]', () => {
    const res = auditFixture('01_clean_hubspot_shape');
    const json = JSON.stringify(res);
    expect(json).not.toMatch(/D0\d\d/);
    expect(json).not.toContain('Synthetic');
    expect(json).not.toMatch(/Rep [ABC]/);
    expect(card(res, 'H1').includedLines).toContain(9);
    const src = card(res, 'H1').hops.find((h) => h.kind === 'source');
    expect(src && 'fileSha256' in src ? src.fileSha256 : '').toMatch(/^[0-9a-f]{64}$/);
    const parsed = parseOk(fixtureBytes('01_clean_hubspot_shape'));
    expect(JSON.stringify(parsed.rows)).not.toMatch(/D0\d\d/);
  });

  it('engine_is_deterministic (AT9) on every fixture', () => {
    for (const name of allFixtureNames()) {
      if (name.startsWith('10_')) continue;
      const { o, p } = forFixture(name);
      const a = JSON.stringify(runAudit(fixtureBytes(name), o, p));
      const b = JSON.stringify(runAudit(new Uint8Array(fixtureBytes(name)), { ...o }, { ...p }));
      expect([name, b]).toEqual([name, a]);
    }
    const { o, p } = forFixture('03_dead_pipe_stale');
    expect(JSON.stringify(runAudit(fixtureBytes('03_dead_pipe_stale'), o, p))).toBe(JSON.stringify(runAudit(fixtureBytes('03_dead_pipe_stale'), o, p)));
  });

  it('runAudit_passes_parse_errors_through_typed', () => {
    const r = runAudit(new Uint8Array(), opts(), params());
    expect(r).toEqual({ ok: false, error: { code: 'file_empty' } });
  });
});
