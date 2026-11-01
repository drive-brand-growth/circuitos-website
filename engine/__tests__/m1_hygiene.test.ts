import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { LABELS } from '../labels';

const ENGINE = new URL('..', import.meta.url).pathname;
const REPO = path.resolve(ENGINE, '..');

function engineSources(dir = ENGINE): string[] {
  const out: string[] = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === '__tests__' || e.name === '__fixtures__') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...engineSources(p));
    else if (/\.(ts|tsx)$/.test(e.name)) out.push(p);
  }
  return out;
}

function walkStrings(v: unknown, out: string[] = []): string[] {
  if (typeof v === 'string') out.push(v);
  else if (Array.isArray(v)) v.forEach((x) => walkStrings(x, out));
  else if (v && typeof v === 'object') Object.values(v).forEach((x) => walkStrings(x, out));
  return out;
}

const BANNED = [/hardcore\s+certified/i, /\bDRN\b/, /motorola/i];

describe('M1 hygiene', () => {
  it('engine_is_pure', () => {
    const files = engineSources();
    expect(files.length).toBeGreaterThan(5);
    const banned: [string, RegExp][] = [
      ['fetch', /\bfetch\s*\(/],
      ['XMLHttpRequest', /XMLHttpRequest/],
      ['WebSocket', /WebSocket/],
      ['sendBeacon', /sendBeacon/],
      ['Date.now', /Date\.now/],
      ['new Date()', /new Date\(\s*\)/],
      ['Math.random', /Math\.random/],
      ['console', /\bconsole\./],
      ['node imports', /from\s+['"]node:/],
      ['process', /\bprocess\./],
    ];
    for (const f of files) {
      const src = fs.readFileSync(f, 'utf8');
      for (const [name, re] of banned) expect(re.test(src), `${path.basename(f)} uses ${name}`).toBe(false);
    }
  });

  it('labels_use_approved_canon_terms', () => {
    const strings = walkStrings(LABELS);
    expect(strings.length).toBeGreaterThan(10); // the labels file must really hold the words
    expect(LABELS.canon).toEqual({ signalTracing: 'Signal Tracing', liveZero: 'Live Zero', circuitMethod: 'The Circuit Method' });
    expect(LABELS.trace.title).toBe('Signal Tracing');
    expect(LABELS.verdictNote.REAL).toBe('Live Zero');
    for (const s of strings) for (const re of BANNED) expect(re.test(s), s).toBe(false);
    for (const f of engineSources()) {
      const src = fs.readFileSync(f, 'utf8');
      for (const re of BANNED) expect(re.test(src), path.basename(f)).toBe(false);
      // The Circuit Method is report and doc level text, so only labels.ts may carry it.
      if (path.basename(f) !== 'labels.ts') expect(/circuit\s+method/i.test(src), path.basename(f)).toBe(false);
    }
    // verdict labels exist
    expect(LABELS.verdict).toMatchObject({ REAL: expect.any(String), BROKEN: expect.any(String), UNKNOWN: expect.any(String) });
    // no em or en dashes in user facing words
    for (const s of strings) expect(/[–—]/.test(s), s).toBe(false);
  });

  it('fixtures_are_labeled_synthetic', () => {
    const dir = path.join(ENGINE, '__fixtures__');
    const csvs = fs.readdirSync(dir).filter((f) => f.endsWith('.csv'));
    expect(csvs.length).toBeGreaterThanOrEqual(13);
    for (const c of csvs) {
      const side = path.join(dir, c.replace(/\.csv$/, '.meta.json'));
      expect(fs.existsSync(side), `${c} sidecar`).toBe(true);
      expect(JSON.parse(fs.readFileSync(side, 'utf8')).synthetic, c).toBe(true);
    }
    expect(fs.existsSync(path.join(dir, '10_huge_file.csv'))).toBe(false);
    expect(fs.existsSync(path.join(dir, '10_huge_file.meta.json'))).toBe(true);
    const tracked = execSync('git ls-files "*.csv" "**/*.csv"', { cwd: REPO, encoding: 'utf8' }).split('\n').filter(Boolean);
    for (const t of tracked) expect(t.startsWith('engine/__fixtures__/'), t).toBe(true);
  });
});
