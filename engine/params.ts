import type { Params } from './types';

// Named defaults. They are engineering defaults the owner can change, not facts about any industry.
export const MAX_BYTES = 26214400; // 25 MiB, assumed; the browser limit is TO VERIFY by measurement
export const MAX_ROWS = 250000; // assumed, TO VERIFY
export const MIN_YEAR = 1990;
export const MAX_YEAR_AHEAD = 5;
export const MIN_ACTIVE_DAYS = 10;
export const STALE_MULTIPLE = 2;
export const DARK_MIN_ROWS = 3;
export const WEEK_START_MONDAY = 1;
export const BASELINE_PERIODS = 8; // complete periods before the latest one that count as history
export const FIELD_POP_MIN = 0.5; // share of baseline rows with the field filled, at least
export const BAD_DATE_MAX = 0.2; // share of candidate rows with an unusable date that makes a zero BROKEN

export function makeParams(input: Pick<Params, 'asOf' | 'reportTz'> & Partial<Params>): Params {
  return {
    weekStart: WEEK_START_MONDAY,
    newPeriod: 'week',
    winPeriod: 'month',
    minYear: MIN_YEAR,
    maxYearAhead: MAX_YEAR_AHEAD,
    minActiveDays: MIN_ACTIVE_DAYS,
    staleMultiple: STALE_MULTIPLE,
    darkMinRows: DARK_MIN_ROWS,
    baselinePeriods: BASELINE_PERIODS,
    fieldPopMin: FIELD_POP_MIN,
    badDateMax: BAD_DATE_MAX,
    ...input,
  };
}
