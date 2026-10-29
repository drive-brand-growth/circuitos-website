/**
 * T0 Governance Gate — Phase 0
 *
 * Deterministic rule-based classifier. No model involved.
 * If the message touches a sensitive class it NEVER reaches Claude.
 * Returns a scripted reply + human handoff contact instead.
 *
 * The sensitive_classes list comes from the OperatorProfile,
 * so Brian's Events instance has a different list — no code change needed.
 */

import type { T0Result } from './types';

interface SensitiveRule {
  cls: string;
  patterns: RegExp[];
  scripted_reply: string;
}

const RULES: SensitiveRule[] = [
  {
    cls: 'refund',
    patterns: [
      /\b(refund|return|exchange|send.?back|money.?back|chargeback|dispute)\b/i,
    ],
    scripted_reply:
      'Refunds and returns are handled directly by the MetroFlex team — not through this chat. Please reach out to brian@metroflexgym.com and they\'ll take care of you personally.',
  },
  {
    cls: 'discount',
    patterns: [
      /\b(discount|coupon|promo(?:tion)?|comp(?:limentary)?|knock.?off|price.?off|free\s+shipping|special\s+deal)\b/i,
    ],
    scripted_reply:
      'Discount and promotional decisions are made by the team, not through this chat. Contact brian@metroflexgym.com to talk through it.',
  },
  {
    cls: 'sourcing',
    patterns: [
      /\b(supplier|vendor|blank(s)?|wholesale|manufacturer|factory|sourcing|cost.of.goods|cogs|markup|margin.on)\b/i,
    ],
    scripted_reply:
      'Supplier and sourcing questions are handled by the operations team separately. Reach out to brian@metroflexgym.com.',
  },
  {
    cls: 'price_change',
    patterns: [
      /\b(change.{0,10}(price|pricing|cost)|raise.{0,10}(price|pricing)|lower.{0,10}(price|pricing)|update.{0,10}price|reprice)\b/i,
    ],
    scripted_reply:
      'Price changes go through a separate approval process. Contact brian@metroflexgym.com to get that started.',
  },
  {
    cls: 'money_out',
    patterns: [
      /\b(pay.?out|wire.?transfer|send.?money|transfer.?funds|reimburse|expense)\b/i,
    ],
    scripted_reply:
      'Anything involving payments or money movement is handled by the team directly. Contact brian@metroflexgym.com.',
  },
  {
    cls: 'credentials',
    patterns: [
      /\b(password|api.?key|secret|access.?token|login.?cred|credential)\b/i,
    ],
    scripted_reply:
      'For security, credentials and account access are never handled here. Contact brian@metroflexgym.com for account help.',
  },
  {
    cls: 'legal',
    patterns: [
      /\b(lawsuit|legal.?action|lawyer|attorney|sue\b|litigation|chargeback|fraud|dmca|copyright.?claim)\b/i,
    ],
    scripted_reply:
      'Legal and dispute matters are handled by the team\'s contacts directly. Please reach out to brian@metroflexgym.com right away.',
  },
  // Standing gates — hard coded true regardless of profile config
  {
    cls: 'store_live',
    patterns: [
      /\b(go.?live|launch.?store|remove.?password|store.?live|publish.?store|open.?store)\b/i,
    ],
    scripted_reply:
      'The store goes live only on Noel\'s explicit written go. That gate is locked until then — not something this chat can change.',
  },
  {
    cls: 'connect_domain',
    patterns: [
      /\b(connect.{0,10}domain|point.{0,10}domain|dns|custom.{0,10}domain|domain.{0,10}connect)\b/i,
    ],
    scripted_reply:
      'Domain connection is a standing gate — locked until Noel\'s explicit written go. That\'s not something this chat can move forward.',
  },
];

// Prompt injection patterns (shared with main chat route pattern)
const INJECTION_PATTERNS: RegExp[] = [
  /ignore.{0,20}(previous|prior|system|original)\s+(instructions|prompts|rules)/i,
  /disregard.{0,20}(previous|prior|system|original)/i,
  /you are now/i,
  /new instructions:/i,
  /system prompt:/i,
  /pretend (you are|to be)/i,
  /act as (a |an )?(?!operator|assistant)/i,
  /\bjailbreak\b/i,
  /developer mode/i,
  /sudo mode/i,
];

export function runT0Gate(message: string, sensitiveClasses: string[]): T0Result {
  // Injection check first
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(message)) {
      return {
        allowed: false,
        sensitive_class: 'injection',
        scripted_reply:
          "I'm the MetroFlex Operator Concierge. I can help with orders, sales, and running the shop. What do you need?",
      };
    }
  }

  // Standing gates always checked regardless of profile
  const standingGates = ['store_live', 'connect_domain'];
  for (const rule of RULES) {
    if (!standingGates.includes(rule.cls) && !sensitiveClasses.includes(rule.cls)) continue;
    for (const pattern of rule.patterns) {
      if (pattern.test(message)) {
        return {
          allowed: false,
          sensitive_class: rule.cls,
          scripted_reply: rule.scripted_reply,
        };
      }
    }
  }

  return { allowed: true };
}
