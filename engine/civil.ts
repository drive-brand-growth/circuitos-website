// Calendar math on YYYY-MM-DD strings with no Date object, so years and zones never shift a day.

export function daysFromCivil(y: number, m: number, d: number): number {
  const yy = m <= 2 ? y - 1 : y;
  const era = Math.floor(yy / 400);
  const yoe = yy - era * 400;
  const doy = Math.floor((153 * (m + (m > 2 ? -3 : 9)) + 2) / 5) + d - 1;
  const doe = yoe * 365 + Math.floor(yoe / 4) - Math.floor(yoe / 100) + doy;
  return era * 146097 + doe - 719468;
}

export function civilFromDays(z0: number): [number, number, number] {
  const z = z0 + 719468;
  const era = Math.floor(z / 146097);
  const doe = z - era * 146097;
  const yoe = Math.floor((doe - Math.floor(doe / 1460) + Math.floor(doe / 36524) - Math.floor(doe / 146096)) / 365);
  const y = yoe + era * 400;
  const doy = doe - (365 * yoe + Math.floor(yoe / 4) - Math.floor(yoe / 100));
  const mp = Math.floor((5 * doy + 2) / 153);
  const d = doy - Math.floor((153 * mp + 2) / 5) + 1;
  const m = mp < 10 ? mp + 3 : mp - 9;
  return [m <= 2 ? y + 1 : y, m, d];
}

export function isLeap(y: number): boolean {
  return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
}

export function daysInMonth(y: number, m: number): number {
  return [31, isLeap(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
}

export function validCivil(y: number, m: number, d: number): boolean {
  return Number.isInteger(y) && m >= 1 && m <= 12 && d >= 1 && d <= daysInMonth(y, m);
}

const p2 = (n: number) => String(n).padStart(2, '0');

export function fmtDay(y: number, m: number, d: number): string {
  return `${String(y).padStart(4, '0')}-${p2(m)}-${p2(d)}`;
}

// Day string to a day number (days since 1970-01-01). Input must be YYYY-MM-DD.
export function dayNum(day: string): number {
  return daysFromCivil(Number(day.slice(0, 4)), Number(day.slice(5, 7)), Number(day.slice(8, 10)));
}

export function dayStr(n: number): string {
  const [y, m, d] = civilFromDays(n);
  return fmtDay(y, m, d);
}

// ISO weekday: 1 is Monday, 7 is Sunday.
export function isoWeekday(n: number): number {
  return ((((n + 3) % 7) + 7) % 7) + 1;
}

export function yearOf(day: string): number {
  return Number(day.slice(0, 4));
}
