'use client'

import { motion } from 'framer-motion'
import { PERSONAS, type PersonaId } from '@/lib/revenue-physics'

interface PersonaPickerProps {
  onSelect: (personaId: PersonaId) => void
}

const container = {
  animate: { transition: { staggerChildren: 0.1 } },
}

const item = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

const personaIds: PersonaId[] = ['COLD_INBOUND', 'CONTENT_ENGAGED', 'WARM_REFERRAL', 'ENTERPRISE_RFP']

export default function PersonaPicker({ onSelect }: PersonaPickerProps) {
  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      variants={container}
      initial="initial"
      animate="animate"
    >
      <p className="md:col-span-2 lg:col-span-4 text-sm text-[#a1a1aa] leading-relaxed">
        Example data only. Starting odds and fade rates below are round illustrations. They are not live scoring settings.
      </p>
      {personaIds.map((id) => {
        const persona = PERSONAS[id]
        return (
          <motion.button
            key={id}
            variants={item}
            onClick={() => onSelect(id)}
            className="bg-surface border border-line rounded-xl p-6 text-left hover:border-accent/50 cursor-pointer transition-colors"
          >
            <h3 className="text-fg font-bold text-lg">{persona.name}</h3>
            <p className="text-muted text-sm mt-1">{persona.tagline}</p>

            <div className="mt-4 flex flex-col gap-1">
              <span className="font-mono text-accent text-sm" style={{ fontFamily: 'var(--font-mono), monospace' }}>
                Example starting odds: {Math.round(persona.prior * 100)}%
              </span>
              <span className="font-mono text-muted text-sm" style={{ fontFamily: 'var(--font-mono), monospace' }}>
                Example fade rate: {persona.decayRate.toFixed(2)} per hour
              </span>
            </div>

            <p className="text-muted text-sm mt-4 leading-relaxed">
              {persona.description}
            </p>

            <p className="text-subtle text-xs mt-3 border-t border-line pt-3">
              {persona.qualificationProfile}
            </p>
          </motion.button>
        )
      })}
    </motion.div>
  )
}
