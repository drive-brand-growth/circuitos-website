import fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { serialize, tokenize } from '../csv';
import { parseAmount } from '../money';
import { parseFile } from '../parse';
import { csvOf, fixtureBytes, opts, parseOk, tableOf } from './helpers';

const cellUnit = fc.constantFrom(...'abcXYZ019 ,;"\n\r\t\'=+-@é'.split(''));
const cell = fc.string({ unit: cellUnit, maxLength: 12 });

describe('M1 properties', () => {
  it('prop_parse_serialize_roundtrip', () => {
    fc.assert(
      fc.property(fc.array(fc.array(cell, { minLength: 1, maxLength: 5 }), { maxLength: 8 }), fc.constantFrom(',', ';', '\t'), (table, d) => {
        const back = tokenize(serialize(table, d), d).records.map((r) => r.cells);
        expect(back).toEqual(table);
      }),
      { numRuns: 300 },
    );
  });

  it('prop_amount_cents_exact', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: Number.MAX_SAFE_INTEGER }), fc.boolean(), (n, grouped) => {
        const whole = (BigInt(n) / BigInt(100)).toString();
        const frac = (BigInt(n) % BigInt(100)).toString().padStart(2, '0');
        const w = grouped ? whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : whole;
        const r = parseAmount(`${w}.${frac}`);
        expect(r.state).toBe('ok');
        expect(r.minor).toBe(n);
      }),
      { numRuns: 500 },
    );
  });

  it('prop_amount_junk_never_throws', () => {
    fc.assert(
      fc.property(fc.oneof(fc.string({ maxLength: 40 }), fc.string({ unit: 'binary', maxLength: 40 }), fc.string({ unit: cellUnit, maxLength: 20 })), fc.boolean(), (s, dc) => {
        const r = parseAmount(s, { decimalComma: dc });
        expect(['ok', 'blank', 'invalid', 'negative']).toContain(r.state);
        if (r.state === 'ok') expect(Number.isInteger(r.minor)).toBe(true);
        if (r.state === 'blank' || r.state === 'invalid') expect(r.minor).toBeNull();
      }),
      { numRuns: 1000 },
    );
  });

  it('prop_any_bytes_never_throws', () => {
    const header = new TextEncoder().encode('Record ID,Deal Stage,Amount,Close Date,Create Date\n');
    const withHeader = (b: Uint8Array) => {
      const o = new Uint8Array(header.length + b.length);
      o.set(header);
      o.set(b, header.length);
      return o;
    };
    fc.assert(
      fc.property(fc.oneof(fc.uint8Array({ maxLength: 400 }), fc.uint8Array({ maxLength: 300 }).map(withHeader)), (bytes) => {
        const r = parseFile(bytes, opts());
        expect(typeof r.ok).toBe('boolean');
        if (!r.ok) expect(typeof r.error.code).toBe('string');
      }),
      { numRuns: 500 },
    );
  });

  it('prop_dropped_columns_never_leak', () => {
    const t = tableOf(fixtureBytes('01_clean_hubspot_shape'));
    const secret = fc.string({ unit: fc.constantFrom(...'ZQXJ'.split('')), minLength: 8, maxLength: 20 });
    fc.assert(
      fc.property(fc.array(secret, { minLength: t.length - 1, maxLength: t.length - 1 }), (secrets) => {
        const table = t.map((row, i) => (i === 0 ? row : row.map((c, j) => (j === 1 || j === 8 ? secrets[i - 1] : c))));
        const r = parseOk(csvOf(table));
        const json = JSON.stringify(r);
        for (const s of secrets) expect(json).not.toContain(s);
      }),
      { numRuns: 100 },
    );
  });

  it('prop_row_permutation_invariant', () => {
    const t = tableOf(fixtureBytes('04_duplicate_ids'));
    const body = t.slice(1);
    const strip = (rows: { line: number }[]) => rows.map((r) => JSON.stringify({ ...r, line: 0 })).sort();
    const base = strip(parseOk(csvOf(t)).rows);
    fc.assert(
      fc.property(fc.shuffledSubarray(body, { minLength: body.length, maxLength: body.length }), (perm) => {
        const r = parseOk(csvOf([t[0], ...perm]));
        expect(strip(r.rows)).toEqual(base);
      }),
      { numRuns: 100 },
    );
  });
});
