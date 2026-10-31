// Generator for fixture 10 (MADE UP, synthetic). The CSV is built in memory by tests and never committed.
// Formula comes from FIXTURES.md section 10.

const STAGES = ['Discovery', 'Qualified', 'Proposal', 'Closed Won', 'Closed Lost'];
const DAY_MS = 86400000;

function isoDay(base: number, plusDays: number): string {
  return new Date(base + plusDays * DAY_MS).toISOString().slice(0, 10);
}

export function hugeAmountCents(i: number): number {
  return ((i * 7919) % 1000000) + 100;
}

function dollars(cents: number): string {
  const whole = Math.floor(cents / 100);
  const frac = String(cents % 100).padStart(2, '0');
  return `${whole}.${frac}`;
}

export function hugeStage(i: number): string {
  return STAGES[i % 5];
}

export function hugeCreatedDay(i: number): string {
  return isoDay(Date.UTC(2026, 0, 1), i % 300);
}

export function genHuge(n: number, padToBytes = 0): Uint8Array {
  const base = Date.UTC(2026, 0, 1);
  const lines: string[] = ['Record ID,Deal Stage,Amount,Close Date,Create Date,Deal owner,Last Modified Date'];
  for (let i = 1; i <= n; i++) {
    const created = isoDay(base, i % 300);
    const close = isoDay(base, (i % 300) + 30);
    lines.push(
      [`H${String(i).padStart(6, '0')}`, hugeStage(i), dollars(hugeAmountCents(i)), close, created, `Rep ${String.fromCharCode(65 + (i % 7))}`, created].join(','),
    );
  }
  let text = lines.join('\n') + '\n';
  if (padToBytes > 0 && text.length < padToBytes) text += ' '.repeat(padToBytes - text.length);
  return new TextEncoder().encode(text);
}
