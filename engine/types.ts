// Shared types for the audit engine. No logic here.

export type StageClass = 'OPEN' | 'WON' | 'LOST' | 'UNMAPPED';
export type AmountState = 'ok' | 'blank' | 'invalid' | 'negative';
export type MetricId = 'H1' | 'H2' | 'H3';
export type DateOrder = 'mdy' | 'dmy';

export type LogicalField =
  | 'record_id'
  | 'stage'
  | 'amount'
  | 'created_date'
  | 'close_date'
  | 'last_modified_date'
  | 'owner'
  | 'currency'
  | 'is_closed'
  | 'is_won';

// Logical field to the header text as it appears in the file.
export type Mapping = Partial<Record<LogicalField, string>>;

export interface StageMapping {
  won?: string[];
  lost?: string[];
  open?: string[];
}

export type DateField = 'created_date' | 'close_date' | 'last_modified_date';

export interface ParseOptions {
  reportTz: string; // IANA zone name
  hmacKey: string; // created by the caller; the engine never makes randomness
  mapping?: Mapping; // overrides suggestMapping per field
  stageMapping?: StageMapping;
  dateOrder?: Partial<Record<DateField, DateOrder>>;
  maxBytes?: number;
  maxRows?: number;
  showIds?: boolean; // keeps idRaw in memory on each row (never serialized)
}

export interface NormalRow {
  line: number; // file line where the row starts, header is line 1
  idHash: string; // 12 hex chars
  idRaw?: string; // memory only, not enumerable, never serialized
  createdDay: string | null; // YYYY-MM-DD in report_tz, null if blank or invalid
  closeDay: string | null;
  modifiedDay: string | null;
  stageRaw: string; // trimmed, truncated, formula neutralized
  stageClass: StageClass;
  amountMinor: number | null; // integer cents; null if blank or invalid
  amountState: AmountState;
  currency: string; // 'UNSTATED' if none
  ownerKey: string | null;
  flags: string[];
}

export interface Finding {
  code: string;
  count: number;
  lines: number[]; // sample, at most 10
  detail?: Record<string, number | string>;
}

export interface ParseMeta {
  fileSha256: string;
  bytes: number;
  encoding: 'utf-8' | 'windows-1252';
  delimiter: string;
  reportTz: string;
  rowsRead: number; // data records read (ragged included; blank, footer and totals rows not)
  rowsUsed: number; // rows kept as NormalRow
  droppedHeaders: string[]; // header names only, never values
  mapping: Mapping;
  hasIdColumn: boolean;
  hasModifiedColumn: boolean;
  hasOwnerColumn: boolean;
  hasCurrencyColumn: boolean;
  ownerKeys: string[]; // by first appearance; "Owner N" is index plus one
}

export interface ParseError {
  code: string;
  detail?: Record<string, number | string>; // header names, counts and line numbers only
}

export type ParseResult =
  | { ok: true; rows: NormalRow[]; meta: ParseMeta; findings: Finding[] }
  | { ok: false; error: ParseError };

export interface CsvRecord {
  line: number; // physical line where the record starts, first line is 1
  cells: string[];
}

// ---- M2: Row trace ----

export type PeriodKind = 'week' | 'month';

export interface Period {
  start: string; // YYYY-MM-DD
  end: string; // YYYY-MM-DD, inclusive
}

export interface SourceInfo {
  fileSha256: string;
  rowsRead: number;
  rowsUsed: number;
  encoding: string;
  delimiter: string;
  droppedHeaders: string[];
}

export interface Params {
  asOf: string; // YYYY-MM-DD, the day the snapshot describes
  reportTz: string;
  weekStart: number; // ISO weekday, 1 is Monday
  newPeriod: PeriodKind;
  winPeriod: PeriodKind;
  minYear: number;
  maxYearAhead: number;
  minActiveDays: number;
  staleMultiple: number;
  darkMinRows: number;
  baselinePeriods: number;
  fieldPopMin: number;
  badDateMax: number;
  source?: SourceInfo;
}

export type ExclusionReason =
  | 'ragged_row'
  | 'duplicate_exact'
  | 'duplicate_conflict'
  | 'invalid_date'
  | 'impossible_date'
  | 'unmapped_stage'
  | 'blank_amount'
  | 'invalid_amount'
  | 'negative_amount';

