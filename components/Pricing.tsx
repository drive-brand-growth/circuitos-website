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
    build: '$15,000',
    monthly: '$1,500',
    desc: 'Single vertical',
    features: [
      'Predictive lead scoring (72+ signals)',
      'Automated email sequences',
      'CRM integration',
      'Full audit trail',
      'Human approval gates',
      'Content intelligence engine',
    ],
  },
  {
    name: 'Growth',
    build: '$30,000',
    monthly: '$3,500',
    desc: '2–3 verticals',
    features: [
      'Everything in Starter',
      'Multi-source enrichment',
      'AI blog & social generation',
      'Closed-loop ML feedback',
      'Isolated infrastructure per vertical',
      'Priority support & quarterly reviews',
    ],
    popular: true,
  },
  {
    name: 'Enterprise',
    build: '$50,000+',
    monthly: '$7,500',
    desc: 'Unlimited verticals',
    features: [
      'Everything in Growth',
      'Unlimited vertical stacks',
      'Custom integrations & API access',
      'Dedicated infrastructure',
      'Compliance & governance package',
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
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-[-0.02em]">Pricing</h2>
          <p className="text-[#a1a1aa] text-lg">One-time build + monthly platform fee</p>
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
              <div className="mt-6 mb-2">
                <span className="text-4xl font-bold">{plan.build}</span>
                <span className="text-[#a1a1aa] text-sm ml-2">build</span>
              </div>
              <div className="mb-8">
                <span className="text-2xl font-semibold">{plan.monthly}</span>
                <span className="text-[#a1a1aa] text-sm ml-1">/month</span>
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
                Get Started
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
