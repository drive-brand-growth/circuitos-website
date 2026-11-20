import { describe, expect, it } from 'vitest';
import { latestCompletePeriod } from '../periods';

describe('M2 periods', () => {
  it('period_latest_complete_week_monday_start', () => {
    expect(latestCompletePeriod('week', '2026-10-30')).toEqual({ start: '2026-10-19', end: '2026-10-25' }); // Friday
    expect(latestCompletePeriod('week', '2026-10-25')).toEqual({ start: '2026-10-12', end: '2026-10-18' }); // Sunday, its own week is not complete
    expect(latestCompletePeriod('week', '2026-10-26')).toEqual({ start: '2026-10-19', end: '2026-10-25' }); // Monday
    expect(latestCompletePeriod('week', '2026-12-15')).toEqual({ start: '2026-12-07', end: '2026-12-13' }); // fixture 03
    expect(latestCompletePeriod('week', '2027-01-04')).toEqual({ start: '2026-12-28', end: '2027-01-03' }); // year wrap
  });

  it('period_latest_complete_week_other_week_start', () => {
    // week_start Sunday (ISO 7): Sun Oct 18 to Sat Oct 24 is the latest complete week for Fri Oct 30
    expect(latestCompletePeriod('week', '2026-10-30', 7)).toEqual({ start: '2026-10-18', end: '2026-10-24' });
  });

  it('period_latest_complete_month', () => {
    expect(latestCompletePeriod('month', '2026-10-30')).toEqual({ start: '2026-09-01', end: '2026-09-30' });
    expect(latestCompletePeriod('month', '2026-11-01')).toEqual({ start: '2026-10-01', end: '2026-10-31' });
    expect(latestCompletePeriod('month', '2026-10-31')).toEqual({ start: '2026-09-01', end: '2026-09-30' }); // last day of its month is not strictly after the end
    expect(latestCompletePeriod('month', '2026-12-15')).toEqual({ start: '2026-11-01', end: '2026-11-30' });
    expect(latestCompletePeriod('month', '2027-01-05')).toEqual({ start: '2026-12-01', end: '2026-12-31' });
    expect(latestCompletePeriod('month', '2027-03-10')).toEqual({ start: '2027-02-01', end: '2027-02-28' });
    expect(latestCompletePeriod('month', '2028-03-10')).toEqual({ start: '2028-02-01', end: '2028-02-29' });
  });
});
