// Every user facing word lives here, so a rename is a one file change plus snapshot updates.
// These are working labels. Nothing here uses a canon term; those wait for approval.

export const LABELS = {
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
    noWeakHop: 'No weak hop found in this file.',
    weakFilter: '{excluded} of {total} rows in scope were left out of this number. Most common reason: {reason}.',
    weakFieldHealth: 'The {field} field is blank or unreadable on {bad} of {rows} rows in scope.',
    weakHeartbeat: 'The newest change in this file is {days} days before the as of date. The usual gap between active days is {gap} days, so the stale threshold is {threshold} days.',
    notComputable: 'Not computable: every amount that could count is blank or unreadable.',
    undefinedRate: 'No closed deals in this period.',
  },
} as const;

// Fills {name} slots in a fixed template with values taken from the file.
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_m, k: string) => (k in values ? String(values[k]) : `{${k}}`));
}
