'use client';

import type { Metadata } from 'next';
import { useState } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronRight, Clock, Zap } from 'lucide-react';

interface Step {
  id: string;
  number: string;
  title: string;
  time?: string;
  priority: 'now' | 'this-week' | 'soon';
  done: boolean;
  details: string[];
  note?: string;
}

const INITIAL_STEPS: Step[] = [
  {
    id: 'ghl-scopes',
    number: '0',
    title: 'Add the two GHL API scopes',
    time: '5 min',
    priority: 'now',
    done: false,
    details: [
      'Log into GoHighLevel → Settings → API → Connected Apps',
      'Find the CircuitOS connection and click Edit',
      'Enable: contacts.write and opportunities.write',
      'Save — that\'s it. Claude will build all 27 fields and 33 tags automatically.',
    ],
    note: 'Do this first. Everything else in automation is blocked until it\'s done.',
  },
  {
    id: 'ghl-custom-fields',
    number: '1',
    title: 'Build GHL custom fields and tags',
    time: '~15 min',
    priority: 'now',
    done: false,
    details: [
      'After Step 0, open the concierge and say: "Build my GHL fields and tags"',
      'The concierge will walk you through creating all 27 custom fields',
      'Then create the 33 tags from the provided list',
      'These fields track: order value, product type, size, repeat customer status, referral source',
    ],
    note: 'The concierge handles the click-by-click instructions. You don\'t need to know GHL deeply.',
  },
  {
    id: 'shopify-webhooks',
    number: '2',
    title: 'Wire 6 Shopify webhooks',
    time: '~30 min',
    priority: 'this-week',
    done: false,
    details: [
      'Shopify Admin → Settings → Notifications → Webhooks',
      'Create webhook: orders/create → your hub URL',
      'Create webhook: orders/fulfilled → your hub URL',
      'Create webhook: orders/paid → your hub URL',
      'Create webhook: orders/cancelled → your hub URL',
      'Create webhook: customers/create → your hub URL',
      'Create webhook: inventory_levels/update → your hub URL',
    ],
    note: 'The hub URL for webhooks is: [your-domain]/api/hub/notify — use HMAC verification (already built).',
  },
  {
    id: 'ghl-workflows',
    number: '3',
    title: 'Build the 9 GHL workflows',
    time: '~6 hrs',
    priority: 'this-week',
    done: false,
    details: [
      'Workflow 1: New order → tag contact, update custom fields',
      'Workflow 2: First-time buyer → welcome sequence (3 emails)',
      'Workflow 3: Repeat buyer → VIP tag + thank you',
      'Workflow 4: Order fulfilled → shipping notification',
      'Workflow 5: Order not fulfilled in 3 days → alert to hub',
      'Workflow 6: Cart abandon (if Shopify connected to GHL) → recovery sequence',
      'Workflow 7: List signup → welcome email + MetroFlex story',
      'Workflow 8: 30-day inactive → re-engagement',
      'Workflow 9: Monthly digest → top customers summary to you',
    ],
    note: 'Use the concierge for step-by-step help on each workflow. Ask: "Walk me through Workflow 1."',
  },
  {
    id: 'shopify-password',
    number: '4',
    title: 'Remove Shopify password (when Noel gives the go)',
    time: '2 min',
    priority: 'soon',
    done: false,
    details: [
      'Shopify Admin → Online Store → Preferences',
      'Scroll to "Password protection"',
      'Uncheck "Enable password" and Save',
      '⚠️ Do NOT do this until Noel gives explicit written approval.',
    ],
    note: 'Standing gate — locked. The concierge will not help you do this without Noel\'s written go.',
  },
  {
    id: 'domain',
    number: '5',
    title: 'Connect custom domain',
    time: '30 min',
    priority: 'soon',
    done: false,
    details: [
      'Shopify Admin → Online Store → Domains',
      'Click "Connect existing domain"',
      'Update DNS records at your registrar (Shopify provides the exact records)',
      'Wait for propagation (up to 48 hrs)',
      '⚠️ Do NOT do this until Noel gives explicit written approval.',
    ],
    note: 'Standing gate — locked. Same as above.',
  },
  {
    id: 'quickbooks',
    number: '6',
    title: 'Connect QuickBooks',
    time: '20 min',
    priority: 'soon',
    done: false,
    details: [
      'Set QUICKBOOKS_CLIENT_ID and QUICKBOOKS_CLIENT_SECRET in Vercel env vars',
      'Open the hub and go through the OAuth flow (button will appear once env vars are set)',
      'Authorize: read-only access to reports and balances',
      'Once connected, the concierge can read your balance and Brian\'s royalty accrual',
    ],
    note: 'Read-only in Phase 0. No writes. Just so the concierge can answer "what\'s our balance."',
  },
];

