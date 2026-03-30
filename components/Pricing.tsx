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
    desc: 'For revenue teams ready to automate scoring, outreach, and attribution across one business line',
    cta: 'See It In Action',
    features: [
      'Predictive lead scoring (72+ signals)',
      'Pre-calibrated to your ICP from day one',
      'Automated outreach in your brand voice',
      'CRM integration (any platform)',
      'Human approval gates on all actions',
      'Content intelligence engine',
      'Full audit trail on every decision',
      'Email & chat support',
    ],
  },
  {
    name: 'Scale',
    monthly: '$6,500',
    desc: 'For companies running multiple revenue lines that need isolated scoring, attribution, and governance',
    cta: 'See It In Action',
    features: [
      'Everything in Growth',
      'Multi-vertical scoring models',
      'Isolated infrastructure per business line',
      'Multi-source lead enrichment',
      'AI content generation with fact-checking',
      'Closed-loop performance feedback (GA4)',
      'AgentOps governance dashboard',
      'Automated social distribution (4 channels)',
      'Priority support & quarterly reviews',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    monthly: '$12,000',
    desc: 'For organizations with complex operations that need full autonomy governance, custom integrations, and SLA',
    cta: 'Contact Us',
    features: [
      'Everything in Scale',
      'Unlimited vertical stacks',
      'Custom CRM & API integrations',
      'Dedicated infrastructure',
      'Compliance & governance package',
      'Token cost tracking & attribution',
      'Dedicated success manager',
      'Custom model calibration',
      'SLA & uptime guarantees',
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-[-0.02em]">Enterprise-grade. Mid-market pricing.</h2>
          <p className="text-[#a1a1aa] text-lg mb-6">Built for $10M–$50M businesses that want real revenue intelligence — not another dashboard.</p>
          <a
            href="/pilot"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-blue-500/50 bg-blue-500/10 text-blue-400 font-semibold text-sm hover:bg-blue-500/20 hover:border-blue-500 transition-all"
          >
            Start with a $1,500 Pilot — 50 leads, 30 days, prove the value first
          </a>
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
