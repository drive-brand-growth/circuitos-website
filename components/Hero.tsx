'use client'

import { motion } from 'framer-motion'
import DashboardPreview from './DashboardPreview'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
}

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
}

export default function Hero() {
  return (
    <section id="main-content" className="pt-36 pb-24 px-8 sm:px-12 md:px-6 hero-glow overflow-hidden">
      <motion.div
        className="max-w-4xl mx-auto text-center px-2 sm:px-0"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        <motion.div
          variants={fadeInUp}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#27272a] bg-[#27272a]/30 text-sm text-[#a1a1aa] mb-8"
        >
          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
          Governed AI decisioning &mdash; running live in production
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold gradient-text mb-8 hero-headline"
        >
          Which deals close.<br />Which marketing works. Proven.
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-2xl mx-auto mb-6 leading-[1.5] font-medium"
        >
          Governed AI that proves every decision &mdash; before the outcome is in.
        </motion.p>

        <motion.p
          variants={fadeInUp}
          className="text-base sm:text-lg text-[#a1a1aa] max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          CircuitOS scores with calibrated confidence, acts within governed rules, and gives you a signed audit trail every time.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-2"
        >
          <a href="/demo" className="w-full sm:w-auto px-8 py-3.5 btn-primary text-white rounded-lg font-semibold text-base">
            See It In Action
          </a>
          <a href="#how-it-works" className="w-full sm:w-auto px-8 py-3.5 border border-[#27272a] rounded-lg font-semibold hover:bg-white/5 transition-colors text-base">
            How It Works
          </a>
          <a href="#the-truth" className="w-full sm:w-auto px-8 py-3.5 text-[#a1a1aa] hover:text-white transition-colors text-sm font-medium underline-offset-4 hover:underline">
            How we&apos;re different
          </a>
        </motion.div>
      </motion.div>

      <DashboardPreview />
    </section>
  )
}
