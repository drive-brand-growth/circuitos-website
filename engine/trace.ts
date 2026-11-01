import { heartbeatSummary } from './heartbeat';
import { LABELS, fill } from './labels';
import { REASON_ORDER, amountReason, fieldHealth, inScope, reasonBeforeAmount } from './metrics';
import { latestCompletePeriod } from './periods';
import type { ExcludedRow, ExclusionReason, FieldHealth, Hop, HopKind, MetricId, NormalRow, Params, Period, TraceCard } from './types';

const HOP_ORDER: HopKind[] = ['definition', 'filter', 'field_health', 'source', 'heartbeat'];

// Highest severity wins; ties go to the order definition, filter, field health, source, heartbeat.
// All zero means no weak hop.
export function pickWeakest(severities: Record<HopKind, number>): HopKind | null {
  let best: HopKind | null = null;
  let bestSeverity = 0;
  for (const k of HOP_ORDER) {
    if (severities[k] > bestSeverity) {
      best = k;
      bestSeverity = severities[k];
    }
  }
  return best;
}

function periodOf(metric: MetricId, p: Params): Period {
  if (metric === 'H1') return { start: p.asOf, end: p.asOf };
  return latestCompletePeriod(metric === 'H2' ? p.newPeriod : p.winPeriod, p.asOf, p.weekStart);
}

function definitionText(metric: MetricId, period: Period, p: Params): string {
  return fill(LABELS.metrics[metric].definition, { asOf: p.asOf, start: period.start, end: period.end });
}

function topReason(byReason: Record<string, number>): ExclusionReason | null {
  let best: ExclusionReason | null = null;
  let n = 0;
  for (const r of REASON_ORDER) {
    if ((byReason[r] ?? 0) > n) {
      best = r;
      n = byReason[r];
    }
  }
  return best;
}

function worstField(fields: FieldHealth[]): { f: FieldHealth; rate: number } | null {
  let best: { f: FieldHealth; rate: number } | null = null;
  for (const f of fields) {
    if (f.inScope === 0) continue;
    const rate = Math.max(f.blank, f.invalid) / f.inScope;
    if (rate > 0 && (!best || rate > best.rate)) best = { f, rate };
  }
  return best;
}

function buildCard(metric: MetricId, currency: string, part: NormalRow[], allRows: NormalRow[], p: Params): TraceCard {
  const period = periodOf(metric, p);
  const rows = part.slice().sort((a, b) => a.line - b.line);
  const included: NormalRow[] = [];
  const excluded: ExcludedRow[] = [];
  const scoped: NormalRow[] = [];
  let outOfScope = 0;
  let eligible = 0;
  let unusable = 0;
  const unmappedInPeriod: { line: number; label: string }[] = [];

  for (const r of rows) {
    if (!inScope(metric, r, p, period)) {
      outOfScope++;
      continue;
    }
    scoped.push(r);
    if (metric === 'H3' && r.stageClass === 'UNMAPPED') unmappedInPeriod.push({ line: r.line, label: r.stageRaw });
    let reason = reasonBeforeAmount(metric, r, p);
    if (reason === null && metric !== 'H3') {
      eligible++;
      if (r.amountState === 'blank' || r.amountState === 'invalid') unusable++;
      reason = amountReason(r);
    }
    if (reason) excluded.push({ line: r.line, reason, label: r.stageRaw });
    else included.push(r);
  }

  const byReason: Record<string, number> = {};
  for (const reason of REASON_ORDER) {
    const n = excluded.filter((e) => e.reason === reason).length;
    if (n > 0) byReason[reason] = n;
  }

  const card: TraceCard = {
    metricId: metric,
    currency,
    period,
    valueMinor: null,
    rate: null,
    valueIsZero: false,
    notComputable: false,
    includedLines: included.map((r) => r.line),
    includedCount: included.length,
    excluded,
    outOfScope,
    byReason,
    hops: [],
    weakest: null,
    weakestSentence: LABELS.trace.noWeakHop,
  };

  if (metric === 'H3') {
    const won = included.filter((r) => r.stageClass === 'WON');
    const lost = included.filter((r) => r.stageClass === 'LOST');
    card.rate = won.length + lost.length === 0 ? null : { num: won.length, den: won.length + lost.length };
    card.valueIsZero = card.rate === null || card.rate.num === 0;
    card.wonAmountMinor = won.reduce((s, r) => s + (r.amountState === 'ok' ? (r.amountMinor as number) : 0), 0);
    card.lostAmountMinor = lost.reduce((s, r) => s + (r.amountState === 'ok' ? (r.amountMinor as number) : 0), 0);
    card.unmappedInPeriod = unmappedInPeriod;
  } else {
    card.notComputable = eligible >= p.darkMinRows && unusable === eligible;
    card.valueMinor = card.notComputable ? null : included.reduce((s, r) => s + (r.amountMinor as number), 0);
    card.valueIsZero = card.valueMinor === null || card.valueMinor === 0;
  }

  // Hops
  const total = included.length + excluded.length;
  const filterSeverity = total === 0 ? 0 : excluded.length / total;
  const fields = fieldHealth(metric, scoped);
  const worst = worstField(fields);
  const hb = heartbeatSummary(allRows, p.asOf, p);
  const hops: Hop[] = [
    { kind: 'definition', text: definitionText(metric, period, p), severity: 0 },
    { kind: 'filter', matched: included.length, excluded: excluded.length, outOfScope, byReason, severity: filterSeverity },
    { kind: 'field_health', fields, severity: worst ? worst.rate : 0 },
    { kind: 'source', asOf: p.asOf, reportTz: p.reportTz, severity: 0, ...(p.source ?? {}) },
    { kind: 'heartbeat', ...hb, severity: hb.stale ? 1 : 0 },
  ];
  card.hops = hops;

  const severities = { definition: 0, filter: filterSeverity, field_health: worst ? worst.rate : 0, source: 0, heartbeat: hb.stale ? 1 : 0 };
  const kind = pickWeakest(severities);
  let sentence: string | null = null;
  if (kind === 'filter') {
    const top = topReason(byReason);
    sentence = fill(LABELS.trace.weakFilter, { excluded: excluded.length, total, reason: top ? LABELS.reasons[top] : '' });
  } else if (kind === 'field_health' && worst) {
    sentence = fill(LABELS.trace.weakFieldHealth, { field: worst.f.field, bad: Math.max(worst.f.blank, worst.f.invalid), rows: worst.f.inScope });
  } else if (kind === 'heartbeat') {
    sentence = fill(LABELS.trace.weakHeartbeat, { days: hb.daysSinceNewest ?? 0, gap: hb.usualGap ?? 0, threshold: hb.staleThreshold ?? 0 });
  }
  if (kind && sentence) {
    card.weakest = { kind, severity: severities[kind], sentence };
    card.weakestSentence = sentence;
  }
  return card;
}

// Row trace: one card per currency partition. The engine never converts or mixes currencies.
export function buildTrace(metricId: MetricId, rows: NormalRow[], params: Params): TraceCard[] {
  const parts = new Map<string, NormalRow[]>();
  for (const r of rows) {
    const g = parts.get(r.currency);
    if (g) g.push(r);
    else parts.set(r.currency, [r]);
  }
  return Array.from(parts.keys())
    .sort()
    .map((cur) => buildCard(metricId, cur, parts.get(cur) as NormalRow[], rows, params));
}

