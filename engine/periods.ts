import { civilFromDays, daysInMonth, dayNum, dayStr, fmtDay, isoWeekday } from './civil';
import type { Period, PeriodKind } from './types';

// The most recent week or calendar month that ended strictly before asOf.
// A week runs from weekStart (ISO weekday, 1 is Monday) for seven days.
export function latestCompletePeriod(kind: PeriodKind, asOf: string, weekStart = 1): Period {
  const n = dayNum(asOf);
  if (kind === 'week') {
    const back = (isoWeekday(n) - weekStart + 7) % 7;
    const thisStart = n - back;
    return { start: dayStr(thisStart - 7), end: dayStr(thisStart - 1) };
  }
  const [y, m] = civilFromDays(n);
  const py = m === 1 ? y - 1 : y;
  const pm = m === 1 ? 12 : m - 1;
  return { start: fmtDay(py, pm, 1), end: fmtDay(py, pm, daysInMonth(py, pm)) };
}

export function inPeriod(day: string, p: Period): boolean {
  return day >= p.start && day <= p.end;
}
