/**
 * Approval Queue — Phase 1 stub
 *
 * Phase 0: Types are defined. Queue exists in memory. Nothing is ever proposed
 * because Phase 0 is read-only. This module is the foundation Phase 1 builds on.
 *
 * Phase 1: Wire draft-for-approval — customer replies, captions, restock notes.
 * Phase 2: Wire gated writes — Stahls orders, Shopify fulfillment updates.
 *
 * Invariant (never changes): the concierge produces a proposal, a human approves,
 * the app executes, the app logs it. The model never executes directly.
 */

import type { ApprovalRecord } from './types';
import { randomUUID } from 'crypto';

// In-memory store — replace with DB in Phase 1
const queue: ApprovalRecord[] = [];

export function createProposal(
  proposed_action: string,
  payload: Record<string, unknown>,
): ApprovalRecord {
  const record: ApprovalRecord = {
    id: randomUUID(),
    proposed_action,
    proposed_by: 'concierge',
    payload,
    status: 'pending',
    created_at: new Date().toISOString(),
  };
  queue.push(record);
  return record;
}

export function approveProposal(id: string, approver: string): ApprovalRecord | null {
  const record = queue.find((r) => r.id === id);
  if (!record || record.status !== 'pending') return null;
  record.status = 'approved';
  record.approver = approver;
  record.approved_at = new Date().toISOString();
  return record;
}

export function recordExecution(
  id: string,
  result: string,
): ApprovalRecord | null {
  const record = queue.find((r) => r.id === id);
  if (!record || record.status !== 'approved') return null;
  record.executed_at = new Date().toISOString();
  record.result = result;
  return record;
}

export function getPendingProposals(): ApprovalRecord[] {
  return queue.filter((r) => r.status === 'pending');
}

export function getProposal(id: string): ApprovalRecord | undefined {
  return queue.find((r) => r.id === id);
}

// Gated actions that require approval — from the operator profile config
export const GATED_ACTIONS_RENEE = [
  'store_live',
  'connect_domain',
  'broadcast',
  'refund',
  'price_change',
] as const;

export type GatedAction = (typeof GATED_ACTIONS_RENEE)[number];

export function isGatedAction(action: string): action is GatedAction {
  return GATED_ACTIONS_RENEE.includes(action as GatedAction);
}
