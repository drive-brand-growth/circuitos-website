import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'MetroFlex Operator Hub',
  robots: { index: false, follow: false },
};

const SYSTEM_LAYERS = [
  { layer: 'Storefront preview', what: 'Password-gated comp — final look before Shopify push', status: 'live', statusColor: 'text-green-400' },
  { layer: 'Shopify', what: 'Catalog, checkout, money — system of record', status: 'staged, password ON', statusColor: 'text-amber-400' },
  { layer: 'GHL', what: 'List, sequences, tags, attribution', status: 'kit ready, build pending', statusColor: 'text-zinc-400' },
  { layer: 'Notify spine', what: 'Order → HMAC-verified hub → phone/email pings', status: 'live', statusColor: 'text-green-400' },
  { layer: 'T0 chat gate', what: 'Refund/discount/sourcing questions never reach the AI — scripted + human handoff', status: 'live', statusColor: 'text-green-400' },
  { layer: 'Concierge', what: 'Order briefs · plain answers · drafts for approval', status: 'live (Phase 0)', statusColor: 'text-green-400' },
  { layer: 'QuickBooks', what: 'Books, royalty accrual', status: 'playbook ready', statusColor: 'text-zinc-400' },
];

const THREE_MOVES = [
  {
    num: '1',
    title: 'Unlock automation',
    body: 'Checklist Step 0: add the two GHL API scopes (5 min) → Claude builds all 27 fields + 33 tags for you.',
  },
  {
    num: '2',
    title: 'The big block',
    body: 'Build the 9 GHL workflows (~6 hrs, click-by-click kit) + wire 6 Shopify webhooks (~30 min).',
  },
  {
    num: '3',
    title: 'Grow the list',
    body: 'The model\'s #1 lever: 2,500 founders ≈ $20k by month 11. Every content post and gym QR feeds it.',
  },
];

function KpiCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
      <div className="text-xs text-zinc-500 mb-1">{label}</div>
      <div className="text-xl font-semibold text-white">{value}</div>
      {sub && <div className="text-xs text-zinc-600 mt-0.5">{sub}</div>}
    </div>
  );
}

export default function HubDashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-xs text-zinc-500 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          SYSTEMS OPERATIONAL
        </div>
        <h1 className="text-2xl font-semibold text-white">Business in a Box — MetroFlex Apparel</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Two operators, multiple businesses, one brand engine. Target raised 2026-06-10: $20k/month (stretch $50k). Runs on CircuitOS Pro.
        </p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <KpiCard label="Monthly Target" value="$20,000" sub="311 orders · 10.4/day · 482 tees + 87 caps" />
        <KpiCard label="Stretch" value="$50,000" sub="776 orders · 25.9/day · month ~19–25 (model)" />
        <KpiCard label="Brian's Royalty (8%)" value="$1,600 /mo" sub="accrues monthly · $4,000 @50k" />
      </div>

      {/* Three Moves */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">This Week's Three Moves</h2>
        <div className="space-y-3">
          {THREE_MOVES.map((move) => (
            <div key={move.num} className="flex gap-4 bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
              <div className="w-7 h-7 bg-red-600/20 border border-red-600/30 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-red-400 font-bold text-xs">{move.num}</span>
              </div>
              <div>
                <div className="text-sm font-medium text-white mb-0.5">{move.title}</div>
                <div className="text-sm text-zinc-500">{move.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System table */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">The System</h2>
        <div className="border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="text-left px-4 py-2.5 text-xs text-zinc-500 font-medium">Layer</th>
                <th className="text-left px-4 py-2.5 text-xs text-zinc-500 font-medium hidden md:table-cell">What it does</th>
                <th className="text-left px-4 py-2.5 text-xs text-zinc-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {SYSTEM_LAYERS.map((row, i) => (
                <tr key={row.layer} className={`border-b border-zinc-800/50 ${i === SYSTEM_LAYERS.length - 1 ? 'border-b-0' : ''}`}>
                  <td className="px-4 py-3 text-zinc-300 font-medium whitespace-nowrap">{row.layer}</td>
                  <td className="px-4 py-3 text-zinc-500 hidden md:table-cell leading-snug">{row.what}</td>
                  <td className={`px-4 py-3 whitespace-nowrap font-medium ${row.statusColor}`}>{row.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Standing gates */}
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-4">
        <p className="text-xs text-zinc-500 leading-relaxed">
          🔒 <strong className="text-zinc-400">Standing gates:</strong> STORE_LIVE stays false · Shopify password stays ON · no domain connection · no broadcasts — until Noel's explicit written go.
        </p>
      </div>

      {/* CTA to concierge */}
      <div className="bg-red-950/30 border border-red-900/40 rounded-xl p-5 flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-white mb-1">Concierge is live</div>
          <div className="text-xs text-zinc-400">Your brief is ready — orders, KPIs, and what needs you today.</div>
        </div>
        <Link
          href="/hub/assistant"
          className="flex-shrink-0 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Open →
        </Link>
      </div>

      <p className="text-xs text-zinc-700 text-center">
        MetroFlex Operator Hub · EST. 1987 · updated 2026-06-14 · casual passphrase gate only — don't paste truly sensitive credentials here
      </p>
    </div>
  );
}
