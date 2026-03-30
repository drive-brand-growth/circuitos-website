'use client'

import { motion } from 'framer-motion'

interface PosteriorMeterProps {
  posterior: number
  logOdds: number
}

function getMeterColor(p: number): string {
  if (p >= 0.9) return '#eab308'
  if (p >= 0.6) return '#22c55e'
  if (p >= 0.3) return '#eab308'
  return '#ef4444'
}

export default function PosteriorMeter({ posterior, logOdds }: PosteriorMeterProps) {
  const color = getMeterColor(posterior)
  const widthPercent = Math.max(0, Math.min(100, posterior * 100))

  return (
    <div className="bg-[#1a1a1a] border border-[#27272a] rounded-xl p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h3 className="text-sm font-medium text-[#a1a1aa]">Conviction Score</h3>
        <span
          className="font-mono text-4xl font-bold"
          style={{ color }}
        >
          {posterior.toFixed(4)}
        </span>
      </div>

      <div className="h-3 bg-[#09090b] rounded-full overflow-hidden border border-[#27272a]">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          animate={{ width: `${widthPercent}%` }}
          transition={{ type: 'spring', stiffness: 80, damping: 20 }}
        />
      </div>

      <div className="mt-2 flex justify-between items-center">
        <span className="font-mono text-xs text-[#a1a1aa]">0</span>
        <span className="font-mono text-xs text-[#a1a1aa]">
          log-odds: {logOdds.toFixed(4)}
        </span>
        <span className="font-mono text-xs text-[#a1a1aa]">1</span>
      </div>
    </div>
  )
}
