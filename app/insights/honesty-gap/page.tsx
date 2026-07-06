import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'The Honesty Gap: Your Attribution Dashboard Is Flattering You',
  description: 'Every marketing tool shows you credit. Credit is not causation. CircuitOS measures the gap between them and refuses to show any number it can\'t prove.',
  openGraph: {
    title: 'The Honesty Gap | CircuitOS',
    description: 'Every marketing tool shows you credit. Credit is not causation. Here is the gap between them, and the engine that refuses to lie about it.',
    url: 'https://usecircuitos.com/insights/honesty-gap',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Honesty Gap: Your Attribution Dashboard Is Flattering You',
    description: 'Credit is not causation. CircuitOS refuses to show any number it can\'t prove.',
  },
  alternates: { canonical: 'https://usecircuitos.com/insights/honesty-gap' },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'The Honesty Gap: Your Attribution Dashboard Is Flattering You',
  description: 'Every marketing tool shows you credit. Credit is not causation. CircuitOS measures the gap between them and refuses to show any number it can\'t prove.',
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
  datePublished: '2026-07-05',
  dateModified: '2026-07-05',
  mainEntityOfPage: 'https://usecircuitos.com/insights/honesty-gap',
  url: 'https://usecircuitos.com/insights/honesty-gap',
}

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'How do I know if an attribution tool measures causation or just correlation?',
      acceptedAnswer: { '@type': 'Answer', text: 'Ask four questions. What is your identification strategy? What baseline is lift measured against, and where is it stored? Where is the confidence interval? What does the product do when a number is not proven: refuse, or round up? A tool with real causal machinery has a designed refusal state. Attribution theater always has a number.' },
    },
    {
      '@type': 'Question',
      name: 'What is the honesty gap in marketing attribution?',
      acceptedAnswer: { '@type': 'Answer', text: 'The gap between correlational credit (what multi-touch attribution assigns) and measured causal lift (the incremental effect versus a baseline, holding confounders constant). Most tools show only the flattering credit number. CircuitOS renders the gap itself.' },
    },
    {
      '@type': 'Question',
      name: 'Why does CircuitOS refuse to show some numbers?',
      acceptedAnswer: { '@type': 'Answer', text: 'A number is a liability until it is measured and confirmed. Every causal result starts uncitable and becomes citable only after a calibration harness pass plus a named human confirmation. Exporting an unproven number raises an exception in the engine. The refusal is enforced in code, not requested in a style guide.' },
    },
  ],
}

