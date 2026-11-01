// Every user facing word lives here, so a rename is a one file change plus snapshot updates.
// Canon terms (approved by Noel, Oct 31, 2026): Signal Tracing, Live Zero, The Circuit Method.
// The Circuit Method is for report and doc level text only, never for a single card or sentence.

export const LABELS = {
  canon: {
    signalTracing: 'Signal Tracing',
    liveZero: 'Live Zero',
    circuitMethod: 'The Circuit Method',
  },
  errors: {
    file_empty: 'The file is empty.',
    no_data_rows: 'The file has a header row but no data rows.',
    zip_unsupported: 'This is a zip file. Unzip it first, then choose the CSV inside.',
    not_csv: 'This looks like a spreadsheet file, not a CSV. Save it as CSV and try again.',
    file_too_large: 'The file is larger than the size limit.',
    too_many_rows: 'The file has more rows than the row limit.',
    too_many_ragged_rows: 'More than one tenth of the rows have a different number of cells than the header.',
    duplicate_header: 'Two columns have the same name once spacing and capitals are ignored.',
    missing_required_column: 'A required column could not be found. Required: stage, amount, created date, close date.',
    pii_in_kept_column: 'A column the audit needs seems to hold personal data. Remove it and try again.',
    date_order_ambiguous: 'The day and month order of a date column cannot be told from the file. Choose it.',
    date_order_conflict: 'A date column mixes day first and month first dates.',
    invalid_report_tz: 'The time zone name is not recognized.',
    missing_hmac_key: 'The caller must pass a session key for hashing.',
    internal_error: 'The file could not be read.',
  },
  verdict: { REAL: 'REAL', BROKEN: 'BROKEN', UNKNOWN: 'UNKNOWN' },
  // A REAL verdict is a Live Zero.
  verdictNote: { REAL: 'Live Zero', BROKEN: 'Broken zero', UNKNOWN: 'Unknown zero' },
  metrics: {
    H1: { name: 'Open pipeline', definition: 'Sum of amount over rows that are open as of {asOf}.' },
    H2: { name: 'New pipeline created in the latest period', definition: 'Sum of amount over rows created from {start} to {end}, whatever their stage today.' },
    H3: { name: 'Win rate for the latest closed period', definition: 'Won rows divided by won plus lost rows, over rows whose close day is from {start} to {end}.' },
  },
  hops: {
    definition: 'Definition',
    filter: 'Filter',
    field_health: 'Field health',
    source: 'Source',
    heartbeat: 'Heartbeat',
  },
  reasons: {
    ragged_row: 'row has a different number of cells than the header',
    duplicate_exact: 'exact copy of another row',
    duplicate_conflict: 'same id as a row with a later change',
    invalid_date: 'a date this number needs is blank or unreadable',
    impossible_date: 'a date that cannot be right',
    unmapped_stage: 'stage label not known as open, won or lost',
    blank_amount: 'amount is blank',
    invalid_amount: 'amount is unreadable',
    negative_amount: 'amount is negative',
  },
  trace: {
    title: 'Signal Tracing',
    intro: 'Signal Tracing ties each headline number to the rows behind it.',
    noWeakHop: 'No weak hop found in this file.',
    weakFilter: '{excluded} of {total} rows in scope were left out of this number. Most common reason: {reason}.',
    weakFieldHealth: 'The {field} field is blank or unreadable on {bad} of {rows} rows in scope.',
    weakHeartbeat: 'The newest change in this file is {days} days before the as of date. The usual gap between active days is {gap} days, so the stale threshold is {threshold} days.',
    notComputable: 'Not computable: every amount that could count is blank or unreadable.',
    undefinedRate: 'No closed deals in this period.',
  },
  months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  // Zero check sentences. Fixed templates; every number in them comes from the file.
  zero: {
    title: 'Live Zero check',
    liveZeroDefinition: 'A Live Zero is a zero confirmed real by positive evidence from the file.',
    subject: {
      H1: 'Zero open pipeline as of {asOf}.',
      H2: 'Zero new pipeline in the {unit} of {range}.',
      H3: 'Zero wins among {den} closed deals in the {unit} of {range}.',
      closed_count: 'Zero closed deals in the {unit} of {range}.',
    },
    modifiedSame: 'Rows were modified on {days} days in that {unit}.',
    modifiedLatest: 'Rows were modified on {days} days in the latest complete {unit}, {range}.',
    usualGap: 'The usual gap between active days in this file is {gap} days.',
    produced: {
      H1: 'Open rows existed in {k} of the {n} {unit}s before.',
      H2: 'Rows were created in {k} of the {n} {unit}s before.',
      H3: 'Deals were won in {k} of the {n} {unit}s before.',
      closed_count: 'Deals closed in {k} of the {n} {unit}s before.',
    },
    stale: 'The newest row was modified {days} days before the as of date. The usual gap between active days is {gap} days, so the stale threshold is {threshold} days.',
    unmapped: 'The stage label "{label}" is on {count} {rows} in scope (lines {lines}) and the audit could not place it as open, won or lost.',
    lastWon: 'The newest row with a won label closed on {day}.',
    datesUnusable: 'In scope for this number, {bad} of {den} rows have a date that is blank, unreadable or impossible.',
    fieldWentBlank: 'The amount is blank or unreadable on all {dark} rows that could count. In the {unit}s before, it was filled on {num} of {den} rows.',
    fieldNeverPopulated: 'The amount is blank or unreadable on all {dark} rows that could count. In the {unit}s before, it was filled on {num} of {den} rows, so there is no earlier sign that it was in use.',
    noLastModified: 'The file has no last modified column, so the audit cannot tell whether the export is current.',
    fewActiveDays: 'The file shows {days} active days. At least {min} are needed to judge whether a quiet period is real.',
    noEvidence: 'The file does not show enough to call this zero real or broken.',
    emptyOpenNote: 'An empty open pipeline is a fact worth a look.',
  },
} as const;

// Fills {name} slots in a fixed template with values taken from the file.
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_m, k: string) => (k in values ? String(values[k]) : `{${k}}`));
}
