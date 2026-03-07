'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

interface ClutchStrikeProps {
  posterior: number
  compositeScore: number
  socialEngines: string[]
  onDismiss: () => void
}

export default function ClutchStrike({
  posterior,
  compositeScore,
  socialEngines,
  onDismiss,
}: ClutchStrikeProps) {
  const prefersReducedMotion = useReducedMotion()
  const delay = prefersReducedMotion ? 0 : undefined

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
      >
        <div className="text-center max-w-lg px-6">
          {/* Gate checkmarks */}
          <div className="flex justify-center gap-6 mb-8">
            {['Certainty', 'Variance', 'Pulse'].map((gate, i) => (
              <motion.div
                key={gate}
                className="flex flex-col items-center gap-2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: delay ?? 0.3 + i * 0.5,
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }}
              >
                <div
                  className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center"
                  style={{ boxShadow: '0 0 20px rgba(34, 197, 94, 0.4)' }}
                >
                  <ShieldCheck className="text-green-400" size={24} />
                </div>
                <span className="text-xs text-green-400 font-mono">{gate}</span>
              </motion.div>
            ))}
          </div>

          {/* CLUTCH STRIKE text */}
          <motion.h1
            className="text-5xl md:text-6xl font-bold text-white mb-6"
            style={{
              textShadow:
                '0 0 40px rgba(59, 130, 246, 0.8), 0 0 80px rgba(59, 130, 246, 0.4)',
            }}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: delay ?? 1.8,
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
          >
            CLUTCH STRIKE
          </motion.h1>

          {/* Scores */}
          <motion.div
            className="flex justify-center gap-8 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay ?? 2.3, duration: prefersReducedMotion ? 0 : 0.5 }}
          >
            <div>
              <div className="font-mono text-3xl font-bold text-[#eab308]">
                {posterior.toFixed(4)}
              </div>
              <div className="text-xs text-[#a1a1aa] mt-1">Posterior</div>
            </div>
            <div>
              <div className="font-mono text-3xl font-bold text-[#eab308]">
                {compositeScore.toFixed(1)}
              </div>
              <div className="text-xs text-[#a1a1aa] mt-1">Composite</div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-sm text-[#a1a1aa] mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay ?? 2.6, duration: prefersReducedMotion ? 0 : 0.4 }}
          >
            Autonomous action authorized — immediate human escalation
          </motion.p>

          {/* Engines */}
          <motion.div
            className="flex flex-wrap justify-center gap-2 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay ?? 2.8, duration: prefersReducedMotion ? 0 : 0.4 }}
          >
            {socialEngines.map((engine) => (
              <span
                key={engine}
                className="text-xs font-mono px-2 py-1 rounded bg-[#27272a] text-[#a1a1aa]"
              >
                {engine}
              </span>
            ))}
          </motion.div>

          {/* Continue button */}
          <motion.button
            onClick={onDismiss}
            className="btn-primary px-8 py-3 rounded-lg text-white font-medium"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay ?? 3.2, duration: prefersReducedMotion ? 0 : 0.4 }}
          >
            Continue
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
