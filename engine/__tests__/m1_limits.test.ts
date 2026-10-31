import { describe, expect, it, vi } from 'vitest';

vi.mock('../csv', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../csv')>();
  return { ...actual, tokenize: vi.fn(actual.tokenize) };
});

import * as csv from '../csv';
import { parseFile } from '../parse';
import { genHuge, hugeAmountCents } from '../__fixtures__/gen_huge';
import { opts } from './helpers';

describe('M1 size limits (fixture 10)', () => {
  it('file_over_max_bytes_rejected_before_parse [10c]', () => {
    const bytes = genHuge(1000, 26214401);
    expect(bytes.length).toBeGreaterThan(26214400);
    vi.mocked(csv.tokenize).mockClear();
    const r = parseFile(bytes, opts());
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe('file_too_large');
    expect(csv.tokenize).not.toHaveBeenCalled();
  });

  it('rows_over_max_rows_rejected_no_partial [10b]', () => {
    const r = parseFile(genHuge(250001), opts());
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.code).toBe('too_many_rows');
    expect(r).not.toHaveProperty('rows');
  });

  it('rows_at_max_rows_accepted [10a]', () => {
    const t0 = performance.now();
    const r = parseFile(genHuge(250000), opts());
    const ms = Math.round(performance.now() - t0);
    process.stdout.write(`[10a] parse of 250000 rows took ${ms} ms\n`);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.meta.rowsRead).toBe(250000);
      expect(r.rows).toHaveLength(250000);
      expect(r.rows[0].amountMinor).toBe(hugeAmountCents(1));
    }
  });

  it('limits_are_overridable_by_options', () => {
    const r = parseFile(genHuge(10), opts({ maxRows: 9 }));
    expect(r.ok).toBe(false);
    const r2 = parseFile(genHuge(10), opts({ maxBytes: 50 }));
    expect(r2.ok).toBe(false);
  });
});
