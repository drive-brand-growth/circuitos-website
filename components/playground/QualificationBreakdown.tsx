'use client'

import { motion } from 'framer-motion'
import type { CompositeScore } from '@/lib/revenue-physics'

interface QualificationBreakdownProps {
  compositeScore: CompositeScore
}

const BARS = [
  { key: 'bayesian' as const, label: 'Bayesian', weight: '40%', color: '#3b82f6' },
  { key: 'financial' as const, label: 'Financial', weight: '25%', color: '#22c55e' },
  { key: 'philExperience' as const, label: 'Authority/Fit', weight: '20%', color: '#a855f7' },
  { key: 'engagement' as const, label: 'Engagement', weight: '15%', color: '#f97316' },
] as const

export default function QualificationBreakdown({ compositeScore }: QualificationBreakdownProps) {
  return (
    <div className="bg-[#1a1a1a] border border-[#27272a] rounded-xl p-6">
      <h4 className="font-medium text-white mb-1">Qualification Score</h4>

      {/* Total composite score */}
      <p
        className="text-3xl font-bold text-white mb-6"
        style={{ fontFamily: 'JetBrains Mono, monospace' }}
      >
        {compositeScore.total.toFixed(1)}{' '}
        <span className="text-base font-normal text-[#a1a1aa]">/ 100</span>
      </p>

      {/* Component bars */}
      <div className="space-y-4">
        {BARS.map(({ key, label, weight, color }) => {
          const value = compositeScore[key]

          return (
            <div key={key} className="flex items-center gap-3">
              {/* Label */}
              <div className="w-28 flex-shrink-0">
                <span className="text-sm text-[#a1a1aa]">{label}</span>
                <span className="text-xs text-zinc-600 ml-1">({weight})</span>
              </div>

              {/* Bar track */}
              <div className="flex-1 h-3 bg-[#27272a] rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(1, value * 100)}%` }}
                  transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                />
              </div>

              {/* Numeric value */}
              <span
                className="w-12 text-right text-sm text-white"
                style={{ fontFamily: 'JetBrains Mono, monospace' }}
              >
                {value.toFixed(2)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
