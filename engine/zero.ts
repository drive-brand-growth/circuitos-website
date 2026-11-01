import { civilFromDays, dayNum } from './civil';
import { heartbeatSummary } from './heartbeat';
import { LABELS, fill } from './labels';
import { isImpossible } from './metrics';
import { EVIDENCE_LINE_SAMPLE } from './params';
import { inPeriod, latestCompletePeriod } from './periods';
import type {
  ExclusionReason, NormalRow, Params, Period, PeriodKind, ReasonCode, RuleId, TraceCard, UnmappedLabel, Verdict, ZeroContext, ZeroEvidence, ZeroMetric, ZeroVerdict,
} from './types';

// The closed set of reason codes. Every verdict carries exactly one.
export const REASON_CODES: ReasonCode[] = [
  'unmapped_label', 'field_went_blank', 'field_never_populated', 'dates_unusable', 'export_stale',
  'no_last_modified', 'insufficient_activity_history', 'quiet_period', 'no_wins_in_period', 'no_evidence',
];

const BAD_DATE: ExclusionReason[] = ['invalid_date', 'impossible_date'];
const BAD_AMOUNT: ExclusionReason[] = ['blank_amount', 'invalid_amount', 'negative_amount'];
const DARK_AMOUNT: ExclusionReason[] = ['blank_amount', 'invalid_amount'];

type Outcome = { rule: RuleId; verdict: Verdict; reason: ReasonCode };

const short = (day: string): string => {
  const [, m, d] = civilFromDays(dayNum(day));
  return `${LABELS.months[m - 1]} ${d}`;
};
const range = (p: Period): string => `${short(p.start)} to ${short(p.end)}`;

// The periods before `latest`, newest first.
function baselineOf(kind: PeriodKind, latest: Period, count: number, weekStart: number): Period[] {
  const out: Period[] = [];
  let cur = latest;
  for (let i = 0; i < count; i++) {
    cur = latestCompletePeriod(kind, cur.start, weekStart);
    out.push(cur);
  }
  return out;
}

// A row whose created day can be trusted.
const trusted = (r: NormalRow, p: Params): r is NormalRow & { createdDay: string } => r.createdDay !== null && !isImpossible(r, p);

function producedPeriods(metric: ZeroMetric, part: NormalRow[], baseline: Period[], p: Params): number {
  let n = 0;
  for (const per of baseline) {
    let hit = false;
    for (const r of part) {
      if (metric === 'H2') hit = trusted(r, p) && inPeriod(r.createdDay, per);
      else if (metric === 'H1') {
        // Was this row open at the end of the period? Rebuilt from its dates.
        const wasOpen = r.stageClass === 'OPEN' || ((r.stageClass === 'WON' || r.stageClass === 'LOST') && r.closeDay !== null && r.closeDay > per.end);
        hit = trusted(r, p) && r.createdDay <= per.end && wasOpen;
      } else {
        const counts = metric === 'H3' ? r.stageClass === 'WON' : r.stageClass === 'WON' || r.stageClass === 'LOST';
        hit = counts && r.closeDay !== null && !isImpossible(r, p) && inPeriod(r.closeDay, per);
      }
      if (hit) break;
    }
    if (hit) n++;
  }
  return n;
}

function groupUnmapped(rows: NormalRow[]): UnmappedLabel[] {
  const by = new Map<string, NormalRow[]>();
  for (const r of rows) {
    const g = by.get(r.stageRaw);
    if (g) g.push(r);
    else by.set(r.stageRaw, [r]);
  }
  return Array.from(by.keys())
    .sort()
    .map((label) => {
      const g = by.get(label) as NormalRow[];
      const seen = g.map((r) => r.modifiedDay ?? r.closeDay ?? r.createdDay).filter((d): d is string => d !== null).sort();
      return {
        label,
        count: g.length,
        lines: g.map((r) => r.line).sort((a, b) => a - b).slice(0, EVIDENCE_LINE_SAMPLE),
        firstSeen: seen[0] ?? '',
        lastSeen: seen[seen.length - 1] ?? '',
      };
    });
}

function pickParams(p: Params, names: (keyof Params)[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const n of names) out[n] = p[n] as number;
  return out;
}

