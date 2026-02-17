'use client'

import { motion } from 'framer-motion'

const metrics = [
  { value: '6', label: 'Active Verticals' },
  { value: '1,200+', label: 'Automated Tests' },
  { value: '72', label: 'Scoring Signals' },
  { value: '3', label: 'Inference Engines' },
  { value: '6', label: 'Enrichment Sources' },
  { value: '24/7', label: 'Autonomous Operation' },
]

export default function Metrics() {
  return (
    <section className="py-16 px-6 border-t border-[#27272a]">
      <div className="max-w-6xl mx-auto">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-[#71717a] mb-10 uppercase tracking-widest"
        >
          By the numbers
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8"
        >
          {metrics.map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text-blue">{item.value}</div>
              <div className="text-sm text-[#a1a1aa] mt-1">{item.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
