import type { AmountState } from './types';

export interface AmountResult {
  state: AmountState;
  minor: number | null; // integer cents
  currency?: string; // from a leading ISO code such as "USD 10,000.00"
}

const MAX_SAFE = BigInt(Number.MAX_SAFE_INTEGER);
const WITH_GROUPS = /^\d{1,3}(,\d{3})*(\.\d+)?$/;
const PLAIN = /^\d+(\.\d+)?$/;
const WITH_GROUPS_DC = /^\d{1,3}(\.\d{3})*(,\d+)?$/;
const PLAIN_DC = /^\d+(,\d+)?$/;
const ASCII_DIGITS = /^[0-9.,]+$/;

// Integer cents by string arithmetic. Nothing is guessed: unknown shapes are invalid.
export function parseAmount(text: string, opts: { decimalComma?: boolean } = {}): AmountResult {
  let s = text.trim();
  if (s === '') return { state: 'blank', minor: null };
  let currency: string | undefined;
  const code = /^([A-Za-z]{3})\s*(?=[\d$€£-])/.exec(s);
  if (code) {
    currency = code[1].toUpperCase();
    s = s.slice(code[0].length);
  }
  let negative = false;
  if (s.startsWith('-')) {
    negative = true;
    s = s.slice(1);
  }
  s = s.replace(/^[$€£]/, '').replace(/\s+/g, '');
  if (s.startsWith('-') || !ASCII_DIGITS.test(s)) return { state: 'invalid', minor: null };
  const dc = opts.decimalComma === true;
  if (!(dc ? WITH_GROUPS_DC.test(s) || PLAIN_DC.test(s) : WITH_GROUPS.test(s) || PLAIN.test(s))) return { state: 'invalid', minor: null };
  const sepThousands = dc ? '.' : ',';
  const sepDecimal = dc ? ',' : '.';
  const [wholeRaw, fracRaw = ''] = s.split(sepDecimal);
  if (fracRaw.length > 2) return { state: 'invalid', minor: null };
  const whole = wholeRaw.split(sepThousands).join('');
  const digits = (whole + fracRaw.padEnd(2, '0')).replace(/^0+(?=\d)/, '');
  let big: bigint;
  try {
    big = BigInt(digits);
  } catch {
    return { state: 'invalid', minor: null };
  }
  if (big > MAX_SAFE) return { state: 'invalid', minor: null };
  const cents = Number(big);
  const result: AmountResult = negative && cents > 0 ? { state: 'negative', minor: -cents } : { state: 'ok', minor: cents };
  if (currency) result.currency = currency;
  return result;
}
