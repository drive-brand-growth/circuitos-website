/**
 * Public scorecard: a dated record of calls with their stated odds, scored later.
 *
 * To add a call, append one object to SCORECARD below. Rules:
 *  1. Add the entry BEFORE the outcome is known, with outcome 'pending'.
 *  2. Never edit call, dateStated, statedOdds, or baselineOdds after the entry is public.
 *  3. When the outcome is known, set outcome and dateScored. The Brier terms are computed.
 *  4. Real calls only. No sample rows, no placeholder numbers.
 *
 * Example shape (kept in this comment so it never renders):
 *   {
 *     id: 'short-unique-id',
 *     dateStated: 'YYYY-MM-DD',
 *     call: 'One sentence that can be judged true or false on the resolve date.',
 *     statedOdds: <probability between 0 and 1>,
 *     baselineOdds: <the base rate between 0 and 1, written down at the same time>,
 *     resolveBy: 'YYYY-MM-DD',
 *     outcome: 'pending',
 *   }
 */

export type ScorecardOutcome = 'pending' | 'happened' | 'did-not-happen'

export type ScorecardEntry = {
  /** Short unique id. Used as the row key and as an anchor. */
  id: string
  /** The day the call was written down, as YYYY-MM-DD. */
  dateStated: string
  /** The call, as one sentence that can be judged true or false. */
  call: string
  /** Stated odds that the call happens, as a probability from 0 to 1. */
  statedOdds: number
  /** The simple guess to beat, as a probability from 0 to 1, written down with the call. */
  baselineOdds: number
  /** The day the call can be judged, as YYYY-MM-DD. */
  resolveBy: string
  outcome: ScorecardOutcome
  /** The day the outcome was recorded, as YYYY-MM-DD. Leave out while pending. */
  dateScored?: string
  /** Optional link to where the call was first stated in public. */
  sourceHref?: string
  /** Optional one line of context. No private figures. */
  note?: string
}

/** The public record. Empty until a real call is stated. Do not add sample rows. */
export const SCORECARD: ScorecardEntry[] = []

function assertOdds(value: number, field: string, id: string) {
  if (!Number.isFinite(value) || value < 0 || value > 1) {
    throw new Error(`scorecard entry ${id}: ${field} must be a probability from 0 to 1`)
  }
}

/** Squared gap between the odds and what happened. Null while the call is pending. */
export function brierTerm(odds: number, outcome: ScorecardOutcome): number | null {
  if (outcome === 'pending') return null
  const happened = outcome === 'happened' ? 1 : 0
  return (odds - happened) ** 2
}

export type ScorecardSummary = {
  total: number
  pending: number
  scored: number
  /** Mean Brier score of the stated odds. Null until at least one call is scored. */
  brier: number | null
  /** Mean Brier score of the baseline on the same scored calls. */
  baselineBrier: number | null
}

export function summarize(entries: readonly ScorecardEntry[]): ScorecardSummary {
  const ids = new Set<string>()
  for (const entry of entries) {
    if (ids.has(entry.id)) throw new Error(`scorecard entry ${entry.id}: duplicate id`)
    ids.add(entry.id)
    assertOdds(entry.statedOdds, 'statedOdds', entry.id)
    assertOdds(entry.baselineOdds, 'baselineOdds', entry.id)
  }
  const scored = entries.filter((entry) => entry.outcome !== 'pending')
  const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length
  return {
    total: entries.length,
    pending: entries.length - scored.length,
    scored: scored.length,
    brier: scored.length ? mean(scored.map((entry) => brierTerm(entry.statedOdds, entry.outcome) as number)) : null,
    baselineBrier: scored.length
      ? mean(scored.map((entry) => brierTerm(entry.baselineOdds, entry.outcome) as number))
      : null,
  }
}

/** Newest call first. */
export function sortedEntries(entries: readonly ScorecardEntry[]): ScorecardEntry[] {
  return [...entries].sort((a, b) => (a.dateStated < b.dateStated ? 1 : a.dateStated > b.dateStated ? -1 : 0))
}
