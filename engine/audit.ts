import { heartbeatSummary } from './heartbeat';
import { isImpossible } from './metrics';
import { parseFile } from './parse';
import { buildTrace } from './trace';
import type { Finding, MetricId, NormalRow, ParseError, ParseMeta, ParseOptions, Params, TraceCard } from './types';

export type AuditResult =
  | { ok: true; meta: ParseMeta; findings: Finding[]; cards: TraceCard[] }
  | { ok: false; error: ParseError };

export const METRICS: MetricId[] = ['H1', 'H2', 'H3'];
const SAMPLE = 10;

function auditFindings(rows: NormalRow[], p: Params): Finding[] {
  const out: Finding[] = [];
  const impossible = rows.filter((r) => isImpossible(r, p));
  if (impossible.length > 0) out.push({ code: 'impossible_date', count: impossible.length, lines: impossible.slice(0, SAMPLE).map((r) => r.line) });

  const hb = heartbeatSummary(rows, p.asOf, p);
  if (hb.modifiedAfterAsOf) {
    out.push({ code: 'modified_after_as_of', count: 1, lines: [], detail: { newestModifiedDay: hb.newestModifiedDay ?? '' } });
  }
  if (hb.stale) {
    out.push({ code: 'export_stale_warning', count: 1, lines: [], detail: { daysSinceNewest: hb.daysSinceNewest ?? 0, staleThreshold: hb.staleThreshold ?? 0 } });
  }

  // Stage labels the engine could not place. Seen days come from the newest of modified, close, created.
  const labels = new Map<string, NormalRow[]>();
  for (const r of rows) {
    if (r.stageClass !== 'UNMAPPED') continue;
    const g = labels.get(r.stageRaw);
    if (g) g.push(r);
    else labels.set(r.stageRaw, [r]);
  }
  Array.from(labels.keys())
    .sort()
    .forEach((label) => {
      const g = labels.get(label) as NormalRow[];
      const seen = g.map((r) => r.modifiedDay ?? r.closeDay ?? r.createdDay).filter((d): d is string => d !== null).sort();
      out.push({
        code: 'stage_vocab_drift',
        count: g.length,
        lines: g.slice(0, SAMPLE).map((r) => r.line),
        detail: { label, firstSeen: seen[0] ?? '', lastSeen: seen[seen.length - 1] ?? '' },
      });
    });
  return out;
}

export function runAudit(bytes: Uint8Array, opts: ParseOptions, params: Params): AuditResult {
  const parsed = parseFile(bytes, opts);
  if (!parsed.ok) return { ok: false, error: parsed.error };
  const { meta, rows } = parsed;
  const p: Params = {
    ...params,
    source: {
      fileSha256: meta.fileSha256,
      rowsRead: meta.rowsRead,
      rowsUsed: meta.rowsUsed,
      encoding: meta.encoding,
      delimiter: meta.delimiter,
      droppedHeaders: meta.droppedHeaders,
    },
  };
  const cards = METRICS.flatMap((m) => buildTrace(m, rows, p));
  return { ok: true, meta, findings: [...parsed.findings, ...auditFindings(rows, p)], cards };
}
