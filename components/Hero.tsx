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
    <section id="main-content" className="pt-36 pb-24 px-8 sm:px-12 md:px-6 hero-glow">
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
          Battle-tested across 6 live verticals
        </motion.div>

        <motion.h1
          variants={fadeInUp}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold gradient-text mb-10 hero-headline"
        >
          Revenue intelligence<br />that learns
        </motion.h1>

        <motion.p
          variants={fadeInUp}
          className="text-lg sm:text-xl md:text-2xl text-[#a1a1aa] max-w-2xl mx-auto mb-10 leading-[1.6]"
        >
          AI scores every lead. Content writes itself. Outreach runs autonomously.
          Every outcome feeds back into the model. The system gets smarter with every cycle.
        </motion.p>

        <motion.div
          variants={fadeInUp}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <a href="/demo" className="w-full sm:w-auto px-8 py-3.5 btn-primary text-white rounded-lg font-semibold text-base">
            See It In Action
          </a>
          <a href="#how-it-works" className="w-full sm:w-auto px-8 py-3.5 border border-[#27272a] rounded-lg font-semibold hover:bg-white/5 transition-colors text-base">
            How It Works
          </a>
        </motion.div>
      </motion.div>

      <DashboardPreview />
    </section>
  )
}
