// Named row edits from FIXTURES.md. Each one changes the fixture in memory, one idea per helper. They are not files.
import { csvOf, enc, fixtureBytes, HEADER6, mutate, tableOf } from './helpers';

const col = (t: string[][], name: string) => {
  const i = t[0].indexOf(name);
  if (i < 0) throw new Error(`no column ${name}`);
  return i;
};
const rowOf = (t: string[][], id: string) => {
  const r = t.find((x) => x[0] === id);
  if (!r) throw new Error(`no row ${id}`);
  return r;
};

// Builds a data row in the fixture 01 column order.
function deal(t: string[][], id: string, f: { stage: string; amount: string; close: string; created: string; modified: string; owner?: string }): string[] {
  const r = new Array(t[0].length).fill('');
  r[col(t, 'Record ID')] = id;
  r[col(t, 'Deal Stage')] = f.stage;
  r[col(t, 'Amount')] = f.amount;
  r[col(t, 'Close Date')] = f.close;
  r[col(t, 'Create Date')] = f.created;
  r[col(t, 'Deal owner')] = f.owner ?? 'Rep A';
  r[col(t, 'Last Modified Date')] = f.modified;
  return r;
}

// Example 3: on 02, four more rows created Oct 19 to 22, and every W43 amount blank.
export function M_AMOUNT_DARK(): Uint8Array {
  return mutate('02_quiet_week_real', (t) => {
    const a = col(t, 'Amount');
    rowOf(t, 'D015')[a] = '';
    rowOf(t, 'D016')[a] = '';
    ['2026-10-19', '2026-10-20', '2026-10-21', '2026-10-22'].forEach((d, i) =>
      t.push(deal(t, `D0${18 + i}`, { stage: 'Discovery', amount: '', close: '2027-01-15', created: d, modified: '2026-10-22' })),
    );
  });
}

// Example 4: the amount column exists but is blank on every row.
export function M_AMOUNT_NEVER(): Uint8Array {
  return mutate('01_clean_hubspot_shape', (t) => {
    const a = col(t, 'Amount');
    for (const r of t.slice(1)) r[a] = '';
  });
}

// Example 6: D010 to D013 plus two rows, six rows over nine days, four active days.
export function M_FEW_ROWS(): Uint8Array {
  return mutate('01_clean_hubspot_shape', (t) => {
    const keep = new Set(['Record ID', 'D010', 'D011', 'D012', 'D013']);
    const kept = t.filter((r) => keep.has(r[0]));
    t.length = 0;
    t.push(...kept);
    t.push(deal(t, 'F001', { stage: 'Discovery', amount: '1000', close: '2027-01-15', created: '2026-10-09', modified: '2026-10-13' }));
    t.push(deal(t, 'F002', { stage: 'Discovery', amount: '2000', close: '2027-01-15', created: '2026-10-12', modified: '2026-10-20' }));
  });
}

// Example 8: one bulk update touched every row on the same day. Built on 02 so the new pipeline zero exists.
export function M_BULK_TOUCH(): Uint8Array {
  return mutate('02_quiet_week_real', (t) => {
    const m = col(t, 'Last Modified Date');
    for (const r of t.slice(1)) r[m] = '2026-10-29';
  });
}

// Example 9: every row is won or lost. Open rows are relabeled so created and close days still straddle the baseline week ends.
export function M_ALL_CLOSED(): Uint8Array {
  return mutate('01_clean_hubspot_shape', (t) => {
    const s = col(t, 'Deal Stage');
    for (const r of t.slice(1)) if (!/closed/i.test(r[s])) r[s] = 'Closed Lost';
  });
}

// Example 10: every row carries one of two labels the engine cannot place.
export function M_UNMAPPED_ONLY(): Uint8Array {
  return mutate('01_clean_hubspot_shape', (t) => {
    const s = col(t, 'Deal Stage');
    t.slice(1).forEach((r, i) => {
      r[s] = i % 2 === 0 ? 'Phase 2 Closed Review' : 'Won Pending';
    });
  });
}

