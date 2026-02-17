'use client'

import { motion } from 'framer-motion'

const integrations = [
  { name: 'GoHighLevel', category: 'CRM' },
  { name: 'Instantly.ai', category: 'Outreach' },
  { name: 'Google Analytics', category: 'Analytics' },
  { name: 'Claude', category: 'AI' },
  { name: 'Gemini', category: 'AI' },
  { name: 'Perplexity', category: 'AI' },
  { name: 'OpenAI', category: 'Embeddings' },
  { name: 'PostgreSQL', category: 'Database' },
  { name: 'Redis', category: 'Cache' },
  { name: 'Docker', category: 'Infrastructure' },
  { name: 'n8n', category: 'Automation' },
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
          Built on production-grade infrastructure
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 md:gap-x-12"
        >
          {integrations.map((item) => (
            <div key={item.name} className="group flex items-center gap-2">
              <span className="text-sm font-semibold tracking-wide uppercase text-[#71717a] group-hover:text-[#a1a1aa] transition-colors">
                {item.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
