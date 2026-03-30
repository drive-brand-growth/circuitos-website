import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Your AI Is Making Decisions It Can\'t Explain',
  description: 'Every company is deploying AI agents. Almost none can explain why the AI did what it did. Revenue intelligence without governance is a liability.',
  openGraph: {
    title: 'Your AI Is Making Decisions It Can\'t Explain | CircuitOS',
    description: 'Revenue intelligence without governance is a liability. Here\'s why every autonomous AI decision needs a confidence threshold, an escalation path, and a proof trail.',
    url: 'https://usecircuitos.com/insights/governance-manifesto',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your AI Is Making Decisions It Can\'t Explain',
    description: 'Revenue intelligence without governance is a liability.',
  },
  alternates: { canonical: 'https://usecircuitos.com/insights/governance-manifesto' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Your AI Is Making Decisions It Can\'t Explain. That Should Terrify You.',
  description: 'Every company is deploying AI agents. Almost none can explain why the AI did what it did. Revenue intelligence without governance is a liability.',
  author: {
    '@type': 'Organization',
    name: 'CircuitOS',
    url: 'https://usecircuitos.com',
  },
  publisher: {
    '@type': 'Organization',
    name: 'CircuitOS',
    url: 'https://usecircuitos.com',
    logo: 'https://usecircuitos.com/circuitos-logo-full.svg',
  },
  datePublished: '2026-03-30',
  dateModified: '2026-03-30',
  mainEntityOfPage: 'https://usecircuitos.com/insights/governance-manifesto',
  url: 'https://usecircuitos.com/insights/governance-manifesto',
}

