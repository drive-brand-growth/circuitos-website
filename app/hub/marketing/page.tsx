import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Marketing — MetroFlex Operator Hub',
  robots: { index: false, follow: false },
};

const CONTENT_PILLARS = [
  {
    title: 'Heritage',
    description: 'EST. 1987. The gyms, the legends, the culture. MetroFlex has a story most brands would kill for — use it.',
    examples: [
      'Throwback photos from the original Arlington gym',
      '"This is where Branch Warren trained" posts',
      'The MetroFlex story — founded 1987, still running iron',
    ],
    frequency: '2x / week',
    color: 'border-red-900/50 bg-red-950/20',
    labelColor: 'text-red-400',
  },
  {
    title: 'Community',
    description: 'Founders, members, athletes. People wearing the gear. Real humans, not studio shots.',
    examples: [
      'Customer photos in the tee — ask for UGC in every order email',
      'Gym floor photos from any MetroFlex location',
      'Competition day shots — athletes repping MetroFlex Apparel',
    ],
    frequency: '3x / week',
    color: 'border-amber-900/50 bg-amber-950/20',
    labelColor: 'text-amber-400',
  },
  {
    title: 'Product',
    description: 'Clean, confident product shots. The gear speaks for itself — don\'t over-caption.',
    examples: [
      'Flat lay of the tee on black background',
      'Close-up of the MF emblem detail',
      'Sizing story — "fits how it should"',
    ],
    frequency: '2x / week',
    color: 'border-blue-900/50 bg-blue-950/20',
    labelColor: 'text-blue-400',
  },
  {
    title: 'Behind the scenes',
    description: 'Running the brand. Packing orders, the production process, the people behind it.',
    examples: [
      'Order packed and ready to ship',
      'The "this is what we\'re building" founder post',
      'New drop teaser — just a corner of the design',
    ],
    frequency: '1x / week',
    color: 'border-emerald-900/50 bg-emerald-950/20',
    labelColor: 'text-emerald-400',
  },
];

const LIST_GROWTH = [
  {
    action: 'QR code at every MetroFlex gym location',
    lever: 'Biggest lever',
    detail: 'Every person who walks through those doors is already bought in on the brand. A QR on the desk, the wall, the water fountain. Direct to a "founder early access" list.',
  },
  {
    action: 'Every content post ends with a list CTA',
    lever: 'Compound daily',
    detail: '"Get first access to new drops — link in bio." Simple, consistent, every single post.',
  },
  {
    action: 'Order confirmation email includes a referral ask',
    lever: 'High conversion',
    detail: 'Someone just bought. They\'re the most likely person to tell a friend. "Know someone who trains? Forward this." Build this into the GHL post-purchase sequence.',
  },
  {
    action: 'Competition day presence',
    lever: 'Qualified audience',
    detail: 'Every NPC event Brian runs is a room full of people who train hard and care about gear. A simple "join the list, get first access" moment at the event.',
  },
  {
    action: 'Collab with Texas-based fitness accounts',
    lever: 'Reach expansion',
    detail: 'Not influencer marketing — peer collaboration. Other gym owners, coaches, athletes who have an audience that looks exactly like yours.',
  },
];

const WEEKLY_RHYTHM = [
  { day: 'Mon', type: 'Heritage', note: 'Start the week grounded in the brand story' },
  { day: 'Tue', type: 'Community', note: 'Customer/member photo or repost' },
  { day: 'Wed', type: 'Product', note: 'Clean product shot, minimal caption' },
  { day: 'Thu', type: 'Community', note: 'Training content, gym culture' },
  { day: 'Fri', type: 'Behind the scenes', note: 'End-of-week founder energy' },
  { day: 'Sat', type: 'Heritage or Community', note: 'Weekend audience — go for reach' },
  { day: 'Sun', type: 'Rest or repost', note: 'Optional — repurpose best of the week' },
];

export default function MarketingPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-lg font-semibold text-white">Marketing</h1>
        <p className="text-sm text-zinc-500 mt-0.5">
          Content strategy and list growth for MetroFlex Apparel. The model runs on a 2,500-person list — this is how you build it.
        </p>
      </div>

      {/* The number that matters */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="text-xs text-zinc-500 font-mono mb-1">THE TARGET</div>
        <div className="text-2xl font-semibold text-white mb-1">2,500 founders on the list</div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          The financial model shows 2,500 engaged subscribers ≈ $20k/month by month 11. Every piece of content, every gym QR, every order email is a path to this number. The concierge will nudge you when you're off pace.
        </p>
      </div>

      {/* Weekly posting rhythm */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Weekly Rhythm</h2>
        <div className="grid grid-cols-7 gap-1">
          {WEEKLY_RHYTHM.map((d) => (
            <div key={d.day} className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-center">
              <div className="text-xs font-bold text-zinc-500 mb-1">{d.day}</div>
              <div className="text-[10px] text-white font-medium leading-tight">{d.type}</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-zinc-600 mt-2">7 posts/week is the target. Miss a day — not a crisis. Miss a week — ask the concierge to help you catch up.</p>
      </div>

      {/* Content pillars */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">Content Pillars</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {CONTENT_PILLARS.map((pillar) => (
            <div key={pillar.title} className={`border rounded-xl p-4 ${pillar.color}`}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-white">{pillar.title}</h3>
                <span className={`text-xs font-medium ${pillar.labelColor}`}>{pillar.frequency}</span>
              </div>
              <p className="text-xs text-zinc-400 mb-3 leading-relaxed">{pillar.description}</p>
              <ul className="space-y-1">
                {pillar.examples.map((ex, i) => (
                  <li key={i} className="text-xs text-zinc-500 flex items-start gap-1.5">
                    <span className="text-zinc-700 flex-shrink-0">·</span>
                    {ex}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* List growth tactics */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">List Growth — Ranked by Impact</h2>
        <div className="space-y-2">
          {LIST_GROWTH.map((item, i) => (
            <div key={i} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
              <div className="flex items-start justify-between gap-3 mb-1">
                <h3 className="text-sm font-medium text-white leading-snug">{item.action}</h3>
                <span className="text-xs text-zinc-500 flex-shrink-0 bg-zinc-800 px-2 py-0.5 rounded-full whitespace-nowrap">{item.lever}</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Caption help CTA */}
      <div className="bg-red-950/30 border border-red-900/40 rounded-xl p-5">
        <div className="text-sm font-semibold text-white mb-1">Need a caption? Ask the concierge.</div>
        <p className="text-xs text-zinc-400 mb-3 leading-relaxed">
          "Draft an Instagram caption for a heritage tee product shot" — it writes it in the MetroFlex voice, you approve or edit, then post. Never a blank cursor.
        </p>
        <Link
          href="/hub/assistant"
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Open Concierge →
        </Link>
      </div>

      <p className="text-xs text-zinc-700 text-center pb-4">
        MetroFlex Operator Hub · Marketing playbook
      </p>
    </div>
  );
}
