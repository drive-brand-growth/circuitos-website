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

      {/* Pipeline Preview */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="max-w-3xl mx-auto mt-16"
      >
        <div className="code-block rounded-xl overflow-hidden glow">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-[#27272a]">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ef4444]/80"></div>
              <div className="w-3 h-3 rounded-full bg-[#eab308]/80"></div>
              <div className="w-3 h-3 rounded-full bg-[#22c55e]/80"></div>
            </div>
            <span className="ml-4 text-xs text-[#52525b]">circuitos — scoring pipeline</span>
          </div>
          <pre className="p-6 text-sm overflow-x-auto leading-relaxed">
            <code className="text-[#a1a1aa]">{`{
  `}<span className="text-white">"lead"</span>{`: `}<span className="text-green-400">"inbound_form"</span>{`,
  `}<span className="text-white">"score"</span>{`: `}<span className="text-blue-400">87.4</span>{`,
  `}<span className="text-white">"tier"</span>{`: `}<span className="text-green-400">"HIGH"</span>{`,
  `}<span className="text-white">"action"</span>{`: `}<span className="text-green-400">"route_to_rep"</span>{`,
  `}<span className="text-white">"enrichment"</span>{`: {
    `}<span className="text-white">"sources_checked"</span>{`: `}<span className="text-blue-400">6</span>{`,
    `}<span className="text-white">"web_presence"</span>{`: `}<span className="text-green-400">"verified"</span>{`,
    `}<span className="text-white">"confidence"</span>{`: `}<span className="text-blue-400">0.91</span>{`
  },
  `}<span className="text-white">"governance"</span>{`: `}<span className="text-green-400">"approved"</span>{`,
  `}<span className="text-white">"audit_trail"</span>{`: `}<span className="text-blue-400">true</span>{`
}`}</code>
          </pre>
        </div>
      </motion.div>
    </section>
  )
}
