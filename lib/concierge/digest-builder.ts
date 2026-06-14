/**
 * "Today for you" Digest Builder
 *
 * Assembles a plain-English brief from available data sources.
 * Never shows raw data, field names, or API responses to the operator.
 * The narrative is the primary output — the structured items are for the UI.
 */

import { getOrderSummary, formatCurrency } from './shopify-client';
import type { DigestBrief, DigestItem, OperatorProfile } from './types';

const MONTHLY_TARGET = 20_000;

export async function buildDigest(profile: OperatorProfile): Promise<DigestBrief> {
  const now = new Date();

  let shopifyData;
  try {
    shopifyData = await getOrderSummary();
  } catch {
    shopifyData = null;
  }

  const items: DigestItem[] = [];

  // --- Orders layer ---
  if (shopifyData) {
    if (shopifyData.order_count_today > 0) {
      items.push({
        type: 'order',
        priority: 'high',
        message: `${shopifyData.order_count_today} new ${shopifyData.order_count_today === 1 ? 'order' : 'orders'} today — ${formatCurrency(shopifyData.revenue_today)}`,
      });
    }

    if (shopifyData.unfulfilled.length > 0) {
      const oldest = shopifyData.unfulfilled.reduce((a, b) =>
        new Date(a.created_at) < new Date(b.created_at) ? a : b,
      );
      const hoursOld = Math.floor(
        (Date.now() - new Date(oldest.created_at).getTime()) / (1000 * 60 * 60),
      );
      const label =
        shopifyData.unfulfilled.length === 1
          ? `1 order waiting to ship`
          : `${shopifyData.unfulfilled.length} orders waiting to ship`;
      const urgency = hoursOld > 24 ? 'high' : 'medium';
      const age = hoursOld < 24 ? `${hoursOld}h old` : `${Math.floor(hoursOld / 24)}d old`;
      items.push({
        type: 'alert',
        priority: urgency,
        message: `${label} — oldest is ${age}`,
        action_label: 'Review orders',
      });
    }
  }

  // --- KPI layer ---
  const revenue = shopifyData?.revenue_month ?? 0;
  const pctToTarget = Math.round((revenue / MONTHLY_TARGET) * 100);

  items.push({
    type: 'kpi',
    priority: pctToTarget < 30 ? 'medium' : 'low',
    message: `${formatCurrency(revenue)} this month — ${pctToTarget}% of the ${formatCurrency(MONTHLY_TARGET)} target`,
  });

  // Brian's royalty accrual (8%)
  const royalty = revenue * 0.08;
  if (royalty > 0) {
    items.push({
      type: 'kpi',
      priority: 'low',
      message: `Brian's royalty accrued: ${formatCurrency(royalty)}`,
    });
  }

  // --- Nudges — tied to three weekly moves ---
  if (!shopifyData || shopifyData.order_count_7day < 5) {
    items.push({
      type: 'nudge',
      priority: 'medium',
      message: 'Growing the list is the #1 lever right now — every content post and gym QR feeds it.',
      action_label: 'Draft a post',
    });
  }

  // --- Build narrative ---
  const narrative = buildNarrative(profile.operator_display_name, items, shopifyData);

  return {
    generated_at: now.toISOString(),
    operator_name: profile.operator_display_name,
    new_orders: shopifyData?.order_count_today ?? 0,
    revenue_today: shopifyData?.revenue_today ?? 0,
    revenue_month: revenue,
    target_month: MONTHLY_TARGET,
    pct_to_target: pctToTarget,
    stuck_orders: shopifyData?.unfulfilled.length ?? 0,
    items,
    narrative,
  };
}

function buildNarrative(
  name: string,
  items: DigestItem[],
  shopify: Awaited<ReturnType<typeof getOrderSummary>> | null,
): string {
  const parts: string[] = [];

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  parts.push(`${greeting}, ${name}.`);

  if (!shopify) {
    parts.push("I can't reach Shopify right now — I'll keep trying. Here's what I have from the hub.");
  } else if (shopify.is_mock) {
    parts.push('Shopify credentials aren\'t wired yet — showing sample data so the layout is ready.');
  } else {
    // Orders today
    if (shopify.order_count_today === 0) {
      parts.push('No new orders today yet.');
    } else {
      parts.push(
        `You have ${shopify.order_count_today} new ${shopify.order_count_today === 1 ? 'order' : 'orders'} today — ${formatCurrency(shopify.revenue_today)}.`,
      );
    }

    // Stuck
    if (shopify.unfulfilled.length > 0) {
      const n = shopify.unfulfilled.length;
      parts.push(
        `${n} ${n === 1 ? 'order needs' : 'orders need'} to ship — the oldest has been waiting a while.`,
      );
    }
  }

  // Revenue vs target
  const revenue = shopify?.revenue_month ?? 0;
  const pct = Math.round((revenue / 20_000) * 100);
  if (pct === 0) {
    parts.push(`Month is just starting — ${formatCurrency(20_000)} to go.`);
  } else if (pct < 25) {
    parts.push(`You're ${pct}% to the $20k target this month — early days, keep the list growing.`);
  } else if (pct < 75) {
    parts.push(`You're at ${pct}% of the $20k target — solid pace.`);
  } else {
    parts.push(`You're at ${pct}% of the $20k target — good position.`);
  }

  // Call to action
  const highPriority = items.filter((i) => i.priority === 'high');
  if (highPriority.length > 0) {
    parts.push(`What needs you most: ${highPriority[0].message.toLowerCase()}.`);
  } else {
    parts.push('Nothing urgent — ask me anything about orders, the store, or what to post next.');
  }

  return parts.join(' ');
}
