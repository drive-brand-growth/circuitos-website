'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react'

interface AutonomyPanelProps {
  posterior: number
  compositeScore: number
}

const THRESHOLDS = [
  { label: 'Critical — Autonomous', value: 0.92, riskClass: 'CRITICAL' },
  { label: 'Type 1 — Autonomous', value: 0.88, riskClass: 'HIGH' },
  { label: 'Critical — Escalate', value: 0.85, riskClass: 'CRITICAL' },
  { label: 'Type 1 — Escalate', value: 0.80, riskClass: 'HIGH' },
  { label: 'Type 2 — Autonomous', value: 0.78, riskClass: 'MEDIUM' },
  { label: 'Type 2 — Escalate', value: 0.65, riskClass: 'LOW' },
]

function resolveDecision(posterior: number): {
  decision: string
  color: string
  icon: typeof ShieldCheck
  description: string
} {
  if (posterior >= 0.88)
    return { decision: 'EXECUTE', color: '#22c55e', icon: ShieldCheck, description: 'Autonomous execution authorized — confidence exceeds threshold' }
  if (posterior >= 0.78)
    return { decision: 'EXECUTE (Type 2)', color: '#22c55e', icon: ShieldCheck, description: 'Type 2 autonomous — lower risk actions permitted' }
  if (posterior >= 0.65)
    return { decision: 'ESCALATE', color: '#f59e0b', icon: ShieldAlert, description: 'Confidence below autonomous threshold — human approval required' }
  return { decision: 'BLOCK', color: '#ef4444', icon: ShieldX, description: 'Insufficient confidence — action blocked pending review' }
}

export default function AutonomyPanel({ posterior, compositeScore }: AutonomyPanelProps) {
  const resolved = resolveDecision(posterior)
  const Icon = resolved.icon
  const posteriorPct = posterior * 100

  return (
    <div className="bg-[#1a1a1a] border border-[#27272a] rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-white">Autonomy Gate</h3>
        <motion.span
          key={resolved.decision}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full"
          style={{
            backgroundColor: `${resolved.color}15`,
            color: resolved.color,
            border: `1px solid ${resolved.color}30`,
          }}
        >
          <Icon size={12} />
          {resolved.decision}
        </motion.span>
      </div>

      {/* Confidence bar with threshold markers */}
      <div className="relative mb-6">
        <div className="h-3 bg-[#09090b] rounded-full overflow-hidden relative">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: resolved.color }}
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(posteriorPct, 100)}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          {/* Threshold markers */}
          {THRESHOLDS.filter(t => t.riskClass === 'MEDIUM' || t.riskClass === 'HIGH').slice(0, 3).map((t) => (
            <div
              key={t.label}
              className="absolute top-0 h-full w-px bg-white/20"
              style={{ left: `${t.value * 100}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-[#71717a]">0%</span>
          <span className="text-[10px] font-mono text-[#a1a1aa]">{posteriorPct.toFixed(1)}%</span>
          <span className="text-[10px] text-[#71717a]">100%</span>
        </div>
      </div>

      {/* Description */}
      <motion.p
        key={resolved.description}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-xs text-[#a1a1aa] mb-4"
      >
        {resolved.description}
      </motion.p>

      {/* Threshold reference */}
      <div className="space-y-1.5 border-t border-[#27272a] pt-4">
        {THRESHOLDS.map(({ label, value, riskClass }) => {
          const isActive = Math.abs(posterior - value) < 0.05
          const isPassed = posterior >= value
          return (
            <div
              key={label}
              className={`flex items-center justify-between text-xs px-2 py-1 rounded ${
                isActive ? 'bg-blue-500/10' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: isPassed ? '#22c55e' : riskClass === 'CRITICAL' ? '#ef4444' : '#71717a',
                  }}
                />
                <span className={`${isPassed ? 'text-[#a1a1aa]' : 'text-[#52525b]'}`}>{label}</span>
              </div>
              <span className={`font-mono ${isPassed ? 'text-white' : 'text-[#52525b]'}`}>
                {(value * 100).toFixed(0)}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
