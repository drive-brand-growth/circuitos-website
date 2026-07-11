'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const pillars = [
  {
    title: 'Propose',
    subtitle: 'Stochastic models',
    body: 'Agents draft scores, risk flags, and next actions. They never commit alone.',
    accent: 'text-blue-400',
  },
  {
    title: 'Commit',
    subtitle: 'Deterministic rules',
    body: 'Risk class plus confidence decide what runs, what waits, and what escalates to a human. Same inputs, same governed outcome. Nothing ships on vibes.',
    accent: 'text-green-400',
  },
  {
    title: 'Prove',
    subtitle: 'Ledgers',
    body: 'Hash-chained receipts: what was decided, why, which model, what it cost. Replayable for your board, auditor, or regulator.',
    accent: 'text-yellow-400',
  },
]

const hypeGap = [
  { hype: '“AI agents for your business”', truth: 'What changed? Diff and hash.' },
  { hype: '“10× productivity”', truth: 'Why that action? Evidence tier and rule path on every recommendation.' },
  { hype: '“Autonomous workflows”', truth: 'Did it fabricate? Verified before side effects.' },
  { hype: 'Flat SaaS with no receipts', truth: 'Every decision on a tamper-evident ledger.' },
]

export default function TruthSection() {
  return (
    <section id="the-truth" className="py-24 px-6 border-t border-[#27272a]/60">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-medium tracking-widest uppercase text-blue-400 mb-4">
            The anti-hype contract
          </p>
          <blockquote className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-snug tracking-[-0.02em] mb-6">
            Stochastic models propose.<br className="hidden sm:block" />{' '}
            Deterministic rules commit.<br className="hidden sm:block" />{' '}
            Ledgers prove.
          </blockquote>
          <p className="text-[#a1a1aa] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Most AI ships demos. CircuitOS ships{' '}
            <strong className="text-white font-semibold">receipts</strong>: proof of what was
            decided, why, and what it cost.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-6 mb-16">
          {pillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="card rounded-xl p-6 md:p-8"
            >
              <p className={`text-xs font-semibold uppercase tracking-wider ${p.accent} mb-1`}>
                {p.subtitle}
              </p>
              <h3 className="text-xl font-bold text-white mb-3">{p.title}</h3>
              <p className="text-[#a1a1aa] text-sm leading-relaxed">{p.body}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="card rounded-xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-[#27272a] bg-[#18181b]/50">
            <h3 className="text-sm font-semibold text-white">What the market ships vs. what we prove</h3>
          </div>
          <ul className="divide-y divide-[#27272a]">
            {hypeGap.map((row, i) => (
              <li key={row.hype} className="grid md:grid-cols-2 gap-2 px-6 py-4 text-sm">
                <span className="relative inline-block w-fit text-[#71717a]">
                  {row.hype}
                  <motion.span
                    aria-hidden
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.3 + i * 0.15, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute left-0 top-1/2 h-px w-full origin-left bg-[#71717a]"
                  />
                </span>
                <motion.span
                  initial={{ opacity: 0, x: -6 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.55 + i * 0.15 }}
                  className="text-[#e4e4e7]"
                >
                  {row.truth}
                </motion.span>
              </li>
            ))}
          </ul>
        </motion.div>

        <p className="text-center mt-10">
          <Link
            href="/insights/deterministic-factory"
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            Read the full argument →
          </Link>
        </p>
      </div>
    </section>
  )
}