export interface ExcludedRow {
  line: number;
  reason: ExclusionReason;
  label?: string;
}

export type HopKind = 'definition' | 'filter' | 'field_health' | 'source' | 'heartbeat';

export interface FieldHealth {
  field: string;
  inScope: number;
  blank: number;
  invalid: number;
}

export interface HeartbeatSummary {
  activeDays: number;
  usualGap: number | null; // 90th percentile, nearest rank
  staleThreshold: number | null; // defined only when activeDays >= minActiveDays
  newestModifiedDay: string | null;
  daysSinceNewest: number | null;
  modifiedAfterAsOf: boolean;
  stale: boolean;
}

export type Hop =
  | { kind: 'definition'; text: string; severity: number }
  | {
      kind: 'filter';
      matched: number;
      excluded: number;
      outOfScope: number;
      byReason: Record<string, number>;
      severity: number;
    }
  | { kind: 'field_health'; fields: FieldHealth[]; severity: number }
  | ({ kind: 'source'; asOf: string; reportTz: string; severity: number } & Partial<SourceInfo>)
  | ({ kind: 'heartbeat'; severity: number } & HeartbeatSummary);

export interface TraceCard {
  metricId: MetricId;
  currency: string;
  period: Period;
  valueMinor: number | null; // H1 and H2; null when not computable (every candidate amount blank or invalid)
  rate: { num: number; den: number } | null; // H3; null when undefined (no closed rows)
  valueIsZero: boolean;
  notComputable: boolean;
  includedLines: number[];
  includedCount: number;
  excluded: ExcludedRow[];
  outOfScope: number;
  byReason: Record<string, number>;
  hops: Hop[];
  weakest: { kind: HopKind; severity: number; sentence: string } | null;
  weakestSentence: string;
  // H3 secondary lines
  wonAmountMinor?: number;
  lostAmountMinor?: number;
  unmappedInPeriod?: { line: number; label: string }[];
}

// ---- M3: Zero check ----

export type Verdict = 'REAL' | 'BROKEN' | 'UNKNOWN';
export type ZeroMetric = MetricId | 'closed_count';
export type RuleId = 'Z1' | 'Z2' | 'Z2b' | 'Z3' | 'Z4' | 'Z5' | 'Z6' | 'Z7' | 'Z8';
export type ReasonCode =
  | 'unmapped_label'
  | 'field_went_blank'
  | 'field_never_populated'
  | 'dates_unusable'
  | 'export_stale'
  | 'no_last_modified'
  | 'insufficient_activity_history'
  | 'quiet_period'
  | 'no_wins_in_period'
  | 'no_evidence';

export interface ZeroContext {
  rows: NormalRow[]; // every parsed row, all currencies; the heartbeat is file wide
  params: Params;
  hasModifiedColumn: boolean;
}

export interface UnmappedLabel {
  label: string;
  count: number;
  lines: number[]; // sample, at most 10
  firstSeen: string;
  lastSeen: string;
}

export interface ZeroEvidence {
  activeDays: number;
  usualGap: number | null;
  staleThreshold: number | null;
  daysSinceNewest: number | null;
  modifiedDaysInPeriod: number; // distinct days with a modified row in the latest complete period
  baselineChecked: number; // how many baseline periods were looked at
  producedPeriods: number; // baseline periods in which the metric's event happened
  fieldPopulated: { num: number; den: number } | null; // baseline rows with the field filled; null when the metric needs no field
  darkRows: number; // in period rows whose amount is blank or unreadable
  badDates: { num: number; den: number };
  unmapped: UnmappedLabel[];
  lastWonDay: string | null;
}

export interface ZeroVerdict {
  metricId: ZeroMetric;
  currency: string;
  period: Period;
  verdict: Verdict;
  rule: RuleId;
  reason: ReasonCode;
  line: string; // the plain evidence line, a fixed template filled with numbers from the file
  note?: string;
  warnings: string[];
  evidence: ZeroEvidence;
  params: Record<string, number>; // the parameters that mattered for this rule
}
