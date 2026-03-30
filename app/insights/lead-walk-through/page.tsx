import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'A Lead Enters CircuitOS at 2:47 PM',
  description: 'In 4.2 seconds, 72 signals fire, a conviction score calculates, a governance gate evaluates, and an autonomous decision executes. Here\'s what it looks like.',
  openGraph: {
    title: 'A Lead Enters CircuitOS at 2:47 PM. Here\'s What Happened Next.',
    description: 'In 4.2 seconds, 72 signals fire, a conviction score calculates, and an autonomous decision executes.',
    url: 'https://usecircuitos.com/insights/lead-walk-through',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'A Lead Enters CircuitOS at 2:47 PM',
    description: 'In 4.2 seconds, 72 signals fire and an autonomous decision executes.',
  },
  alternates: { canonical: 'https://usecircuitos.com/insights/lead-walk-through' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'A Lead Enters CircuitOS at 2:47 PM. Here\'s What Happened Next.',
  description: 'In 4.2 seconds, 72 signals fire, a conviction score calculates, a governance gate evaluates, and an autonomous decision executes.',
  author: { '@type': 'Organization', name: 'CircuitOS', url: 'https://usecircuitos.com' },
  publisher: { '@type': 'Organization', name: 'CircuitOS', url: 'https://usecircuitos.com', logo: 'https://usecircuitos.com/circuitos-logo-full.svg' },
  datePublished: '2026-03-30',
  dateModified: '2026-03-30',
  mainEntityOfPage: 'https://usecircuitos.com/insights/lead-walk-through',
}

