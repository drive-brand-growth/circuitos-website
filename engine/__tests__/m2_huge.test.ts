import { describe, expect, it } from 'vitest';
import { genHuge, hugeAmountCents, hugeCreatedDay, hugeStage } from '../__fixtures__/gen_huge';
import { auditOk, card, opts, params } from './helpers';

describe('M2 fixture 10a', () => {
  it('h1_huge_matches_independent_loop [10a]', () => {
    const asOf = '2026-10-30';
    let expected = 0;
    let count = 0;
    for (let i = 1; i <= 250000; i++) {
      if (['Discovery', 'Qualified', 'Proposal'].includes(hugeStage(i)) && hugeCreatedDay(i) <= asOf) {
        expected += hugeAmountCents(i);
        count++;
      }
    }
    const t0 = performance.now();
    const res = auditOk(genHuge(250000), opts(), params({ asOf }));
    process.stdout.write(`[10a] parse plus audit of 250000 rows took ${Math.round(performance.now() - t0)} ms\n`);
    const h1 = card(res, 'H1');
    expect(h1.valueMinor).toBe(expected);
    expect(h1.includedCount).toBe(count);
  });
});