function decide(m: ZeroMetric, card: TraceCard, ev: ZeroEvidence, o: { hasModifiedColumn: boolean; part: NormalRow[]; alive: boolean; stale: boolean; p: Params; blankInPeriod: boolean }): Outcome {
  const { p } = o;
  const needsOpen = m === 'H1';
  const needsWon = m === 'H3' || m === 'closed_count';
  if (needsOpen || needsWon) {
    const noneOfClass = needsOpen ? o.part.every((r) => r.stageClass !== 'OPEN') : true; // a zero win rate or closed count already has no won row in period
    if (noneOfClass && ev.unmapped.length > 0) return { rule: 'Z1', verdict: 'BROKEN', reason: 'unmapped_label' };
  }
  if (card.notComputable) {
    const populated = ev.fieldPopulated !== null && ev.fieldPopulated.den > 0 && ev.fieldPopulated.num >= p.fieldPopMin * ev.fieldPopulated.den;
    return populated ? { rule: 'Z2', verdict: 'BROKEN', reason: 'field_went_blank' } : { rule: 'Z2b', verdict: 'UNKNOWN', reason: 'field_never_populated' };
  }
  if (ev.badDates.den > 0 && ev.badDates.num / ev.badDates.den >= p.badDateMax) return { rule: 'Z3', verdict: 'BROKEN', reason: 'dates_unusable' };
  if (o.stale) return { rule: 'Z4', verdict: 'BROKEN', reason: 'export_stale' };
  if (!o.hasModifiedColumn) return { rule: 'Z5', verdict: 'UNKNOWN', reason: 'no_last_modified' };
  if (ev.activeDays < p.minActiveDays) return { rule: 'Z6', verdict: 'UNKNOWN', reason: 'insufficient_activity_history' };
  const fieldOk = ev.fieldPopulated === null || (ev.fieldPopulated.den > 0 && ev.fieldPopulated.num >= p.fieldPopMin * ev.fieldPopulated.den);
  // A zero that may come from blank amounts, or sits beside a label the engine cannot place, is not positive evidence.
  if (o.alive && ev.producedPeriods > 0 && fieldOk && !o.blankInPeriod && ev.unmapped.length === 0) {
    return { rule: 'Z7', verdict: 'REAL', reason: m === 'H3' ? 'no_wins_in_period' : 'quiet_period' };
  }
  return { rule: 'Z8', verdict: 'UNKNOWN', reason: 'no_evidence' };
}

function lineFor(m: ZeroMetric, out: Outcome, card: TraceCard, ev: ZeroEvidence, latest: Period, kind: PeriodKind, p: Params): string {
  const unit = kind;
  const subjects = LABELS.zero.subject;
  const subject = fill(subjects[m], { asOf: p.asOf, unit, range: range(card.period), den: card.rate?.den ?? 0 });
  const baselineN = ev.baselineChecked;
  const parts: string[] = [subject];
  switch (out.reason) {
    case 'quiet_period':
    case 'no_wins_in_period':
      parts.push(
        m === 'H1'
          ? fill(LABELS.zero.modifiedLatest, { days: ev.modifiedDaysInPeriod, unit, range: range(latest) })
          : fill(LABELS.zero.modifiedSame, { days: ev.modifiedDaysInPeriod, unit }),
        fill(LABELS.zero.usualGap, { gap: ev.usualGap ?? 0 }),
        fill(LABELS.zero.produced[m], { k: ev.producedPeriods, n: baselineN, unit }),
      );
      break;
    case 'export_stale':
      parts.push(fill(LABELS.zero.stale, { days: ev.daysSinceNewest ?? 0, gap: ev.usualGap ?? 0, threshold: ev.staleThreshold ?? 0 }));
      break;
    case 'unmapped_label':
      for (const u of ev.unmapped) {
        parts.push(fill(LABELS.zero.unmapped, { label: u.label, count: u.count, rows: u.count === 1 ? 'row' : 'rows', lines: u.lines.join(', ') }));
      }
      if (ev.lastWonDay) parts.push(fill(LABELS.zero.lastWon, { day: short(ev.lastWonDay) }));
      break;
    case 'dates_unusable':
      parts.push(fill(LABELS.zero.datesUnusable, { bad: ev.badDates.num, den: ev.badDates.den }));
      break;
    case 'field_went_blank':
    case 'field_never_populated':
      parts.push(
        fill(out.reason === 'field_went_blank' ? LABELS.zero.fieldWentBlank : LABELS.zero.fieldNeverPopulated, {
          dark: ev.darkRows, unit, num: ev.fieldPopulated?.num ?? 0, den: ev.fieldPopulated?.den ?? 0,
        }),
      );
      break;
    case 'no_last_modified':
      parts.push(LABELS.zero.noLastModified);
      break;
    case 'insufficient_activity_history':
      parts.push(fill(LABELS.zero.fewActiveDays, { days: ev.activeDays, min: p.minActiveDays }));
      break;
    default:
      parts.push(LABELS.zero.noEvidence);
  }
  return parts.join(' ');
}

const RULE_PARAMS: Record<RuleId, (keyof Params)[]> = {
  Z1: [],
  Z2: ['darkMinRows', 'fieldPopMin'],
  Z2b: ['darkMinRows', 'fieldPopMin'],
  Z3: ['badDateMax'],
  Z4: ['minActiveDays', 'staleMultiple'],
  Z5: [],
  Z6: ['minActiveDays'],
  Z7: ['minActiveDays', 'staleMultiple', 'baselinePeriods', 'fieldPopMin'],
  Z8: ['baselinePeriods', 'fieldPopMin'],
};

