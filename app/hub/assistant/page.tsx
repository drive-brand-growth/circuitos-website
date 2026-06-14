import type { Metadata } from 'next';
import ConciergeWidget from '@/components/hub/ConciergeWidget';

export const metadata: Metadata = {
  title: 'Concierge — MetroFlex Operator Hub',
  robots: { index: false, follow: false },
};

export default function AssistantPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-white">Concierge</h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          Your daily brief and business assistant. Reads orders, answers questions, drafts for you — always plain English.
        </p>
      </div>

      {/* Full-height chat panel */}
      <div
        className="rounded-2xl border border-zinc-800 overflow-hidden"
        style={{ height: 'calc(100vh - 200px)', minHeight: '520px' }}
      >
        <ConciergeWidget operatorId="renee_apparel" />
      </div>

      {/* Context note */}
      <div className="mt-3 px-1">
        <p className="text-xs text-zinc-600 leading-relaxed">
          The concierge sees your Shopify orders, GHL list, and hub state. It reads only — nothing sends or changes without your approval.
          Questions about refunds, discounts, or sourcing go to <a href="mailto:brian@metroflexgym.com" className="text-zinc-500 hover:text-zinc-400 transition-colors">brian@metroflexgym.com</a>.
        </p>
      </div>
    </div>
  );
}
