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
    desc: 'Your qualification criteria and demand patterns are encoded before launch. Every lead gets scored on fit, intent, and timing. Your team works the right prospects immediately.',
  },
  {
    title: 'Personalized outreach in your brand voice',
    desc: 'AI writes emails that match how your team actually talks. Each prospect gets a tailored sequence based on their score and profile. You review and approve before anything sends.',
  },
  {
    title: 'Content generated, scored, and published in hours',
    desc: 'Blog posts written, fact-checked against real sources, and scored for quality by multiple AI models. Social distribution across four channels. All with your sign-off.',
  },
  {
    title: 'One system from lead to closed deal',
    desc: 'Scoring, outreach, content, CRM, and analytics in a single pipeline. No duct-taping five platforms together. One place to see what\'s working and why.',
  },
  {
    title: 'Every outcome improves the next prediction',
    desc: 'Real engagement data feeds back into the model automatically. Open rates, reply rates, conversions, GA4 metrics. The system learns from every cycle.',
  },
  {
    title: 'Human approval on every action',
    desc: 'Every email, blog post, and social update goes through approval gates. Confidence-based escalation routes edge cases to the right reviewer. Full audit trail on every decision.',
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
          Six capabilities that work together as one system
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
