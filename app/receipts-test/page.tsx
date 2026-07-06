import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { Metadata } from 'next'
import Scorecard from './Scorecard'
import RefusalDemo from './RefusalDemo'
import TamperDemo from './TamperDemo'

export const metadata: Metadata = {
  title: 'The Receipts Test: Audit Your Attribution Vendor in Two Minutes',
  description:
    'Four questions that separate causal measurement from attribution theater. Score any vendor in two minutes. We take the same test below.',
  openGraph: {
    title: 'The Receipts Test | CircuitOS',
    description:
      'Four questions that separate causal measurement from attribution theater. Score any vendor in two minutes.',
    url: 'https://usecircuitos.com/receipts-test',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Receipts Test: Audit Your Attribution Vendor in Two Minutes',
    description:
      'Four questions that separate causal measurement from attribution theater. Score any vendor in two minutes.',
  },
  alternates: { canonical: 'https://usecircuitos.com/receipts-test' },
}

const howToJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'The Receipts Test: Audit Your Attribution Vendor',
  description:
    'Four questions that separate causal measurement from attribution theater. Score any vendor in two minutes.',
  totalTime: 'PT2M',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Ask about the identification strategy',
      text: 'Ask your vendor: What is your identification strategy? How do you separate causation from correlation, specifically? A real answer names confounders and an adjustment method.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Ask where the baseline is stored',
      text: 'Ask your vendor: What baseline is my lift measured against, and where is it stored? A real answer describes a measured per-segment counterfactual that is queryable.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Ask for the confidence interval',
      text: 'Ask your vendor: Where is the confidence interval on this number? A real answer surfaces a confidence interval on every point estimate.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Ask what happens when a number is not proven',
      text: 'Ask your vendor: What does your product do when a number is not proven: refuse, or round up? A real answer describes a designed refusal state you can screenshot.',
    },
  ],
}

const OUR_ANSWERS = [
  {
    q: 'What is our identification strategy?',
    a: 'Backdoor confounder adjustment with FWL residualization: we name every confounder, adjust for it explicitly, and the empty-confounder-set case is an error, not a default.',
  },
  {
    q: 'What baseline is lift measured against, and where is it stored?',
    a: 'A measured per-segment counterfactual stored in the decision ledger, queryable by segment and time window. Lift is mathematically undefined without one, so we refuse to compute it without one.',
  },
  {
    q: 'Where is the confidence interval on this number?',
    a: 'Every point estimate ships with a confidence interval. When measurement is pending, the product renders the word "pending" in words. No placeholder digits appear on any surface.',
  },
  {
    q: 'What do we do when a number is NOT proven?',
    a: 'We raise an exception. Every causal result is born uncitable, and exporting an unproven number is a hard error in the engine. The refusal state is not a policy request. It is enforced by tests.',
  },
]

export default function ReceiptsTest() {
  return (
    <main className="min-h-screen grid-bg">
      <Nav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />

      <article className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
              Measurement
            </span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-6 mb-4 tracking-[-0.02em] leading-tight">
              The Receipts Test
            </h1>
            <p className="text-[#a1a1aa] text-base md:text-lg leading-relaxed">
              Four questions that separate causal measurement from attribution theater.
              Score any vendor in two minutes. We take the same test below.
            </p>
          </div>

          {/* Scorecard */}
          <Scorecard />

          {/* Interactive proof demos */}
          <section className="mt-16 space-y-6">
            <RefusalDemo />
            <TamperDemo />
          </section>

          {/* Our own answers */}
          <section className="mt-16">
            <h2 className="text-white text-xl md:text-2xl font-bold mb-2 tracking-[-0.01em]">
              We take our own test
            </h2>
            <p className="text-[#71717a] text-sm mb-8">
              One factual sentence per question. These behaviors are enforced by tests, not policy.
            </p>

            <div className="space-y-4">
              {OUR_ANSWERS.map((item, idx) => (
                <div
                  key={idx}
                  className="card rounded-xl p-5 border border-[#27272a]"
                >
                  <p className="text-xs font-medium text-blue-400 mb-1">Q{idx + 1}</p>
                  <p className="text-[#a1a1aa] text-sm font-semibold mb-2">{item.q}</p>
                  <p className="text-[#71717a] text-sm leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>

            <p className="text-white text-sm font-semibold mt-8">
              All four answers are enforced by tests, not policy.
            </p>

            <div className="mt-8 card rounded-xl p-6 md:p-8 border border-blue-500/20">
              <p className="text-white font-bold mb-2">Read the manifesto and the receipts</p>
              <p className="text-[#a1a1aa] text-sm mb-4">
                The full argument for why credit is not causation, and how the refusal is built.
              </p>
              <Link
                href="/insights/honesty-gap"
                className="inline-block bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
              >
                Read the Honesty Gap manifesto
              </Link>
            </div>
          </section>
        </div>
      </article>

      <Footer />
    </main>
  )
}
