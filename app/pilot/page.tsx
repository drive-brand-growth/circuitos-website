'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
}

const pilotIncludes = [
  'One vertical fully configured with your ICP and scoring logic',
  '50 leads scored across 72+ signals with full conviction breakdown',
  'Governance gates configured — see EXECUTE vs. ESCALATE on real prospects',
  'Personalized outreach drafted in your brand voice (you approve before send)',
  'Full decision trail — every score, every gate, every routing decision auditable',
  'CRM integration (any platform) with pipeline sync',
  'End-of-pilot report: scoring accuracy, qualification rate, pipeline impact',
]

const whatYouLearn = [
  { label: 'Which leads are real', desc: 'See your pipeline scored and tiered — A, B, C, D — based on real signals, not gut feel.' },
  { label: 'Where leads fall through', desc: 'The decision trail shows exactly where prospects stall, which signals are missing, and where your pipeline leaks.' },
  { label: 'What autonomy looks like', desc: 'Watch the governance gate decide: EXECUTE when confident, ESCALATE when uncertain. You see the math behind every decision.' },
  { label: 'Whether CircuitOS fits', desc: '30 days is enough to know. If the numbers work, convert to a full deployment. If they don\'t, you walk.' },
]

export default function PilotPage() {
  return (
    <main className="min-h-screen grid-bg">
      <Nav />

      <section className="pt-28 pb-20 px-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <span className="text-xs font-medium text-blue-400 bg-blue-500/10 px-3 py-1.5 rounded-full border border-blue-500/20 inline-block mb-6">
              30-Day Pilot Program
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-[-0.02em]">
              See it work on<br />your real data.
            </h1>
            <p className="text-[#a1a1aa] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              50 leads scored. Full governance. Complete decision trail. One vertical, 30 days, $1,500. If the numbers work, convert to a full deployment. If they don&apos;t, you walk.
            </p>
          </motion.div>

          {/* Price block */}
          <motion.div variants={fadeInUp} className="card rounded-xl p-8 md:p-10 border-blue-500/20 bg-blue-500/[0.03] text-center mb-12">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-5xl md:text-6xl font-bold">$1,500</span>
            </div>
            <p className="text-[#a1a1aa] mb-1">One-time. 30 days. One vertical.</p>
            <p className="text-[#71717a] text-sm mb-8">Applies toward your implementation if you convert to Growth, Scale, or Enterprise.</p>
            <a
              href="/demo"
              className="inline-block btn-primary px-10 py-4 rounded-lg text-white font-semibold text-lg"
            >
              Start Your Pilot
            </a>
          </motion.div>

          {/* What's included */}
          <motion.div variants={fadeInUp} className="card rounded-xl p-8 md:p-10 mb-12">
            <h2 className="text-2xl font-bold mb-6">What&apos;s included</h2>
            <div className="space-y-4">
              {pilotIncludes.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-blue-500 mt-0.5 shrink-0">&#10003;</span>
                  <span className="text-[#a1a1aa] leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* What you'll learn */}
          <motion.div variants={fadeInUp} className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">What you&apos;ll learn in 30 days</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {whatYouLearn.map((item) => (
                <div key={item.label} className="card rounded-xl p-6">
                  <h3 className="text-lg font-semibold mb-2">{item.label}</h3>
                  <p className="text-[#a1a1aa] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* How it works */}
          <motion.div variants={fadeInUp} className="card rounded-xl p-8 md:p-10 mb-12">
            <h2 className="text-2xl font-bold mb-6">How the pilot works</h2>
            <div className="space-y-6">
              {[
                { step: '01', title: 'Kickoff call', desc: 'We learn your ICP, your pipeline, and your biggest scoring challenge. 45 minutes.' },
                { step: '02', title: 'Configuration', desc: 'We encode your qualification criteria, connect your CRM, and calibrate the scoring model. 5-7 business days.' },
                { step: '03', title: 'Live scoring', desc: '50 leads flow through the engine. You see every score, every gate evaluation, every routing decision in your dashboard.' },
                { step: '04', title: 'Pilot report', desc: 'We deliver a full analysis: scoring accuracy, qualification rates, pipeline impact, and a recommendation for full deployment.' },
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <span className="text-sm text-blue-500 font-mono font-semibold shrink-0 mt-0.5">{item.step}</span>
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-[#a1a1aa] text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* After the pilot */}
          <motion.div variants={fadeInUp} className="card rounded-xl p-8 md:p-10 mb-12 border-[#27272a]">
            <h2 className="text-2xl font-bold mb-4">After the pilot</h2>
            <p className="text-[#a1a1aa] leading-relaxed mb-6">
              If the numbers work, your $1,500 pilot fee applies toward your full implementation. You pick the tier that fits — Growth, Scale, or Enterprise — and we expand from there. No new onboarding fee for the first vertical. No pressure. The data speaks for itself.
            </p>
            <p className="text-[#a1a1aa] leading-relaxed">
              If the numbers don&apos;t work, you walk with a complete analysis of your pipeline, your scoring signals, and your qualification gaps. That report alone is worth the pilot fee.
            </p>
          </motion.div>

          {/* FAQ */}
          <motion.div variants={fadeInUp} className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Common questions</h2>
            <div className="space-y-4 max-w-3xl mx-auto">
              {[
                {
                  q: 'What if we have more than 50 leads?',
                  a: 'The pilot is scoped to 50 leads to keep the evaluation focused. If your volume is higher, we prioritize the 50 most representative leads so the scoring model calibrates against your real pipeline.',
                },
                {
                  q: 'Does the $1,500 apply to the full deployment?',
                  a: 'Yes. If you convert to Growth, Scale, or Enterprise after the pilot, the $1,500 is credited toward your implementation fee.',
                },
                {
                  q: 'What CRM do we need?',
                  a: 'Any CRM. HubSpot, Salesforce, or whatever you run. We connect via native adapters or REST API.',
                },
                {
                  q: 'What if we\'re not ready in 30 days?',
                  a: 'The 30 days starts when your leads begin flowing through the engine, not from the contract date. Configuration and CRM setup happen before the clock starts.',
                },
              ].map((faq) => (
                <div key={faq.q} className="card rounded-xl p-6">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-[#a1a1aa] text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bottom CTA */}
          <motion.div variants={fadeInUp} className="text-center border-t border-[#27272a] pt-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your revenue deserves proof.
            </h2>
            <p className="text-[#a1a1aa] text-lg mb-8 max-w-lg mx-auto">
              30 days. 50 leads. Full decision trail. See what governed revenue intelligence looks like on your real data.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/demo"
                className="w-full sm:w-auto px-10 py-4 btn-primary text-white rounded-lg font-semibold text-lg"
              >
                Start Your Pilot
              </a>
              <Link
                href="/playground"
                className="w-full sm:w-auto px-10 py-4 border border-[#27272a] rounded-lg font-semibold hover:bg-white/5 transition-colors text-center"
              >
                Try the Playground First
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
    </main>
  )
}