export default function HonestyGapManifesto() {
  return (
    <main className="min-h-screen grid-bg">
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <article className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <nav className="mb-8 text-sm">
            <Link href="/insights" className="text-[#71717a] hover:text-blue-400 transition-colors">Insights</Link>
            <span className="text-[#3f3f46] mx-2">/</span>
            <span className="text-[#a1a1aa]">Measurement</span>
          </nav>

          {/* Header */}
          <div className="mb-12">
            <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
              Measurement
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-6 mb-6 tracking-[-0.02em] leading-tight">
              The Honesty Gap: Your Attribution Dashboard Is Flattering You
            </h1>
            <p className="text-[#71717a] text-sm">July 2026 &middot; 7 min read</p>
          </div>

          {/* Body */}
          <div className="max-w-none [&_p]:text-[#a1a1aa] [&_p]:leading-relaxed [&_p]:mb-5 [&_p]:text-sm [&_p]:md:text-base [&_h2]:text-white [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:md:mt-12 [&_h2]:mb-3 [&_h2]:md:mb-4 [&_strong]:text-white [&_blockquote]:border-l-2 [&_blockquote]:border-blue-500 [&_blockquote]:pl-4 [&_blockquote]:md:pl-6 [&_blockquote]:italic [&_blockquote]:text-[#a1a1aa] [&_blockquote]:text-sm [&_blockquote]:md:text-base [&_ul]:mb-5 [&_li]:text-[#a1a1aa] [&_li]:text-sm [&_li]:md:text-base [&_li]:leading-relaxed [&_li]:mb-2">

            <div className="border-l-2 border-blue-500 pl-4 md:pl-6 mb-10">
              <p className="text-white text-xl md:text-2xl font-bold mb-2 tracking-[-0.01em]">
                Your AI lied. We have receipts.
              </p>
              <p>
                Every dashboard shows you credit. Credit is not causation. CircuitOS measures what your marketing actually caused, and refuses to show a number it can&apos;t prove.
              </p>
            </div>

            <p className="text-base md:text-lg text-white leading-relaxed">
              Open your attribution dashboard. Pick your best-performing campaign. That number next to it, the 40% credit or the 3.2x ROAS, answers a question you didn&apos;t ask. You asked: <strong>what did this campaign cause?</strong> It answered: <strong>what was this campaign near?</strong>
            </p>

            <p>
              Those are different questions. The distance between their answers is the honesty gap, and almost every tool in the marketing stack is built to keep you from seeing it.
            </p>

            <h2>Credit Is Not Causation</h2>

            <p>
              Multi-touch attribution is credit assignment: first-touch, last-touch, linear, time-decay, position-based, even Shapley. It takes the conversions that happened and divides them among the touchpoints that were present. It is bookkeeping, not measurement. Useful bookkeeping. But it cannot tell you the one thing you actually pay for: how many of those buyers <strong>would have converted anyway</strong>.
            </p>

            <p>
              To answer that, you need a counterfactual: a measured baseline of what happens without the touchpoint. And you need to control for the boring truth that campaigns get aimed at people who were already likely to buy. High-intent leads get more email. Then email gets credit for high-intent leads. Every correlational model in existence falls for this, because it was never designed not to.
            </p>

            <blockquote>
              An illustrative example: last-touch credits a nurture sequence with 40% of conversions. Measured against baseline, holding buyer intent and origin constant, its incremental lift might be a fraction of that. The remainder was buyers who were already on their way. (Illustrative numbers. That is exactly the point. We publish nothing real until our engine marks it proven.)
            </blockquote>

            <h2>Why Every Tool Shows You the Flattering Number</h2>

            <p>
              Attribution vendors sell renewal. The dashboard that says &quot;your campaigns drove 40% of revenue&quot; renews itself. The dashboard that says &quot;measured causal lift was small, and here is the confidence interval&quot; has to be sold on something harder: being right.
            </p>

            <p>
              This is not a conspiracy. It is an incentive. The tools are not lying. They answer the easier question and let you assume it was the hard one. The industry-wide result is that marketing measurement runs on numbers nobody would defend under oath.
            </p>

            <h2>What Honest Measurement Actually Requires</h2>

            <p>
              None of this is exotic. The methodology has existed for decades. It is the same causal-inference discipline used in clinical trials and econometrics, and it makes four demands:
            </p>

            <ul>
              <li><strong>A measured baseline.</strong> The conversion rate without the treatment, per segment. No baseline, no lift claim. The counterfactual is the claim.</li>
              <li><strong>Confounders held constant.</strong> The variables that drive both exposure and conversion (segment, origin, pre-existing intent) must be adjusted for, explicitly and by name.</li>
              <li><strong>A confidence interval.</strong> A point estimate without its uncertainty is a decoration, not a measurement.</li>
              <li><strong>Calibration.</strong> The system&apos;s stated confidence has to be checked against reality, on data it couldn&apos;t optimize against.</li>
            </ul>

            <p>
              Every attribution vendor could do this. Ask yours why they don&apos;t.
            </p>

            <h2>The Refusal, in Code</h2>

            <p>
              We built the causal attribution engine inside CircuitOS to a rule most software never states: <strong>a number is a liability until it is measured and confirmed.</strong> Not a value in a slide deck. An invariant in the code:
            </p>

            <ul>
              <li>Every causal result is born <strong>uncitable</strong>. The flag is <code className="text-blue-400">citable = false</code> by default, and the engine exposes exactly one path that flips it: a passing calibration report bound to that result, plus a named human confirmation. A repo-wide static test enforces that no other assignment exists.</li>
              <li>Exporting or attesting an unproven number doesn&apos;t quietly pass it through. <strong>It raises an exception.</strong> Rendering one is structurally refused: the interface omits the digit entirely, and a test asserts none can appear. Enforced, not requested.</li>
              <li>Lift is mathematically undefined without a measured baseline. An empty confounder set is an error, not a default.</li>
              <li>Psychological triggers (scarcity, social proof, authority) enter the engine only as coded variables tested for measured lift. A static check over the engine&apos;s source proves no path in it lets a trigger claim credit without passing through the causal estimator. Naming a trigger is a hypothesis; only measurement can promote it to a finding.</li>
              <li>The estimator is verified against synthetic data with a known, planted effect. The test fails if the engine cannot recover the truth we buried.</li>
            </ul>

            <p>
              And the rule extends to every surface we ship, including this website: <strong>no citable flag, no digit.</strong> When measurement is still pending, the screen says so, in words. No grayed-out numbers. No teased placeholder values. You will see the word &quot;pending&quot; on our own operator screens, and that is not an apology. It&apos;s the entire point.
            </p>

            <h2>Ask Your Vendor</h2>

            <p>
              You don&apos;t need to buy anything from us to use this article. Take these four questions to whoever sells you attribution today:
            </p>

            <ul>
              <li>What is your identification strategy? How do you separate causation from correlation, specifically?</li>
              <li>What baseline is my &quot;lift&quot; measured against, and where is it stored?</li>
              <li>Where is the confidence interval on this number?</li>
              <li>What happens in your product when a number <em>isn&apos;t</em> proven? Does it refuse, or does it round up?</li>
            </ul>

            <p>
              If the answers are fuzzy, you&apos;re looking at credit, not causation. You&apos;re on the flattering side of the honesty gap.
            </p>

            <h2>Proof Compounds</h2>

            <p>
              Here is the part that matters if you run a business rather than a dashboard: flattering numbers depreciate. Every quarter they fail to predict, you trust them less. Proof moves the other way. Baselines mature. Calibration histories accumulate. Every measured segment makes the next measurement sharper. A system that refuses to guess gets more valuable every week it runs. The evidence it accrues is yours. It cannot be bought, backfilled, or faked.
            </p>

            <p className="text-white">
              Everyone else sells the number. We sell the proof. <strong>In a world of hype, that is our flag. Planted.</strong>
            </p>

            {/* CTA */}
            <div className="mt-12 card rounded-xl p-6 md:p-8 border border-blue-500/20">
              <p className="text-white font-bold mb-2">See the refusal for yourself</p>
              <p className="mb-4">
                The demo runs on labeled synthetic data. Our claim gate applies to demos too.
              </p>
              <Link
                href="/demo"
                className="inline-block bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                Walk through the demo
              </Link>
            </div>

          </div>
        </div>
      </article>

      <Footer />
    </main>
  )
}
