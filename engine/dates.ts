import { daysFromCivil, fmtDay, validCivil } from './civil';
import type { DateOrder } from './types';

export type DateCell = { kind: 'blank' } | { kind: 'invalid' } | { kind: 'ok'; day: string; noOffset: boolean };

const MONTHS: Record<string, number> = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3, apr: 4, april: 4, may: 5, jun: 6, june: 6,
  jul: 7, july: 7, aug: 8, august: 8, sep: 9, sept: 9, september: 9, oct: 10, october: 10, nov: 11, november: 11, dec: 12, december: 12,
};

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const ISO_DATETIME = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.\d+)?)?\s*(Z|[+-]\d{2}(?::?\d{2})?)?$/i;
const SLASH = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
const MON_D_Y = /^([A-Za-z]{3,9})\.?\s+(\d{1,2})(?:st|nd|rd|th)?,?\s+(\d{4})$/;
const D_MON_Y = /^(\d{1,2})\s+([A-Za-z]{3,9})\.?,?\s+(\d{4})$/;

const formatters = new Map<string, Intl.DateTimeFormat>();

export function isValidTimeZone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

function formatterFor(tz: string): Intl.DateTimeFormat {
  let f = formatters.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hourCycle: 'h23' });
    formatters.set(tz, f);
  }
  return f;
}

// The calendar day an instant falls on in the report zone.
function dayInZone(ms: number, tz: string): string {
  const parts = formatterFor(tz).formatToParts(new Date(ms));
  let y = 0;
  let m = 0;
  let d = 0;
  for (const p of parts) {
    if (p.type === 'year') y = Number(p.value);
    else if (p.type === 'month') m = Number(p.value);
    else if (p.type === 'day') d = Number(p.value);
  }
  return fmtDay(y, m, d);
}

// For order inference: the two leading numbers of an M/D/YYYY or D/M/YYYY text, or null.
export function slashParts(text: string): [number, number] | null {
  const m = SLASH.exec(text.trim());
  return m ? [Number(m[1]), Number(m[2])] : null;
}

function ok(y: number, m: number, d: number, noOffset: boolean): DateCell {
  return validCivil(y, m, d) ? { kind: 'ok', day: fmtDay(y, m, d), noOffset } : { kind: 'invalid' };
}

export function parseDateCell(text: string, order: DateOrder | null, tz: string): DateCell {
  const s = text.trim();
  if (s === '') return { kind: 'blank' };
  let m = ISO_DATE.exec(s);
  if (m) return ok(Number(m[1]), Number(m[2]), Number(m[3]), false);
  m = ISO_DATETIME.exec(s);
  if (m) {
    const [y, mo, d, h, mi] = [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4]), Number(m[5])];
    const sec = m[6] === undefined ? 0 : Number(m[6]);
    if (!validCivil(y, mo, d) || h > 23 || mi > 59 || sec > 59) return { kind: 'invalid' };
    const z = m[7];
    if (z === undefined) return { kind: 'ok', day: fmtDay(y, mo, d), noOffset: true };
    let offsetSec = 0;
    if (z.toUpperCase() !== 'Z') {
      const digits = z.slice(1).replace(':', '');
      const oh = Number(digits.slice(0, 2));
      const om = digits.length > 2 ? Number(digits.slice(2, 4)) : 0;
      if (oh > 14 || om > 59) return { kind: 'invalid' };
      offsetSec = (z[0] === '-' ? -1 : 1) * (oh * 3600 + om * 60);
    }
    const ms = (daysFromCivil(y, mo, d) * 86400 + h * 3600 + mi * 60 + sec - offsetSec) * 1000;
    return { kind: 'ok', day: dayInZone(ms, tz), noOffset: false };
  }
  m = SLASH.exec(s);
  if (m) {
    if (order === null) return { kind: 'invalid' };
    const a = Number(m[1]);
    const b = Number(m[2]);
    return order === 'mdy' ? ok(Number(m[3]), a, b, false) : ok(Number(m[3]), b, a, false);
  }
  m = MON_D_Y.exec(s);
  if (m) {
    const mo = MONTHS[m[1].toLowerCase()];
    return mo ? ok(Number(m[3]), mo, Number(m[2]), false) : { kind: 'invalid' };
  }
  m = D_MON_Y.exec(s);
  if (m) {
    const mo = MONTHS[m[2].toLowerCase()];
    return mo ? ok(Number(m[3]), mo, Number(m[1]), false) : { kind: 'invalid' };
  }
  return { kind: 'invalid' };
}
