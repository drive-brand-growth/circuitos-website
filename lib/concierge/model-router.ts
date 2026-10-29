/**
 * Model Tier Router
 *
 * Haiku  — T0 triage / fast classification (cheap, high volume)
 * Sonnet — Concierge responses, digests, drafts (daily driver)
 * Opus   — Hard reasoning on demand (anomaly analysis, strategy)
 *
 * Cost discipline: most turns are Sonnet.
 * Opus is invoked deliberately on specific signals, never by default.
 */

import type { ModelTier } from './types';

// Model identifiers — update here when Anthropic releases new versions
export const MODELS: Record<ModelTier, string> = {
  haiku: 'claude-haiku-4-5-20251001',
  sonnet: 'claude-sonnet-4-5-20251029',
  opus: 'claude-opus-4-5-20251029',
};

// Signals that justify Opus invocation
const OPUS_TRIGGERS: RegExp[] = [
  /\bwhy\s+(did|has|is|are|was|were)\b/i,
  /\banalyze\b/i,
  /\banalysis\b/i,
  /\bwhat.{0,20}(causing|driving|behind)\b/i,
  /\bstrategy\b/i,
  /\bforecast\b/i,
  /\bpredict\b/i,
  /\banomaly\b/i,
  /\bconversions?.{0,20}(drop|fell|lower|down)\b/i,
  /\bwhy.{0,20}(sales|orders|revenue).{0,20}(slow|down|drop|fell)\b/i,
  /\bbest.{0,20}(time|day|season).{0,20}(post|launch|run|send)\b/i,
  /\bgrowth\s+plan\b/i,
  /\bexplain.{0,20}(trend|pattern|result)\b/i,
];

export function routeModelTier(message: string): ModelTier {
  for (const pattern of OPUS_TRIGGERS) {
    if (pattern.test(message)) return 'opus';
  }
  return 'sonnet';
}

export function getModelId(tier: ModelTier): string {
  return MODELS[tier];
}

export const MAX_TOKENS: Record<ModelTier, number> = {
  haiku: 256,
  sonnet: 512,
  opus: 1024,
};