function TerminalBlock({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 md:my-8 rounded-xl overflow-hidden border border-[#27272a]">
      <div className="flex items-center gap-1.5 px-3 md:px-4 py-2 md:py-2.5 bg-[#18181b] border-b border-[#27272a]">
        <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#3f3f46]" />
        <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#3f3f46]" />
        <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#3f3f46]" />
        <span className="text-[9px] md:text-[10px] text-[#52525b] ml-2 font-mono">circuitos — decision-trail</span>
      </div>
      <div className="bg-[#09090b] p-3 md:p-5 font-mono text-[11px] md:text-sm leading-5 md:leading-7 overflow-x-auto">
        {children}
      </div>
    </div>
  )
}

export default function LeadWalkThrough() {
  return (
    <main className="min-h-screen grid-bg">
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm">
            <Link href="/insights" className="text-[#71717a] hover:text-blue-400 transition-colors">Insights</Link>
            <span className="text-[#3f3f46] mx-2">/</span>
            <span className="text-[#a1a1aa]">Product</span>
          </nav>

          {/* Header */}
          <div className="mb-12">
            <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
              Product
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-6 mb-6 tracking-[-0.02em] leading-tight">
              A Lead Enters CircuitOS at 2:47 PM. Here&apos;s What Happened Next.
            </h1>
            <p className="text-[#71717a] text-sm">March 2026 &middot; 5 min read</p>
          </div>

          {/* Body */}
          <div className="[&_p]:text-[#a1a1aa] [&_p]:leading-relaxed [&_p]:mb-5 [&_p]:text-sm [&_p]:md:text-base [&_h2]:text-white [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:md:mt-12 [&_h2]:mb-3 [&_h2]:md:mb-4">

            <p className="text-base md:text-lg text-white leading-relaxed">
              It is 2:47 PM on a Wednesday. A VP of Operations at a $22M professional services firm in Austin, Texas fills out a contact form on a client&apos;s website. She has twelve minutes before her next meeting. She will not remember this form by Thursday.
            </p>

            <p>
              CircuitOS will.
            </p>

            <h2>T+0.0s — Ingestion</h2>

            <p>
              The form submission hits the webhook. Name, email, company, city, state. The system assigns a pipeline ID and begins.
            </p>

            <TerminalBlock>
              <div className="text-[#71717a]">▸ Ingesting prospect: Austin, TX — B2B Professional Services</div>
              <div className="text-[#71717a]">  Pipeline: <span className="text-blue-400">PL-8a7f2c</span></div>
              <div className="text-[#71717a]">  Source: website_inquiry</div>
            </TerminalBlock>

            <h2>T+0.8s — Scoring</h2>

            <p>
              Seventy-two signals fire simultaneously. Not sequentially. The scoring engine evaluates five dimensions in parallel, each producing a likelihood ratio that updates the system&apos;s belief about whether this prospect will convert.
            </p>

            <TerminalBlock>
              <div className="text-white">▸ Scoring: <span className="text-blue-400">[████████░░]</span> 78.4 — <span className="text-blue-400">Tier B</span></div>
              <div className="text-[#71717a] mt-2">  Signals:</div>
              <div className="text-[#a1a1aa]">    revenue_fit ........... <span className="text-green-400">0.82</span> — Company size and budget indicators align</div>
              <div className="text-[#a1a1aa]">    decision_authority .... <span className="text-yellow-400">0.71</span> — VP-level, not final buyer but close</div>
              <div className="text-[#a1a1aa]">    market_density ........ <span className="text-green-400">0.89</span> — Austin market: high demand, low competition</div>
              <div className="text-[#a1a1aa]">    engagement ............ <span className="text-yellow-400">0.64</span> — First touch, no prior interactions</div>
              <div className="text-[#a1a1aa]">    enrichment ............ <span className="text-green-400">0.78</span> — LinkedIn confirmed, web presence strong</div>
              <div className="text-[#71717a] mt-2">  Conviction score: <span className="text-white font-bold">0.7840</span></div>
              <div className="text-[#71717a]">  Risk factors: <span className="text-yellow-400">First-time contact, single stakeholder</span></div>
            </TerminalBlock>

            <p>
              Revenue fit is high. She runs a firm that matches the ideal customer profile the system was calibrated against before it ever saw its first lead. Decision authority is moderate — she can champion internally but probably needs a co-signer. Market density is excellent. Austin has the demand and the competitive landscape is favorable.
            </p>

            <p>
              The conviction score lands at 78.4%. This is not a random number. It is a Bayesian posterior — a calibrated probability, updated from a prior belief using the evidence of every signal that fired. It means: given everything the system knows, there is a 78.4% chance this prospect belongs in the active pipeline.
            </p>

            <h2>T+1.2s — The Gate</h2>

            <p>
              This is where most AI systems would just act. Score calculated, email sent, done. CircuitOS does something different. It asks itself a question:
            </p>

            <p className="text-white text-lg font-medium italic">
              &quot;Am I confident enough to act alone?&quot;
            </p>

            <TerminalBlock>
              <div className="text-white">▸ Gate evaluation:</div>
              <div className="text-[#a1a1aa]">  Confidence: <span className="text-white">78.4%</span></div>
              <div className="text-[#a1a1aa]">  Threshold (Type 2 Autonomous): <span className="text-white">78.0%</span></div>
              <div className="text-[#a1a1aa]">  Risk class: <span className="text-blue-400">MEDIUM</span></div>
              <div className="text-green-400 mt-1">  Decision: <span className="font-bold">EXECUTE</span></div>
              <div className="text-[#71717a]">  Reason: confidence 78.4% exceeds autonomous threshold 78.0%</div>
            </TerminalBlock>

            <p>
              The conviction score of 78.4% exceeds the 78.0% threshold for Type 2 autonomous actions. The system has earned the right to proceed without human intervention. If the score had been 77.9%, the decision would have been ESCALATE — routed to a human with full context, the system&apos;s recommendation, and the evidence supporting it.
            </p>

            <p>
              The difference between autonomous execution and human escalation is 0.5 percentage points. That precision is not a limitation. It is the entire point.
            </p>

            <h2>T+2.1s — Routing</h2>

            <p>
              The decision engine evaluates routing rules. Tier B, medium risk, Austin market. Rule R-007 matches: auto-engage with an 8-hour SLA, high priority.
            </p>

            <TerminalBlock>
              <div className="text-white">▸ DMN routing:</div>
              <div className="text-[#a1a1aa]">  Rule: <span className="text-blue-400">R-007</span> — Tier B, auto-engage</div>
              <div className="text-[#a1a1aa]">  Action: <span className="text-white">auto_engage</span></div>
              <div className="text-[#a1a1aa]">  SLA: <span className="text-white">8 hours</span></div>
              <div className="text-[#a1a1aa]">  Priority: <span className="text-yellow-400">HIGH</span></div>
            </TerminalBlock>

            <h2>T+3.8s — Outreach</h2>

            <p>
              A personalized email drafts in the client&apos;s brand voice. Not a template with merged fields. The system writes copy that references the Austin market, acknowledges the professional services vertical, and positions the value proposition for someone at the VP level. The tone matches the brand guidelines configured during setup.
            </p>

            <p>
              The email queues for review. Even with autonomous execution authority, outbound communications pass through a final governance check. The system is confident enough to decide, but disciplined enough to not skip the last gate.
            </p>

            <h2>T+4.2s — The Trail</h2>

            <p>
              Every step — from ingestion to scoring to gate evaluation to routing to outreach — logs to the decision trail. Every signal that fired. Every score that calculated. Every threshold that was evaluated. Every rule that matched.
            </p>

            <TerminalBlock>
              <div className="text-[#71717a]">▸ Decision trail logged:</div>
              <div className="text-[#a1a1aa]">  Events: <span className="text-white">decision → action → outcome</span></div>
              <div className="text-[#a1a1aa]">  Telemetry source: <span className="text-green-400">PostgreSQL</span></div>
              <div className="text-[#a1a1aa]">  Audit status: <span className="text-green-400">COMPLETE</span></div>
              <div className="text-[#71717a] mt-2">  Full chain retrievable at any time.</div>
              <div className="text-[#71717a]">  Retention: indefinite.</div>
            </TerminalBlock>

            <p>
              If this prospect converts six weeks later, the system can trace the entire chain back to this moment. If she does not convert, the system learns from that outcome too — adjusting its priors, refining its thresholds, getting more accurate with every cycle.
            </p>

            <h2>What Happened at 2:47 PM</h2>

            <p>
              At 2:47 PM, a VP of Operations filled out a form. At 2:47 PM and 4.2 seconds, the system had scored her across 72 signals, evaluated its own confidence, determined it had the authority to act, routed her to the right engagement sequence, drafted a personalized outreach in the client&apos;s voice, and logged every step of its reasoning.
            </p>

            <p>
              At 2:47 PM, a human was in a meeting. The system handled it. Correctly. And it can show its work.
            </p>

            <p className="text-white text-lg font-bold">
              That is what governed revenue intelligence looks like. Score. Decide. Prove.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-16 pt-12 border-t border-[#27272a]">
            <h3 className="text-xl font-bold text-white mb-3">Try it yourself</h3>
            <p className="text-[#a1a1aa] text-sm mb-6">
              Fire signals, watch conviction scores update in real-time, and see the governance gate decide.
            </p>
            <div className="flex gap-4">
              <Link
                href="/playground"
                className="btn-primary px-6 py-3 rounded-lg text-white font-semibold text-sm inline-block"
              >
                Open the Playground
              </Link>
              <Link
                href="/insights/governance-manifesto"
                className="px-6 py-3 rounded-lg text-sm font-medium text-[#a1a1aa] border border-[#27272a] hover:bg-white/5 transition-colors inline-block"
              >
                Read the Manifesto
              </Link>
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  )
}
