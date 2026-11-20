import { yearOf } from './civil';
import { inPeriod } from './periods';
import type { ExclusionReason, FieldHealth, MetricId, NormalRow, Params, Period } from './types';

export const REASON_ORDER: ExclusionReason[] = [
  'ragged_row', 'duplicate_exact', 'duplicate_conflict', 'invalid_date', 'impossible_date', 'unmapped_stage', 'blank_amount', 'invalid_amount', 'negative_amount',
];

function yearOutOfRange(day: string, p: Params): boolean {
  const y = yearOf(day);
  return y < p.minYear || y > yearOf(p.asOf) + p.maxYearAhead;
}

// SPEC 4: created after as_of, close before created on a closed row, or a year outside the allowed range.
export function isImpossible(r: NormalRow, p: Params): boolean {
  if (r.createdDay && (r.createdDay > p.asOf || yearOutOfRange(r.createdDay, p))) return true;
  if (r.closeDay && yearOutOfRange(r.closeDay, p)) return true;
  if ((r.stageClass === 'WON' || r.stageClass === 'LOST') && r.createdDay && r.closeDay && r.closeDay < r.createdDay) return true;
  return false;
}

// Is the row within the reach of this metric? Rows with an unusable date are in scope so they get listed, not lost.
export function inScope(metric: MetricId, r: NormalRow, p: Params, period: Period): boolean {
  if (metric === 'H1') return r.stageClass === 'OPEN' || r.stageClass === 'UNMAPPED';
  if (metric === 'H2') {
    if (r.createdDay === null) return true;
    if (r.createdDay > p.asOf || yearOutOfRange(r.createdDay, p)) return true;
    return inPeriod(r.createdDay, period);
  }
  if (r.stageClass === 'WON' || r.stageClass === 'LOST') {
    if (r.closeDay === null || yearOutOfRange(r.closeDay, p)) return true;
    return inPeriod(r.closeDay, period);
  }
  if (r.stageClass === 'UNMAPPED') return r.closeDay !== null && inPeriod(r.closeDay, period);
  return false;
}

// First reason that is not about the amount. First match wins, in the order of SPEC 4.
export function reasonBeforeAmount(metric: MetricId, r: NormalRow, p: Params): ExclusionReason | null {
  if (r.flags.includes('duplicate_exact')) return 'duplicate_exact';
  if (r.flags.includes('duplicate_conflict')) return 'duplicate_conflict';
  const dateNeeded = metric === 'H3' ? r.closeDay : r.createdDay;
  if (dateNeeded === null) return 'invalid_date';
  if (isImpossible(r, p)) return 'impossible_date';
  if (r.stageClass === 'UNMAPPED') return 'unmapped_stage';
  return null;
}

export function amountReason(r: NormalRow): ExclusionReason | null {
  if (r.amountState === 'blank') return 'blank_amount';
  if (r.amountState === 'invalid') return 'invalid_amount';
  if (r.amountState === 'negative') return 'negative_amount';
  return null;
}

// Field health over rows in scope, before any exclusion.
export function fieldHealth(metric: MetricId, scoped: NormalRow[]): FieldHealth[] {
  const n = scoped.length;
  const stage: FieldHealth = { field: 'stage', inScope: n, blank: scoped.filter((r) => r.stageRaw === '').length, invalid: 0 };
  const amount: FieldHealth = {
    field: 'amount',
    inScope: n,
    blank: scoped.filter((r) => r.amountState === 'blank').length,
    invalid: scoped.filter((r) => r.amountState === 'invalid').length,
  };
  const dateHealth = (field: string, tag: string): FieldHealth => ({
    field,
    inScope: n,
    blank: scoped.filter((r) => r.flags.includes(`${tag}:blank`)).length,
    invalid: scoped.filter((r) => r.flags.includes(`${tag}:invalid`)).length,
  });
  if (metric === 'H1') return [stage, amount, dateHealth('created date', 'created')];
  if (metric === 'H2') return [amount, dateHealth('created date', 'created')];
  return [stage, dateHealth('close date', 'close')];
}