export default function GovernanceManifesto() {
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
            <span className="text-[#a1a1aa]">Governance</span>
          </nav>

          {/* Header */}
          <div className="mb-12">
            <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
              Governance
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-6 mb-6 tracking-[-0.02em] leading-tight">
              Your AI Is Making Decisions It Can&apos;t Explain. That Should Terrify You.
            </h1>
            <p className="text-[#71717a] text-sm">March 2026 &middot; 8 min read</p>
          </div>

          {/* Body */}
          <div className="prose prose-invert prose-lg max-w-none [&_p]:text-[#a1a1aa] [&_p]:leading-relaxed [&_p]:mb-6 [&_h2]:text-white [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-12 [&_h2]:mb-4 [&_strong]:text-white [&_blockquote]:border-l-2 [&_blockquote]:border-blue-500 [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-[#a1a1aa]">

            <p className="text-lg text-white leading-relaxed">
              Right now, somewhere in your company, an AI agent is about to send an email to your highest-value prospect. It will choose the subject line, the tone, the timing, and the call to action. It will make that decision in milliseconds. And nobody in your organization can explain why it chose that approach over any other.
            </p>

            <p>
              This is not hypothetical. This is Tuesday.
            </p>

            <p>
              Every company deploying AI agents for revenue operations — lead scoring, outreach automation, content generation, pipeline management — is making a bet. The bet is that the AI will get it right more often than it gets it wrong, and that the upside of speed outweighs the downside of opacity.
            </p>

            <p>
              That bet is about to stop paying off.
            </p>

            <h2>The Governance Gap</h2>

            <p>
              When a junior sales rep sends a bad email, you coach them. When a marketing campaign underperforms, you review the data and adjust. When an account executive pushes a deal that shouldn&apos;t have been pushed, there&apos;s a pipeline review meeting where someone asks uncomfortable questions.
            </p>

            <p>
              When your AI does any of these things, what happens?
            </p>

            <p>
              In most organizations, the answer is: nothing. The AI acted. The action happened. There is no trail, no confidence score, no escalation path. Nobody even knows it happened until a prospect replies with &quot;please remove me from your list&quot; or, worse, says nothing at all and the deal quietly dies.
            </p>

            <p>
              <strong>This is the governance gap.</strong> The distance between what your AI can do and what your organization can explain about what it did.
            </p>

            <h2>Autonomy Is Not a Binary</h2>

            <p>
              The mistake most companies make is treating AI autonomy as a switch. Either the AI acts on its own, or a human approves everything. Full autonomy or full control. Speed or safety.
            </p>

            <p>
              This is a false choice.
            </p>

            <p>
              Consider how organizations actually grant autonomy to humans. A new hire can send internal emails but not external ones. A senior rep can discount up to 10% but needs VP approval above that. A director can commit to timelines but not contract terms. <strong>Autonomy is earned incrementally, based on demonstrated competence, within defined boundaries.</strong>
            </p>

            <p>
              AI should work the same way.
            </p>

            <blockquote>
              <p>The question is not &quot;should AI act autonomously?&quot; The question is: &quot;At what confidence level does this specific action, at this specific risk level, earn autonomous execution?&quot;</p>
            </blockquote>

            <p>
              A low-risk action — adding a tag to a CRM record — might be autonomous at 65% confidence. A high-risk action — sending a personalized outreach email to a Tier A prospect — might require 88%. A critical action — committing to pricing or scheduling a meeting — might require 92% confidence and still route to a human for final approval.
            </p>

            <p>
              This is not a limitation. This is intelligence. A system that knows the boundaries of its own competence is more trustworthy than one that acts without hesitation regardless of uncertainty.
            </p>

            <h2>The Three Requirements</h2>

            <p>
              Every autonomous AI decision in a revenue context needs three things:
            </p>

            <p>
              <strong>A confidence threshold.</strong> Not a binary pass/fail, but a calibrated probability that the action will produce the intended outcome. Bayesian inference is the foundation — prior beliefs updated with evidence from every signal the system observes. When the posterior probability exceeds the threshold for that action&apos;s risk class, the system acts. When it doesn&apos;t, it escalates.
            </p>

            <p>
              <strong>An escalation path.</strong> When the system is uncertain, it needs a clear route to a human who can review the evidence and make the call. Not a generic &quot;human in the loop&quot; checkbox — a specific escalation to the right person, with the full context of why the system paused. The human should see: what was scored, what the confidence level was, what threshold it fell below, and what the system would have done if autonomous.
            </p>

            <p>
              <strong>A decision trail.</strong> Every action the system takes — whether autonomous or human-approved — needs a complete audit record. Not a log file buried in a database. A visible, searchable trail that shows: what was decided, what evidence informed the decision, what confidence level triggered the action, and what the outcome was. If you cannot reconstruct the reasoning chain for any decision your AI made in the last 90 days, you do not have governance. You have hope.
            </p>

            <h2>What This Looks Like in Practice</h2>

            <p>
              A lead comes in at 2:47 PM from a B2B professional services firm in Austin, Texas. In the next four seconds:
            </p>

            <p>
              Seventy-two signals fire. Revenue fit scores 0.82 — the company has the budget and the profile. Decision authority scores 0.71 — the contact is a VP, not the final buyer but close. Market density scores 0.89 — the Austin market has strong demand and low competition.
            </p>

            <p>
              The system computes a conviction score of 78.4%. This is Tier B — strong but not exceptional. The governance gate evaluates: 78.4% exceeds the 78% threshold for Type 2 autonomous actions. Decision: <strong>EXECUTE.</strong> A personalized outreach sequence initiates, drafted in the client&apos;s brand voice, referencing the Austin market specifically.
            </p>

            <p>
              The entire chain — every signal, every score, the gate evaluation, the routing decision, the outreach content — logs to a decision trail. Auditable. Provable. If the prospect converts, the system learns. If they don&apos;t, the system learns that too.
            </p>

            <p>
              At 2:47 PM, a human was in a meeting. The system handled it. Correctly. And it can show its work.
            </p>

            <h2>The Standard Is Coming</h2>

            <p>
              The EU AI Act already requires explainability for high-risk AI systems. Enterprise procurement teams are starting to ask vendors: &quot;Can you show us the decision trail for your AI actions?&quot; Board members are asking: &quot;What happens when the AI is wrong, and how do we know?&quot;
            </p>

            <p>
              Companies that build governance in from the beginning will have a structural advantage over those that try to bolt it on after the fact. The companies that can say &quot;every decision our AI makes is auditable, every action has a confidence score, and every escalation has a clear path to a human&quot; will close deals that their competitors cannot.
            </p>

            <p>
              This is not about compliance. This is about trust. And trust is the only currency that compounds.
            </p>

            <h2>Score. Decide. Prove.</h2>

            <p>
              Revenue intelligence without governance is a liability. Revenue intelligence with governance is a competitive advantage. The difference is three words:
            </p>

            <p className="text-white text-xl font-bold">
              Score every lead. Decide with calibrated confidence. Prove every action with a complete trail.
            </p>

            <p>
              Your AI should work while you sleep. But by morning, you should be able to see exactly what it did and exactly why it worked.
            </p>

            <p>
              That is the standard. Everything else is guessing.
            </p>
          </div>

          {/* CTA */}
          <div className="mt-16 pt-12 border-t border-[#27272a]">
            <h3 className="text-xl font-bold text-white mb-3">See the governance engine in action</h3>
            <p className="text-[#a1a1aa] text-sm mb-6">
              Fire signals, watch conviction scores update, and see the autonomy gate decide in real-time.
            </p>
            <div className="flex gap-4">
              <Link
                href="/playground"
                className="btn-primary px-6 py-3 rounded-lg text-white font-semibold text-sm inline-block"
              >
                Try the Playground
              </Link>
              <Link
                href="/insights/lead-walk-through"
                className="px-6 py-3 rounded-lg text-sm font-medium text-[#a1a1aa] border border-[#27272a] hover:bg-white/5 transition-colors inline-block"
              >
                Read the Walk-Through
              </Link>
            </div>
          </div>
        </div>
      </article>
      <Footer />
    </main>
  )
}
