import { dayNum } from './civil';
import type { HeartbeatSummary, NormalRow } from './types';

const P90 = 0.9;

// Nearest rank percentile of an ascending list. Returns null for an empty list.
export function percentileNearestRank(sortedAsc: number[], p: number): number | null {
  if (sortedAsc.length === 0) return null;
  const rank = Math.max(1, Math.ceil(p * sortedAsc.length));
  return sortedAsc[rank - 1];
}

// What the file's own change history says about whether the export is alive.
// Shared by the row trace heartbeat hop and the zero check.
export function heartbeatSummary(rows: NormalRow[], asOf: string, cfg: { minActiveDays: number; staleMultiple: number }): HeartbeatSummary {
  const seen = new Set<number>();
  for (const r of rows) if (r.modifiedDay) seen.add(dayNum(r.modifiedDay));
  const days = Array.from(seen).sort((a, b) => a - b);
  const gaps: number[] = [];
  for (let i = 1; i < days.length; i++) gaps.push(days[i] - days[i - 1]);
  gaps.sort((a, b) => a - b);
  const usualGap = percentileNearestRank(gaps, P90);
  const staleThreshold = days.length >= cfg.minActiveDays && usualGap !== null ? cfg.staleMultiple * usualGap : null;
  if (days.length === 0) {
    return { activeDays: 0, usualGap: null, staleThreshold: null, newestModifiedDay: null, daysSinceNewest: null, modifiedAfterAsOf: false, stale: false };
  }
  const newest = days[days.length - 1];
  const diff = dayNum(asOf) - newest;
  const after = diff < 0;
  const since = after ? 0 : diff;
  const newestDay = rows.reduce((best, r) => (r.modifiedDay && r.modifiedDay > best ? r.modifiedDay : best), '');
  return {
    activeDays: days.length,
    usualGap,
    staleThreshold,
    newestModifiedDay: newestDay,
    daysSinceNewest: since,
    modifiedAfterAsOf: after,
    stale: staleThreshold !== null && since > staleThreshold,
  };
}
