'use client'

import { motion } from 'framer-motion'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.15 } }
}

const capabilities = [
  {
    title: 'Predictive scoring from day one',
    desc: 'Your qualification criteria are encoded before launch. Every lead scored on fit, intent, and timing across 72+ signals. No training period. Intelligent immediately.',
  },
  {
    title: 'Personalized outreach in your voice',
    desc: 'AI writes emails that match how your team talks. Each prospect gets a tailored sequence based on their score. You review and approve before anything sends.',
  },
  {
    title: 'Every action auditable. Every escalation earned.',
    desc: 'Confidence-based governance determines what the system handles alone and what gets routed to a human. Full decision trail on every score, every action, every outcome.',
  },
]

export default function Capabilities() {
  return (
    <section id="capabilities" className="section-padding px-6 border-t border-[#27272a]">
      <div className="max-w-5xl mx-auto">
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
          Three capabilities. One closed-loop system.
        </motion.p>

        <motion.div
          className="grid md:grid-cols-3 gap-6"
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
