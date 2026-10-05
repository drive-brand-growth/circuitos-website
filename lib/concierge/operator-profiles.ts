import type { OperatorProfile } from './types';

export const OPERATOR_PROFILES: Record<string, OperatorProfile> = {
  renee_apparel: {
    operator_id: 'renee_apparel',
    operator_display_name: 'Renee',
    domain: 'MetroFlex Apparel',
    voice_notes: 'warm, plainspoken, MetroFlex heritage, no hype. Christian values inform tone. Direct, never corporate.',
    data_sources: ['shopify', 'ghl', 'notify_spine', 'hub_state'],
    sensitive_classes: [
      'refund',
      'discount',
      'sourcing',
      'price_change',
      'money_out',
      'credentials',
      'legal',
    ],
    gated_actions: [
      'store_live',
      'connect_domain',
      'broadcast',
      'refund',
      'price_change',
    ],
    kpis: ['$20k/mo target', 'orders/day', 'list size'],
    digest_schedule: 'on_open + daily 8am',
  },

  // Stub — not built yet. Profile validates the engine is swappable.
  brian_events: {
    operator_id: 'brian_events',
    operator_display_name: 'Brian',
    domain: 'MetroFlex Events (NPC shows, co-promoted with Branch Warren)',
    voice_notes: 'founder voice, direct, no clutter, surface the few things that matter',
    data_sources: [],
    sensitive_classes: ['athlete_payout', 'sponsor_contract', 'venue_money'],
    gated_actions: ['send_to_athlete_list', 'publish_schedule', 'confirm_vendor'],
    kpis: ['registrations', 'sponsor_commits', 'days_to_show_readiness'],
    digest_schedule: 'on_open + weekly',
  },
};

export function getProfile(operator_id: string): OperatorProfile | null {
  return OPERATOR_PROFILES[operator_id] ?? null;
}