// Example 12: on 02, five created years become 2062, and three W43 rows with an amount of zero make eight candidates.
export function M_TYPO_YEAR(): Uint8Array {
  return mutate('02_quiet_week_real', (t) => {
    const c = col(t, 'Create Date');
    for (const id of ['D001', 'D002', 'D003', 'D004', 'D005']) rowOf(t, id)[c] = rowOf(t, id)[c].replace(/^2026/, '2062');
    ['2026-10-19', '2026-10-20', '2026-10-21'].forEach((d, i) =>
      t.push(deal(t, `D0${18 + i}`, { stage: 'Discovery', amount: '0', close: '2027-01-15', created: d, modified: '2026-10-22' })),
    );
  });
}

// Every zero becomes unknown: the last modified column is gone.
export function M_NO_MODIFIED_COLUMN(): Uint8Array {
  return mutate('02_quiet_week_real', (t) => {
    const m = col(t, 'Last Modified Date');
    for (const r of t) r.splice(m, 1);
  });
}

// 01 with D001, D003, D005 relabeled lost: September reads 0 of 6. Alone this has no earlier win, so a second helper adds one.
export function M_REAL_ZERO_WIN_RATE_ONLY(): Uint8Array {
  return mutate('01_clean_hubspot_shape', (t) => {
    for (const id of ['D001', 'D003', 'D005']) rowOf(t, id)[col(t, 'Deal Stage')] = 'Closed Lost';
  });
}

// The same, plus the earlier win that fixture 15 also carries (D000, closed Aug 12), so a won history exists.
export function M_REAL_ZERO_WIN_RATE(): Uint8Array {
  return mutate('01_clean_hubspot_shape', (t) => {
    for (const id of ['D001', 'D003', 'D005']) rowOf(t, id)[col(t, 'Deal Stage')] = 'Closed Lost';
    t.push(deal(t, 'D000', { stage: 'Closed Won', amount: '6000.00', close: '2026-08-12', created: '2026-07-15', modified: '2026-08-12' }));
  });
}

// Example 7. closes[i] deals closed in month i+1 of 2026 (January first). Eighteen rows for [4,0,3,2,0,5,1,3].
// Modified days are fixed: 14 active days, gaps 3 x8, 5 x4, 7 (usual gap 5, threshold 10), newest Oct 28,
// nine rows modified in September. September itself closes nothing.
export function buildMonthlyCloses(closes: number[]): Uint8Array {
  const modDays = [
    '2026-09-29', '2026-09-24', '2026-09-19', '2026-09-14', '2026-09-07',
    '2026-09-29', '2026-09-24', '2026-09-19', '2026-09-14',
    '2026-10-28', '2026-10-25', '2026-10-22', '2026-10-19', '2026-10-16', '2026-10-13', '2026-10-10', '2026-10-07', '2026-10-04',
  ];
  const lines = [HEADER6];
  let n = 0;
  closes.forEach((k, m) => {
    for (let j = 0; j < k; j++) {
      const mm = String(m + 1).padStart(2, '0');
      lines.push(`C${String(n + 1).padStart(3, '0')},${n % 2 === 0 ? 'Closed Won' : 'Closed Lost'},1000,2026-${mm}-15,2026-${mm}-01,${modDays[n % modDays.length]}`);
      n++;
    }
  });
  return enc(lines.join('\n') + '\n');
}

// Example: nothing was created or closed in the history. Every created day is early in the year.
export function M_NO_HISTORY(): Uint8Array {
  return mutate('02_quiet_week_real', (t) => {
    const c = col(t, 'Create Date');
    for (const r of t.slice(1)) r[c] = '2026-02-10';
  });
}

// Fixture 02 with D017 modified after the as of date.
export function M_MODIFIED_AFTER_AS_OF(): Uint8Array {
  return mutate('02_quiet_week_real', (t) => {
    rowOf(t, 'D017')[col(t, 'Last Modified Date')] = '2026-11-05';
  });
}

export { csvOf, fixtureBytes, tableOf };
