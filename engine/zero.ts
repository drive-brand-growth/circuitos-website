import type { TraceCard, ZeroContext, ZeroVerdict, ReasonCode } from './types';

export const REASON_CODES: ReasonCode[] = [
  'unmapped_label', 'field_went_blank', 'field_never_populated', 'dates_unusable', 'export_stale',
  'no_last_modified', 'insufficient_activity_history', 'quiet_period', 'no_wins_in_period', 'no_evidence',
];

export function classifyZero(_card: TraceCard, _ctx: ZeroContext): ZeroVerdict | null {
  throw new Error('not implemented');
}

export function classifyZeros(_cards: TraceCard[], _ctx: ZeroContext): ZeroVerdict[] {
  throw new Error('not implemented');
}
