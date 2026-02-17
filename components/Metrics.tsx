'use client'

import { motion } from 'framer-motion'

const metrics = [
  { value: '6', label: 'Live Verticals' },
  { value: '72', label: 'Scoring Signals' },
  { value: 'Day 1', label: 'Intelligent Scoring' },
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
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
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
