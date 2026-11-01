import { heartbeatSummary } from '../heartbeat';
import { parseOk, forFixture, fixtureBytes, opts, params } from './helpers';
import { buildTrace } from '../trace';
import { classifyZeros } from '../zero';
import type { MetricId, NormalRow, Params, ParseOptions, ZeroContext, ZeroMetric, ZeroVerdict } from '../types';

const METRICS: MetricId[] = ['H1', 'H2', 'H3'];

export function zeroRows(rows: NormalRow[], p: Params, hasModifiedColumn = true): ZeroVerdict[] {
  const cards = METRICS.flatMap((m) => buildTrace(m, rows, p));
  const ctx: ZeroContext = { rows, params: p, hasModifiedColumn };
  return classifyZeros(cards, ctx);
}

export function zeroRun(bytes: Uint8Array, o: ParseOptions = opts(), p: Params = params()): ZeroVerdict[] {
  const { rows, meta } = parseOk(bytes, o);
  return zeroRows(rows, p, meta.hasModifiedColumn);
}

export function zeroFixture(name: string, tz?: string): ZeroVerdict[] {
  const { o, p } = forFixture(name, tz);
  return zeroRun(fixtureBytes(name), o, p);
}

export function pick(vs: ZeroVerdict[], metric: ZeroMetric, currency = 'UNSTATED'): ZeroVerdict {
  const v = vs.find((x) => x.metricId === metric && x.currency === currency);
  if (!v) throw new Error(`no verdict for ${metric} ${currency}; have ${vs.map((x) => `${x.metricId}/${x.currency}`).join(', ')}`);
  return v;
}

export function has(vs: ZeroVerdict[], metric: ZeroMetric, currency = 'UNSTATED'): boolean {
  return vs.some((x) => x.metricId === metric && x.currency === currency);
}

export function heartbeatOf(name: string, p: Params) {
  const { rows } = parseOk(fixtureBytes(name), forFixture(name).o);
  return heartbeatSummary(rows, p.asOf, p);
}
