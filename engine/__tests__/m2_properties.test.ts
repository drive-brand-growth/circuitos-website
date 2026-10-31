import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { runAudit } from '../audit';
import { dayNum, dayStr } from '../civil';
import { buildTrace } from '../trace';
import type { AmountState, MetricId, NormalRow, StageClass, TraceCard } from '../types';
import { enc, HEADER6, opts, params } from './helpers';

const P = params();
const BASE = dayNum('2026-08-01');
const day = (k: number) => dayStr(BASE + k);
const METRICS: MetricId[] = ['H1', 'H2', 'H3'];

interface Gen {
  created: number;
  close: number | null;
  stage: StageClass;
  amt: { state: AmountState; minor: number | null };
  currency: string;
  modified: number | null;
}

const amtArb = fc.oneof(
  { weight: 6, arbitrary: fc.integer({ min: 0, max: 5000000 }).map((minor) => ({ state: 'ok' as AmountState, minor })) },
  { weight: 2, arbitrary: fc.constant({ state: 'blank' as AmountState, minor: null }) },
  { weight: 1, arbitrary: fc.constant({ state: 'invalid' as AmountState, minor: null }) },
  { weight: 1, arbitrary: fc.integer({ min: 1, max: 9999 }).map((m) => ({ state: 'negative' as AmountState, minor: -m })) },
);

const genArb: fc.Arbitrary<Gen> = fc.record({
  created: fc.integer({ min: 0, max: 130 }),
  close: fc.option(fc.integer({ min: 0, max: 140 }), { nil: null }),
  stage: fc.constantFrom<StageClass>('OPEN', 'OPEN', 'WON', 'LOST', 'UNMAPPED'),
  amt: amtArb,
  currency: fc.constantFrom('USD', 'EUR'),
  modified: fc.option(fc.integer({ min: 0, max: 140 }), { nil: null }),
});

const toRows = (gs: Gen[]): NormalRow[] =>
  gs.map((g, i) => ({
    line: i + 2,
    idHash: String(i).padStart(12, '0'),
    createdDay: day(g.created),
    closeDay: g.close === null ? null : day(g.close),
    modifiedDay: g.modified === null ? null : day(g.modified),
    stageRaw: g.stage,
    stageClass: g.stage,
    amountMinor: g.amt.minor,
    amountState: g.amt.state,
    currency: g.currency,
    ownerKey: null,
    flags: [],
  }));

const rowsArb = fc.array(genArb, { minLength: 1, maxLength: 40 }).map(toRows);
const allCards = (rows: NormalRow[]): TraceCard[] => METRICS.flatMap((m) => buildTrace(m, rows, P));
const val = (c: TraceCard) => c.valueMinor ?? 0;
const shape = (c: TraceCard) => ({ m: c.metricId, c: c.currency, v: c.valueMinor, r: c.rate, n: c.includedCount, o: c.outOfScope, b: c.byReason, nc: c.notComputable });

