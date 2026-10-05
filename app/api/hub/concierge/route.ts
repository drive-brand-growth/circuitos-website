/**
 * MetroFlex Operator Concierge API — Phase 0
 *
 * Request flow:
 *   operator message
 *     → [T0 GATE] deterministic classifier
 *         → sensitive: scripted reply, never reaches Claude
 *         → allowed: [MODEL TIER ROUTER] → Claude API → response
 *
 * Phase 0: Read-only. No proposals, no writes.
 * The approval queue types are stubbed and ready for Phase 1.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getProfile } from '@/lib/concierge/operator-profiles';
import { runT0Gate } from '@/lib/concierge/t0-gate';
import { routeModelTier, getModelId, MAX_TOKENS } from '@/lib/concierge/model-router';
import { buildSystemPrompt } from '@/lib/concierge/system-prompt';
import { buildDigest } from '@/lib/concierge/digest-builder';
import type { ConciergeMessage, ConciergeResponse, ModelTier } from '@/lib/concierge/types';

// Rate limiting — per operator_id, resets on cold start
const rateLimits = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 20;

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  entry.count++;
  return entry.count <= RATE_LIMIT_MAX;
}

function sanitizeText(text: string, maxLen = 2000): string {
  return text
    .trim()
    .slice(0, maxLen)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/[\u200B-\u200F\u2028-\u202F\uFEFF]/g, '');
}

function sanitizeHistory(raw: unknown): ConciergeMessage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (m): m is { role: string; content: string } =>
        m && typeof m === 'object' && 'role' in m && 'content' in m,
    )
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: sanitizeText(String(m.content), 800),
    }))
    .slice(-20);
}

async function callClaude(
  systemPrompt: string,
  messages: ConciergeMessage[],
  userMessage: string,
  tier: ModelTier,
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return "I can't reach the AI right now. Check back in a moment — or reach out to brian@metroflexgym.com if this keeps happening.";
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: getModelId(tier),
      max_tokens: MAX_TOKENS[tier],
      system: systemPrompt,
      messages: [
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage },
      ],
    }),
  });

  if (!res.ok) {
    console.error('[concierge] Claude API error', res.status, await res.text());
    return "Something's slow on my end right now. Try again in a moment.";
  }

  const data = await res.json();
  return (data.content?.[0]?.text as string | undefined) ?? "I didn't catch that — could you say it again?";
}

export async function POST(req: NextRequest): Promise<NextResponse<ConciergeResponse>> {
  try {
    const body = await req.json();
    const operator_id = typeof body?.operator_id === 'string' ? body.operator_id : 'renee_apparel';
    const rawMessage = body?.message;
    const rawHistory = body?.history;
    const requestDigest = body?.request_digest === true || !rawHistory?.length;

    // Rate limit by operator
    if (!checkRateLimit(operator_id)) {
      return NextResponse.json(
        {
          response: "Just a moment — you're sending messages quickly. Give it a minute and try again.",
          model_tier: 'haiku' as ModelTier,
          is_proposal: false,
          t0_blocked: false,
        },
        { status: 429 },
      );
    }

    // Load operator profile
    const profile = getProfile(operator_id);
    if (!profile) {
      return NextResponse.json(
        {
          response: "I couldn't find your operator profile. Contact support@metroflexgym.com.",
          model_tier: 'haiku' as ModelTier,
          is_proposal: false,
          t0_blocked: false,
        },
        { status: 400 },
      );
    }

    // Build digest — always on first open or explicit request
    let digest;
    if (requestDigest) {
      try {
        digest = await buildDigest(profile);
      } catch (err) {
        console.error('[concierge] digest build failed', err);
      }
    }

    // Digest-only request (initial page load)
    if (!rawMessage || typeof rawMessage !== 'string' || rawMessage.trim() === '') {
      return NextResponse.json({
        response: digest?.narrative ?? `Good to see you, ${profile.operator_display_name}. What's on your mind?`,
        model_tier: 'sonnet' as ModelTier,
        is_proposal: false,
        digest,
      });
    }

    const message = sanitizeText(rawMessage);
    if (!message) {
      return NextResponse.json({
        response: "Didn't catch that — try again.",
        model_tier: 'haiku' as ModelTier,
        is_proposal: false,
      });
    }

    // T0 Gate — deterministic, never reaches Claude if blocked
    const t0 = runT0Gate(message, profile.sensitive_classes);
    if (!t0.allowed) {
      return NextResponse.json({
        response: t0.scripted_reply!,
        model_tier: 'haiku' as ModelTier,
        is_proposal: false,
        t0_blocked: true,
      });
    }

    // Route to model tier
    const tier = routeModelTier(message);
    const history = sanitizeHistory(rawHistory);

    // Build system prompt with live digest context
    const systemPrompt = buildSystemPrompt(profile, digest);

    // Call Claude
    const response = await callClaude(systemPrompt, history, message, tier);

    return NextResponse.json({
      response,
      model_tier: tier,
      is_proposal: false,
      digest: requestDigest ? digest : undefined,
    });
  } catch (error) {
    console.error('[concierge] unhandled error', error);
    return NextResponse.json(
      {
        response: "Something went sideways on my end. Give it a moment and try again — or reach out to brian@metroflexgym.com if this keeps up.",
        model_tier: 'haiku' as ModelTier,
        is_proposal: false,
        t0_blocked: false,
      },
      { status: 500 },
    );
  }
}
