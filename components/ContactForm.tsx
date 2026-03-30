'use client'

import { motion } from 'framer-motion'

export default function ContactForm() {
  return (
    <section id="contact" className="section-padding px-6 border-t border-[#27272a]">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-[-0.02em]">See how it works</h2>
          <p className="text-[#a1a1aa] mb-10 text-lg leading-[1.6] max-w-2xl mx-auto">
            We&apos;ll walk you through the full pipeline with your business context. Scoring, outreach, content, and analytics — personalized to your vertical.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <a
              href="/demo"
              className="w-full sm:w-auto px-8 py-4 btn-primary text-white rounded-lg font-semibold text-lg"
            >
              Book a Demo
            </a>
            <a
              href="mailto:hello@usecircuitos.com"
              className="w-full sm:w-auto px-8 py-4 border border-[#27272a] rounded-lg font-semibold hover:bg-white/5 transition-colors text-lg"
            >
              Email Us Directly
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-[#a1a1aa]">
            <span className="flex items-center gap-2">
              <span className="text-blue-500">&#10003;</span> 30-minute personalized walkthrough
            </span>
            <span className="flex items-center gap-2">
              <span className="text-blue-500">&#10003;</span> See real scoring with sample data
            </span>
            <span className="flex items-center gap-2">
              <span className="text-blue-500">&#10003;</span> No commitment required
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
