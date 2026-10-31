import type { HopKind, MetricId, NormalRow, Params, TraceCard } from './types';
export function buildTrace(_metricId: MetricId, _rows: NormalRow[], _params: Params): TraceCard[] {
  throw new Error('not implemented');
}
export function pickWeakest(_severities: Record<HopKind, number>): HopKind | null {
  throw new Error('not implemented');
}