// Zero check: one verdict for a zero (REAL means a confirmed zero), or null when the card's value is not zero.
// A win rate with no closed deals is undefined, not zero; the closed count is what gets the verdict then.
export function classifyZero(card: TraceCard, ctx: ZeroContext): ZeroVerdict | null {
  if (!card.valueIsZero) return null;
  const p = ctx.params;
  const m: ZeroMetric = card.metricId === 'H3' && card.rate === null ? 'closed_count' : card.metricId;
  const part = ctx.rows.filter((r) => r.currency === card.currency);
  const kind: PeriodKind = card.metricId === 'H3' ? p.winPeriod : p.newPeriod;
  const latest = card.metricId === 'H1' ? latestCompletePeriod(kind, p.asOf, p.weekStart) : card.period;
  const baseline = baselineOf(kind, latest, p.baselinePeriods, p.weekStart);

  // Heartbeat: file wide, whatever the currency.
  const hb = heartbeatSummary(ctx.rows, p.asOf, p);
  const modDays = new Set<string>();
  let modRows = 0;
  for (const r of ctx.rows) {
    if (r.modifiedDay !== null && inPeriod(r.modifiedDay, latest)) {
      modDays.add(r.modifiedDay);
      modRows++;
    }
  }
  const alive = hb.staleThreshold !== null && !hb.stale && modRows > 0;

  // Field history, for the metrics that sum an amount.
  let fieldPopulated: ZeroEvidence['fieldPopulated'] = null;
  if (m === 'H1' || m === 'H2') {
    const first = baseline[baseline.length - 1];
    const last = baseline[0];
    const rows = first && last ? part.filter((r) => trusted(r, p) && inPeriod(r.createdDay, { start: first.start, end: last.end })) : [];
    fieldPopulated = { num: rows.filter((r) => r.amountState === 'ok').length, den: rows.length };
  }

  // Unmapped labels that matter for this number.
  let unmapped: UnmappedLabel[] = [];
  if (m === 'H1') unmapped = groupUnmapped(part.filter((r) => r.stageClass === 'UNMAPPED'));
  else if (m === 'H3' || m === 'closed_count') {
    const byLine = new Map(part.map((r) => [r.line, r] as const));
    unmapped = groupUnmapped((card.unmappedInPeriod ?? []).map((u) => byLine.get(u.line)).filter((r): r is NormalRow => r !== undefined));
  }
  let lastWonDay: string | null = null;
  if (m === 'H3' || m === 'closed_count') {
    for (const r of part) if (r.stageClass === 'WON' && r.closeDay !== null && !isImpossible(r, p) && (lastWonDay === null || r.closeDay > lastWonDay)) lastWonDay = r.closeDay;
  }

  const bad = card.excluded.filter((e) => BAD_DATE.includes(e.reason)).length;
  const evidence: ZeroEvidence = {
    activeDays: hb.activeDays,
    usualGap: hb.usualGap,
    staleThreshold: hb.staleThreshold,
    daysSinceNewest: hb.daysSinceNewest,
    modifiedDaysInPeriod: modDays.size,
    baselineChecked: baseline.length,
    producedPeriods: producedPeriods(m, part, baseline, p),
    fieldPopulated,
    darkRows: card.excluded.filter((e) => DARK_AMOUNT.includes(e.reason)).length,
    badDates: { num: bad, den: card.includedCount + card.excluded.length },
    unmapped,
    lastWonDay,
  };

  const blankInPeriod = (m === 'H1' || m === 'H2') && card.excluded.some((e) => BAD_AMOUNT.includes(e.reason));
  const out = decide(m, card, evidence, { hasModifiedColumn: ctx.hasModifiedColumn, part, alive, stale: hb.stale, p, blankInPeriod });
  const verdict: ZeroVerdict = {
    metricId: m,
    currency: card.currency,
    period: card.period,
    verdict: out.verdict,
    rule: out.rule,
    reason: out.reason,
    line: lineFor(m, out, card, evidence, latest, kind, p),
    warnings: hb.modifiedAfterAsOf ? ['modified_after_as_of'] : [],
    evidence,
    params: pickParams(p, RULE_PARAMS[out.rule].filter((k) => fieldPopulated !== null || k !== 'fieldPopMin')),
  };
  if (m === 'H1' && out.verdict === 'REAL') verdict.note = LABELS.zero.emptyOpenNote;
  return verdict;
}

export function classifyZeros(cards: TraceCard[], ctx: ZeroContext): ZeroVerdict[] {
  const out: ZeroVerdict[] = [];
  for (const c of cards) {
    const v = classifyZero(c, ctx);
    if (v) out.push(v);
  }
  return out;
}
