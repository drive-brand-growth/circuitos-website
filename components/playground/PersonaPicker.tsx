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
      {personaIds.map((id) => {
        const persona = PERSONAS[id]
        return (
          <motion.button
            key={id}
            variants={item}
            onClick={() => onSelect(id)}
            className="bg-[#1a1a1a] border border-[#27272a] rounded-xl p-6 text-left hover:border-blue-500/50 cursor-pointer transition-colors"
          >
            <h3 className="text-white font-bold text-lg">{persona.name}</h3>
            <p className="text-[#a1a1aa] text-sm mt-1">{persona.tagline}</p>

            <div className="mt-4 flex items-center gap-4">
              <span className="font-mono text-blue-400 text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                {Math.round(persona.prior * 100)}% Prior
              </span>
              <span className="font-mono text-[#a1a1aa] text-sm" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                &lambda; = {persona.decayRate.toFixed(3)}
              </span>
            </div>

            <p className="text-[#a1a1aa] text-sm mt-4 leading-relaxed">
              {persona.description}
            </p>

            <p className="text-zinc-500 text-xs mt-3 border-t border-[#27272a] pt-3">
              {persona.qualificationProfile}
            </p>
          </motion.button>
        )
      })}
    </motion.div>
  )
}
