export interface OperatorProfile {
  operator_id: string;
  operator_display_name: string;
  domain: string;
  voice_notes: string;
  data_sources: string[];
  sensitive_classes: string[];
  gated_actions: string[];
  kpis: string[];
  digest_schedule: string;
}

export type ModelTier = 'haiku' | 'sonnet' | 'opus';

export interface T0Result {
  allowed: boolean;
  sensitive_class?: string;
  scripted_reply?: string;
}

export interface ConciergeMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ConciergeRequest {
  operator_id: string;
  message: string;
  history: ConciergeMessage[];
  request_digest?: boolean;
}

export interface ProposalAction {
  action_type: string;
  description: string;
  payload: Record<string, unknown>;
  proposed_at: string;
}

export interface ConciergeResponse {
  response: string;
  model_tier: ModelTier;
  is_proposal: boolean;
  proposal?: ProposalAction;
  digest?: DigestBrief;
  t0_blocked?: boolean;
}

export interface DigestItem {
  type: 'order' | 'alert' | 'nudge' | 'kpi';
  priority: 'high' | 'medium' | 'low';
  message: string;
  action_label?: string;
}

export interface DigestBrief {
  generated_at: string;
  operator_name: string;
  new_orders: number;
  revenue_today: number;
  revenue_month: number;
  target_month: number;
  pct_to_target: number;
  stuck_orders: number;
  list_size?: number;
  items: DigestItem[];
  narrative: string;
}

// Phase 1 — Approval Queue types (stubbed in Phase 0, wired in Phase 1)
export interface ApprovalRecord {
  id: string;
  proposed_action: string;
  proposed_by: 'concierge';
  payload: Record<string, unknown>;
  status: 'pending' | 'approved' | 'rejected';
  approver?: string;
  approved_at?: string;
  executed_at?: string;
  result?: string;
  created_at: string;
}

export interface ShopifyOrder {
  id: string;
  order_number: number;
  created_at: string;
  financial_status: string;
  fulfillment_status: string | null;
  total_price: string;
  line_items: Array<{
    name: string;
    quantity: number;
    price: string;
  }>;
  shipping_address?: {
    city?: string;
    province?: string;
  };
}

export interface ShopifySummary {
  orders: ShopifyOrder[];
  unfulfilled: ShopifyOrder[];
  revenue_today: number;
  revenue_7day: number;
  revenue_month: number;
  order_count_today: number;
  order_count_7day: number;
  order_count_month: number;
  is_mock: boolean;
}
