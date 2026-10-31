import type { LogicalField, Mapping } from './types';

// Aliases are data. Each one comes from SPEC 3.2 or from a fixture header shape and is TO VERIFY with a real export.
export const ALIASES: Record<LogicalField, string[]> = {
  record_id: ['record id', 'id', 'opportunity id', 'deal id', 'hs_object_id'],
  stage: ['deal stage', 'stage', 'stagename', 'status', 'dealstage'],
  amount: ['amount', 'deal amount', 'value', 'deal value', 'opportunity amount'],
  created_date: ['create date', 'created date', 'createdate', 'created', 'started', 'date created', 'created at'],
  close_date: ['close date', 'closedate', 'expected close', 'expected close date', 'closed date'],
  last_modified_date: ['last modified date', 'lastmodifieddate', 'hs_lastmodifieddate', 'updated', 'last updated', 'modified', 'last modified', 'last modified at'],
  owner: ['deal owner', 'opportunity owner', 'ownerid', 'hubspot_owner_id', 'owner', 'rep', 'sales rep'],
  currency: ['currency', 'currencyisocode', 'amount currency', 'deal currency code', 'deal_currency_code'],
  is_closed: ['is closed', 'isclosed'],
  is_won: ['is won', 'iswon'],
};

// Case insensitive, trimmed, punctuation and spacing collapsed away.
export function squish(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]+/g, '');
}

// Header spacing normalized but words kept; used for the duplicate header check.
export function normalizeHeader(header: string): string {
  return header.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

const ORDER: LogicalField[] = ['record_id', 'stage', 'amount', 'created_date', 'close_date', 'last_modified_date', 'owner', 'currency', 'is_closed', 'is_won'];

export function suggestMapping(headers: string[]): Mapping {
  const mapping: Mapping = {};
  const used = new Set<number>();
  const squished = headers.map(squish);
  for (const field of ORDER) {
    for (const alias of ALIASES[field]) {
      const target = squish(alias);
      const idx = squished.findIndex((h, i) => !used.has(i) && h === target);
      if (idx >= 0) {
        mapping[field] = headers[idx];
        used.add(idx);
        break;
      }
    }
  }
  return mapping;
}
