import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { dayNum, dayStr } from '../civil';
import { classifyStage } from '../stages';
import { buildTrace } from '../trace';
import { REASON_CODES } from '../zero';
import type { AmountState, NormalRow, StageClass } from '../types';
import { params } from './helpers';
import { zeroRows } from './m3_helpers';

const P = params();
const BASE = dayNum('2026-06-01');
const day = (k: number) => dayStr(BASE + k);
const HB = 'HB'; // a currency partition that only carries heartbeat days, so reductions cannot move them

interface Gen {
  created: number;
  close: number | null;
  label: string;
  amt: { state: AmountState; minor: number | null };
  currency: string;
  modIdx: number | null;
}

const labelArb = fc.constantFrom('Discovery', 'Qualified', 'Closed Won', 'Closed Lost', 'Closed Won', 'Closed Lost', 'Phase 2 Closed Review');
const amtArb = fc.oneof(
  { weight: 6, arbitrary: fc.integer({ min: 0, max: 5000000 }).map((minor) => ({ state: 'ok' as AmountState, minor })) },
  { weight: 2, arbitrary: fc.constant({ state: 'blank' as AmountState, minor: null }) },
  { weight: 1, arbitrary: fc.constant({ state: 'invalid' as AmountState, minor: null }) },
);
const genArb: fc.Arbitrary<Gen> = fc.record({
  created: fc.integer({ min: 0, max: 150 }),
  close: fc.option(fc.integer({ min: 0, max: 160 }), { nil: null }),
  label: labelArb,
  amt: amtArb,
  currency: fc.constantFrom('USD', 'EUR'),
  modIdx: fc.option(fc.nat({ max: 30 }), { nil: null }),
});
const hbDaysArb = fc.uniqueArray(fc.integer({ min: 0, max: 150 }), { minLength: 0, maxLength: 24 });

interface World {
  rows: NormalRow[];
  hbDays: string[];
}

function row(line: number, g: Gen, hbDays: string[]): NormalRow {
  const stageClass = classifyStage(g.label) as StageClass;
  return {
    line,
    idHash: String(line).padStart(12, '0'),
    createdDay: day(g.created),
    closeDay: g.close === null ? null : day(Math.max(g.close, g.created)),
    modifiedDay: g.modIdx === null || hbDays.length === 0 ? null : hbDays[g.modIdx % hbDays.length],
    stageRaw: g.label,
    stageClass,
    amountMinor: g.amt.minor,
    amountState: g.amt.state,
    currency: g.currency,
    ownerKey: null,
    flags: [],
  };
}

const worldArb: fc.Arbitrary<World> = fc.tuple(fc.array(genArb, { minLength: 1, maxLength: 40 }), hbDaysArb).map(([gs, hb]) => {
  const hbDays = hb.sort((a, b) => a - b).map(day);
  const rows = gs.map((g, i) => row(i + 2, g, hbDays));
  hbDays.forEach((d, i) =>
    rows.push({
      line: 1000 + i, idHash: `hb${i}`.padEnd(12, '0'), createdDay: d, closeDay: null, modifiedDay: d, stageRaw: 'Discovery', stageClass: 'OPEN',
      amountMinor: 0, amountState: 'ok', currency: HB, ownerKey: null, flags: [],
    }),
  );
  return { rows, hbDays };
});

const key = (v: { metricId: string; currency: string }) => `${v.metricId}/${v.currency}`;
const cardsOf = (rows: NormalRow[]) => (['H1', 'H2', 'H3'] as const).flatMap((m) => buildTrace(m, rows, P));

