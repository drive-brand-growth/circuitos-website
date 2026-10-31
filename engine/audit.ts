import type { Finding, MetricId, ParseError, ParseMeta, ParseOptions, Params, TraceCard } from './types';
export type AuditResult =
  | { ok: true; meta: ParseMeta; findings: Finding[]; cards: TraceCard[] }
  | { ok: false; error: ParseError };
export const METRICS: MetricId[] = ['H1', 'H2', 'H3'];
export function runAudit(_bytes: Uint8Array, _opts: ParseOptions, _params: Params): AuditResult {
  throw new Error('not implemented');
}
