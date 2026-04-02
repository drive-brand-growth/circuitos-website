'use client'

import { motion } from 'framer-motion'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.12 } }
}

const capabilities = [
  {
    title: 'Predictive scoring from day one',
    desc: 'Your ICP and qualification criteria are encoded before launch — no training period, no cold start. Every lead scored on fit, intent, and timing across 72+ signals using Bayesian inference. You see the math, not a magic number.',
  },
  {
    title: 'Personalized outreach in your voice',
    desc: 'Your brand voice is encoded, not templated. AI generates unique copy per prospect based on their score, profile, and engagement signals. Every email is scanned for brand compliance before delivery.',
  },
  {
    title: 'Content generated, fact-checked, and published',
    desc: 'Blog posts written by AI, fact-checked against verifiable sources, and scored for quality by multiple independent models. Social distribution across four channels. Nothing publishes without your sign-off.',
  },
  {
    title: 'Full-cycle, not half-cycle',
    desc: 'Scoring, qualification, outreach, nurture, content, CRM sync, and attribution in a single governed pipeline. Not an outbound email tool. A complete revenue system from first signal to closed deal.',
  },
  {
    title: 'Closed-loop learning',
    desc: 'Real engagement data — open rates, reply rates, conversions, GA4 attribution — feeds back into the scoring model. Every outcome refines the next prediction. The system improves with every cycle.',
  },
  {
    title: 'Every action auditable. Every escalation earned.',
    desc: 'Confidence thresholds mapped to risk classes determine what the system handles alone and what gets routed to a human. Complete decision trail on every score, every action, every outcome. Indefinite retention.',
  },
]

export default function Capabilities() {
  return (
    <section id="capabilities" className="section-padding px-6 border-t border-[#27272a]">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-4 tracking-[-0.02em]"
        >
          What you get
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[#a1a1aa] text-center mb-16 text-lg max-w-2xl mx-auto"
        >
          Six capabilities that work together as one governed system — not six tools duct-taped together
        </motion.p>

        <motion.div
          className="grid md:grid-cols-2 gap-6"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {capabilities.map((item) => (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              className="card rounded-xl p-8"
            >
              <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
              <p className="text-[#a1a1aa] leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