const PRIORITY_LABELS = {
  now: { label: 'Do now', color: 'text-red-400 bg-red-950/40 border-red-900/50' },
  'this-week': { label: 'This week', color: 'text-amber-400 bg-amber-950/40 border-amber-900/50' },
  soon: { label: 'Soon', color: 'text-zinc-400 bg-zinc-900/40 border-zinc-800' },
};

function StepRow({ step, onToggle }: { step: Step; onToggle: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const priority = PRIORITY_LABELS[step.priority];

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${step.done ? 'border-zinc-800 opacity-60' : 'border-zinc-800 hover:border-zinc-700'}`}>
      <div className="flex items-start gap-3 p-4">
        <button
          onClick={onToggle}
          className="mt-0.5 flex-shrink-0 text-zinc-500 hover:text-green-400 transition-colors"
        >
          {step.done ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-zinc-600 text-xs font-mono">Step {step.number}</span>
              <h3 className={`text-sm font-medium ${step.done ? 'line-through text-zinc-500' : 'text-white'}`}>
                {step.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {step.time && (
                <span className="flex items-center gap-1 text-xs text-zinc-500">
                  <Clock className="w-3 h-3" />
                  {step.time}
                </span>
              )}
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${priority.color}`}>
                {priority.label}
              </span>
            </div>
          </div>

          {step.note && (
            <p className="text-xs text-zinc-500 mt-1 leading-snug">{step.note}</p>
          )}
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-shrink-0 text-zinc-600 hover:text-zinc-400 transition-colors mt-0.5"
        >
          {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-zinc-800 bg-zinc-950/60 px-4 py-3">
          <ol className="space-y-1.5">
            {step.details.map((detail, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                <span className="text-zinc-600 text-xs mt-0.5 flex-shrink-0">{i + 1}.</span>
                <span className="leading-snug">{detail}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

export default function ChecklistPage() {
  const [steps, setSteps] = useState(INITIAL_STEPS);

  const toggle = (id: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, done: !s.done } : s)),
    );
  };

  const done = steps.filter((s) => s.done).length;
  const pct = Math.round((done / steps.length) * 100);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-lg font-semibold text-white">Launch Checklist</h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          Everything needed to get MetroFlex Apparel live and automated. Work top to bottom.
        </p>
      </div>

      {/* Progress */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-zinc-400">Progress</span>
          <span className="text-sm font-semibold text-white">{done} / {steps.length} done</span>
        </div>
        <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Automation note */}
      <div className="flex items-start gap-3 bg-zinc-900/40 border border-zinc-700/50 rounded-xl p-4">
        <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-white mb-0.5">Use the concierge for any step</p>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Open the <a href="/hub/assistant" className="text-red-400 hover:text-red-300 transition-colors">Assistant tab</a> and say "help me with Step 1" or "walk me through the GHL workflows." Plain English, step by step.
          </p>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step) => (
          <StepRow key={step.id} step={step} onToggle={() => toggle(step.id)} />
        ))}
      </div>

      <p className="text-xs text-zinc-700 text-center pb-4">
        Checklist state is stored in this browser tab only — not saved to a server yet.
      </p>
    </div>
  );
}
