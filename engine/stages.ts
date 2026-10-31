import type { StageClass, StageMapping } from './types';

const WON = new Set(['closed won', 'closedwon', 'won']);
const LOST = new Set(['closed lost', 'closedlost', 'lost']);
const END_STATE = /closed|won|lost|churn|cancel/i;

function inList(list: string[] | undefined, key: string): boolean {
  return !!list && list.some((x) => x.trim().toLowerCase() === key);
}

// SPEC 3.4, rules in order.
export function classifyStage(label: string, mapping?: StageMapping, flags?: { isClosed?: boolean | null; isWon?: boolean | null }): StageClass {
  if (flags && typeof flags.isClosed === 'boolean' && typeof flags.isWon === 'boolean') {
    if (flags.isWon) return 'WON';
    return flags.isClosed ? 'LOST' : 'OPEN';
  }
  const key = label.trim().toLowerCase();
  if (mapping) {
    if (inList(mapping.won, key)) return 'WON';
    if (inList(mapping.lost, key)) return 'LOST';
    if (inList(mapping.open, key)) return 'OPEN';
  }
  if (WON.has(key)) return 'WON';
  if (LOST.has(key)) return 'LOST';
  if (END_STATE.test(label)) return 'UNMAPPED';
  return 'OPEN';
}
