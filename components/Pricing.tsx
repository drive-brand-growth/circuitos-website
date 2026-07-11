'use client'

import { motion } from 'framer-motion'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
}

const plans = [
  {
    name: 'Growth',
    monthly: '$3,500',
    desc: 'One revenue line. Every AI action requires human approval before execution.',
    cta: 'See It In Action',
    features: [
      'Calibrated deal and lead scoring, tuned to your ICP',
      'Deal risk flags before the slip',
      'CRM integration (any platform)',
      'Human approval gates on all actions',
      'Full audit trail on every decision',
      'Email & chat support',
      'Add-ons available: outreach, content, enrichment',
    ],
  },
  {
    name: 'Scale',
    monthly: '$6,500',
    desc: 'Multiple revenue lines, or confidence-based autonomy. Low-risk actions execute automatically; high-risk actions escalate to a human.',
    cta: 'See It In Action',
    features: [
      'Everything in Growth',
      'Governed Act: low-risk auto-executes, high-risk escalates',
      'Multi-touch attribution + closed-loop feedback (GA4)',
      'Isolated infrastructure per business line',
      'AgentOps governance dashboard',
      'Outreach, content, and social modules available',
      'Priority support & quarterly reviews',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    monthly: 'From $12,000',
    desc: 'Sovereign deployment. The decision loop runs on your infrastructure, on dedicated models. Your data never leaves.',
    cta: 'Contact Us',
    features: [
      'Everything in Scale',
      'Sovereign option: local models on your infrastructure, no external AI APIs in the loop',
      'Custom CRM & API integrations',
      'Dedicated infrastructure',
      'Security pack: NIST CSF-informed controls, PII redaction, cost circuit breakers',
      'Custom model calibration & SLA',
      'Dedicated success manager',
    ],
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="section-padding px-6 border-t border-[#27272a]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-[-0.02em]">Governed AI. Mid-market pricing.</h2>
          <p className="text-[#a1a1aa] text-lg">Built for $10M to $50M operators who need auditable decisioning: revenue leaders who can&apos;t hire a data science bench, but still have to defend every move to a board, partner, or regulator.</p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={fadeInUp}
              className={`card rounded-xl p-8 ${plan.popular ? 'border-blue-500/50 bg-blue-500/5' : ''}`}
            >
              {plan.popular && (
                <span className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full font-medium">Most Popular</span>
              )}
              <h3 className="text-2xl font-semibold mt-5">{plan.name}</h3>
              <p className="text-sm text-[#a1a1aa] mt-1">{plan.desc}</p>
              <div className="mt-6 mb-8">
                <span className="text-4xl font-bold">{plan.monthly}</span>
                {plan.monthly !== 'Custom' && <span className="text-[#a1a1aa] text-sm ml-1">/month</span>}
              </div>
              <ul className="space-y-4 text-sm pt-8 border-t border-[#27272a]">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-[#a1a1aa]">
                    <span className="text-blue-500">&#10003;</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href={plan.name === 'Enterprise' ? '/demo' : '/playground'}
                className={`block text-center mt-10 py-3 rounded-lg font-semibold transition-all ${
                  plan.popular ? 'btn-primary text-white' : 'border border-[#27272a] hover:bg-white/5'
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