describe('M3 properties', () => {
  it('prop_any_zero_gets_exactly_one_verdict', () => {
    fc.assert(
      fc.property(worldArb, ({ rows }) => {
        const vs = zeroRows(rows, P);
        const seen = new Set(vs.map(key));
        expect(seen.size).toBe(vs.length); // one verdict per zero, never two
        for (const c of cardsOf(rows)) {
          const k = c.metricId === 'H3' && c.rate === null ? `closed_count/${c.currency}` : `${c.metricId}/${c.currency}`;
          expect([k, seen.has(k)]).toEqual([k, c.valueIsZero]);
        }
        for (const v of vs) {
          expect(REASON_CODES).toContain(v.reason);
          expect(typeof v.reason).toBe('string');
        }
      }),
      { numRuns: 150 },
    );
  });

  it('prop_less_evidence_never_more_real', () => {
    // Less evidence, in three forms. Reductions only touch UNMAPPED free, fully valid, filled rows older than the latest week,
    // and heartbeat days live on separate rows, because the 90th percentile gap is not monotone when active days are removed.
    const cut = dayStr(dayNum(P.asOf) - 7 - ((dayNum(P.asOf) - 1) % 7));
    fc.assert(
      fc.property(worldArb, fc.array(fc.boolean(), { minLength: 40, maxLength: 40 }), ({ rows }, mask) => {
        const before = zeroRows(rows, P);
        const blankHeartbeat = rows.map((r) => ({ ...r, modifiedDay: null }));
        const dropped = rows.filter(
          (r, i) => !(mask[i % mask.length] && r.currency !== HB && r.stageClass !== 'UNMAPPED' && r.amountState === 'ok' && r.createdDay !== null && r.createdDay < cut && (r.closeDay === null || r.closeDay < cut)),
        );
        const blankedAmounts = rows.map((r, i) =>
          mask[i % mask.length] && r.currency !== HB && r.createdDay !== null && r.createdDay < cut ? { ...r, amountState: 'blank' as AmountState, amountMinor: null } : r,
        );
        for (const reduced of [zeroRows(blankHeartbeat, P), zeroRows(dropped, P), zeroRows(blankedAmounts, P)]) {
          const after = new Map(reduced.map((v) => [key(v), v]));
          for (const b of before) {
            const a = after.get(key(b));
            if (b.verdict !== 'REAL' && a) expect([key(b), a.verdict]).not.toEqual([key(b), 'REAL']);
          }
        }
      }),
      { numRuns: 150 },
    );
  });

  it('prop_real_requires_all_conditions', () => {
    fc.assert(
      fc.property(worldArb, ({ rows }) => {
        const days = new Set(rows.map((r) => r.modifiedDay).filter((d): d is string => d !== null));
        for (const v of zeroRows(rows, P)) {
          if (v.verdict !== 'REAL') continue;
          expect(days.size).toBeGreaterThanOrEqual(P.minActiveDays); // recomputed from the rows, not from the evidence
          expect(v.evidence.daysSinceNewest).toBeLessThanOrEqual(v.evidence.staleThreshold as number);
          expect(v.evidence.producedPeriods).toBeGreaterThanOrEqual(1);
          expect(v.evidence.unmapped).toEqual([]);
          expect(v.rule).toBe('Z7');
        }
      }),
      { numRuns: 200 },
    );
  });

  it('prop_blank_amounts_never_real', () => {
    fc.assert(
      fc.property(worldArb, ({ rows }) => {
        // every amount blank, so no in period amount can be a value
        const blank = rows.map((r) => ({ ...r, amountState: 'blank' as AmountState, amountMinor: null }));
        for (const v of zeroRows(blank, P)) if (v.metricId === 'H1' || v.metricId === 'H2') expect(v.verdict).not.toBe('REAL');
      }),
      { numRuns: 150 },
    );
  });

  it('prop_verdict_stable_under_row_permutation', () => {
    fc.assert(
      fc.property(worldArb, fc.infiniteStream(fc.nat()), ({ rows }, stream) => {
        const it = stream[Symbol.iterator]();
        const shuffled = rows.slice();
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = (it.next().value as number) % (i + 1);
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        expect(JSON.stringify(zeroRows(shuffled, P))).toBe(JSON.stringify(zeroRows(rows, P)));
      }),
      { numRuns: 150 },
    );
  });
});