describe('M2 properties', () => {
  it('prop_trace_sum_equals_value', () => {
    fc.assert(
      fc.property(rowsArb, (rows) => {
        const byLine = new Map(rows.map((r) => [r.line, r]));
        for (const c of allCards(rows)) {
          const inc = c.includedLines.map((l) => byLine.get(l)!);
          if (c.metricId === 'H3') {
            const won = inc.filter((r) => r.stageClass === 'WON').length;
            expect(c.rate === null ? 0 : c.rate.den).toBe(inc.length);
            if (c.rate) expect(c.rate.num).toBe(won);
          } else if (c.valueMinor !== null) {
            expect(c.valueMinor).toBe(inc.reduce((s, r) => s + (r.amountMinor as number), 0));
          }
        }
      }),
      { numRuns: 300 },
    );
  });

  it('prop_partition_complete', () => {
    fc.assert(
      fc.property(rowsArb, (rows) => {
        for (const m of METRICS) {
          for (const cur of ['USD', 'EUR']) {
            const c = buildTrace(m, rows, P).find((x) => x.currency === cur);
            const total = rows.filter((r) => r.currency === cur).length;
            if (!c) {
              expect(total).toBe(0);
              continue;
            }
            const ex = c.excluded.map((e) => e.line);
            expect(c.includedLines.length + ex.length + c.outOfScope).toBe(total);
            expect(new Set([...c.includedLines, ...ex]).size).toBe(c.includedLines.length + ex.length);
          }
        }
      }),
      { numRuns: 300 },
    );
  });

  it('prop_permutation_invariant_headlines', () => {
    fc.assert(
      fc.property(rowsArb.chain((rows) => fc.tuple(fc.constant(rows), fc.shuffledSubarray(rows, { minLength: rows.length, maxLength: rows.length }))), ([rows, perm]) => {
        const reassigned = perm.map((r, i) => ({ ...r, line: i + 2 }));
        expect(allCards(reassigned).map(shape)).toEqual(allCards(rows).map(shape));
      }),
      { numRuns: 200 },
    );
  });

  it('prop_exact_duplicate_row_added_changes_nothing', () => {
    const rowTxt = fc.record({
      stage: fc.constantFrom('Discovery', 'Proposal', 'Closed Won', 'Closed Lost'),
      amount: fc.oneof(fc.integer({ min: 0, max: 99999 }).map(String), fc.constant('')),
      created: fc.integer({ min: 0, max: 85 }),
      close: fc.integer({ min: 0, max: 100 }),
    });
    fc.assert(
      fc.property(fc.array(rowTxt, { minLength: 1, maxLength: 25 }), fc.nat(), (gs, pick) => {
        const lines = gs.map((g, i) => `R${i},${g.stage},${g.amount},${day(g.close + 20)},${day(g.created)},${day(g.created + 1)}`);
        const run = (ls: string[]) => {
          const r = runAudit(enc(`${HEADER6}\n${ls.join('\n')}\n`), opts(), params());
          if (!r.ok) throw new Error(r.error.code);
          return r.cards.map((c) => ({ m: c.metricId, c: c.currency, v: c.valueMinor, r: c.rate, n: c.includedCount, nc: c.notComputable }));
        };
        // the copy may be listed as excluded or counted out of scope; the headline values must not move
        expect(run([...lines, lines[pick % lines.length]])).toEqual(run(lines));
      }),
      { numRuns: 100 },
    );
  });

  it('prop_currency_partition_sums', () => {
    fc.assert(
      fc.property(rowsArb, (rows) => {
        const merged = rows.map((r) => ({ ...r, currency: 'ALL' }));
        for (const m of ['H1', 'H2'] as MetricId[]) {
          const split = buildTrace(m, rows, P).reduce((s, c) => s + val(c), 0);
          const one = buildTrace(m, merged, P).reduce((s, c) => s + val(c), 0);
          expect(split).toBe(one);
        }
        const won = (cs: TraceCard[]) => cs.reduce((s, c) => s + (c.rate?.num ?? 0), 0);
        expect(won(buildTrace('H3', rows, P))).toBe(won(buildTrace('H3', merged, P)));
      }),
      { numRuns: 300 },
    );
  });

  it('prop_blank_never_summed', () => {
    fc.assert(
      fc.property(rowsArb, fc.nat(), (rows, pick) => {
        const k = pick % rows.length;
        const blanked = rows.map((r, i) => (i === k ? { ...r, amountMinor: null, amountState: 'blank' as AmountState } : r));
        for (const m of ['H1', 'H2'] as MetricId[]) {
          const before = buildTrace(m, rows, P);
          const after = buildTrace(m, blanked, P);
          const cur = rows[k].currency;
          expect(val(after.find((c) => c.currency === cur)!)).toBeLessThanOrEqual(val(before.find((c) => c.currency === cur)!));
          const incBefore = new Set(before.flatMap((c) => c.includedLines));
          for (const l of after.flatMap((c) => c.includedLines)) expect(incBefore.has(l)).toBe(true);
          const others = (cs: TraceCard[]) => cs.flatMap((c) => c.excluded.filter((e) => e.line !== k + 2)).sort((a, b) => a.line - b.line);
          expect(others(after)).toEqual(others(before));
        }
        // the blanked row never changes the win rate: amount is not a win rate criterion
        const rate = (cs: TraceCard[]) => cs.map((c) => c.rate);
        expect(rate(buildTrace('H3', blanked, P))).toEqual(rate(buildTrace('H3', rows, P)));
      }),
      { numRuns: 300 },
    );
  });
});
