'use client'

import { motion } from 'framer-motion'

const capabilities = [
  { label: 'Any CRM', desc: 'HubSpot, Salesforce, and more' },
  { label: 'Email Automation', desc: 'Sequences in your voice' },
  { label: 'Analytics', desc: 'Closed-loop GA4 feedback' },
  { label: 'Multi-Model AI', desc: 'Scoring, content, classification' },
  { label: 'REST API', desc: 'Webhooks + custom integrations' },
]

export default function IntegrationBar() {
  return (
    <section className="py-14 border-y border-[#27272a]">
      <div className="max-w-6xl mx-auto px-6">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-[#71717a] mb-10 uppercase tracking-widest"
        >
          Connects to your stack
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 md:gap-x-14"
        >
          {capabilities.map((item) => (
            <div key={item.label} className="group text-center">
              <span className="text-sm font-medium text-[#a1a1aa] group-hover:text-white transition-colors tracking-wide">
                {item.label}
              </span>
              <p className="text-[10px] text-[#52525b] mt-0.5">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
