'use client'

import { motion } from 'framer-motion'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.08 } }
}

const capabilities = [
  {
    category: 'Intelligence',
    items: [
      { title: 'Predictive Lead Scoring', desc: 'Your ICP and qualification criteria encoded before launch. Every lead scored against YOUR definition of qualified — no cold start, no wasted spend' },
      { title: 'Multi-Source Enrichment', desc: 'Six data sources verify and enhance every prospect profile automatically' },
      { title: 'Conversation Memory', desc: 'Vector-based semantic memory recalls context across every interaction' },
    ]
  },
  {
    category: 'Automation',
    items: [
      { title: 'Email Sequences', desc: 'AI-generated outreach in your brand voice with governance-gated sending' },
      { title: 'Social Distribution', desc: 'Blog to social pipeline across Facebook, Instagram, X, and Google Business' },
      { title: 'Calendar Booking', desc: 'Smart appointment scheduling with intelligent slot selection' },
    ]
  },
  {
    category: 'Content',
    items: [
      { title: 'AI Blog Generation', desc: 'Full articles with source verification, fact-checking, and brand voice compliance' },
      { title: 'Proprietary Quality Assurance', desc: 'Multi-model inference evaluates readability, competitive uniqueness, and brand voice before publish' },
      { title: 'UGC Pipeline', desc: 'User-generated content collection, AI enhancement, and publication workflow' },
    ]
  },
  {
    category: 'Infrastructure',
    items: [
      { title: 'Isolated Environments', desc: 'Each vertical runs in its own containerized stack with dedicated database' },
      { title: 'Native Integrations', desc: 'GoHighLevel, Instantly.ai, GA4, and full REST API with webhook support' },
      { title: 'Background Processing', desc: 'Async job scheduling, retry queues, and cache management built in' },
    ]
  },
  {
    category: 'Governance',
    items: [
      { title: 'Human-in-the-Loop', desc: 'Every outbound action requires explicit approval. Nothing sends without your sign-off' },
      { title: 'Approval Workflows', desc: 'Confidence-based escalation gates route decisions to the right reviewer' },
      { title: 'Full Audit Trail', desc: 'Every scoring decision, every email sent, every approval logged and exportable' },
    ]
  },
  {
    category: 'Analytics',
    items: [
      { title: 'GA4 Feedback Loop', desc: 'Real engagement data flows back into the scoring model automatically' },
      { title: 'Performance Reports', desc: 'Monthly intelligence briefs with trends, recommendations, and outcomes' },
      { title: 'A/B Testing', desc: 'Built-in variant testing for email subject lines, content, and send timing' },
    ]
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
          Everything you need
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[#a1a1aa] text-center mb-16 text-lg max-w-2xl mx-auto"
        >
          Six capability layers that work together as one system
        </motion.p>

        <div className="space-y-12">
          {capabilities.map((group) => (
            <div key={group.category}>
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-widest mb-4">{group.category}</h3>
              <motion.div
                className="grid md:grid-cols-3 gap-4"
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
                variants={staggerContainer}
              >
                {group.items.map((item) => (
                  <motion.div
                    key={item.title}
                    variants={fadeInUp}
                    className="card rounded-xl p-6"
                  >
                    <h4 className="text-base font-semibold mb-2">{item.title}</h4>
                    <p className="text-[#a1a1aa] text-sm leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
