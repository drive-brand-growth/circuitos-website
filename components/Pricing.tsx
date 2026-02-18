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
    name: 'Starter',
    monthly: '$1,500',
    desc: 'For brands launching their first automated revenue engine',
    cta: 'Book a Demo',
    features: [
      'Predictive lead scoring (72+ signals)',
      'Pre-calibrated to your ICP from day one',
      'Automated email sequences in your brand voice',
      'CRM integration (GoHighLevel)',
      'Human approval gates on all outreach',
      'Content intelligence engine',
      'Full audit trail on every decision',
      'Email & chat support',
    ],
  },
  {
    name: 'Growth',
    monthly: '$3,500',
    desc: 'For brands scaling across multiple business lines',
    cta: 'Book a Demo',
    features: [
      'Everything in Starter',
      'Multi-source lead enrichment',
      'AI blog & social media generation',
      'GA4 closed-loop performance feedback',
      'Isolated infrastructure per vertical',
      'Multi-vertical scoring models',
      'Automated social distribution (4 channels)',
      'Priority support & quarterly reviews',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    monthly: 'Custom',
    desc: 'For organizations with complex, multi-brand operations',
    cta: 'Contact Sales',
    features: [
      'Everything in Growth',
      'Unlimited vertical stacks',
      'Custom integrations & API access',
      'Dedicated infrastructure',
      'Compliance & governance package',
      'Dedicated success manager',
      'Custom AI model training',
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-[-0.02em]">Plans that scale with your business</h2>
          <p className="text-[#a1a1aa] text-lg mb-5">One-time implementation fee applies</p>
          <a
            href="#build-calculator"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-blue-500/50 bg-blue-500/10 text-blue-400 font-semibold text-sm hover:bg-blue-500/20 hover:border-blue-500 transition-all"
          >
            Estimate Your Build
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
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
                href="/demo"
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
