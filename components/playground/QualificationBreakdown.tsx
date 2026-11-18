'use client'

import { motion } from 'framer-motion'
import type { CompositeScore } from '@/lib/revenue-physics'

interface QualificationBreakdownProps {
  compositeScore: CompositeScore
}

const BARS = [
  { key: 'bayesian' as const, label: 'Bayesian', weight: '25%', color: '#d4d4d4' },
  { key: 'financial' as const, label: 'Financial', weight: '25%', color: '#22c55e' },
  { key: 'philExperience' as const, label: 'Authority and fit', weight: '25%', color: '#a855f7' },
  { key: 'engagement' as const, label: 'Engagement', weight: '25%', color: '#f97316' },
] as const

export default function QualificationBreakdown({ compositeScore }: QualificationBreakdownProps) {
  return (
    <div className="bg-surface border border-line rounded-xl p-6">
      <h4 className="font-medium text-fg mb-1">Qualification score</h4>
      <p className="text-xs text-subtle mb-4">Example weights only. These bars are not a live score.</p>

      {/* Total composite score */}
      <p
        className="text-3xl font-bold text-fg mb-6"
        style={{ fontFamily: 'var(--font-mono), monospace' }}
      >
        {compositeScore.total.toFixed(1)}{' '}
        <span className="text-base font-normal text-muted">/ 100</span>
      </p>

      {/* Component bars */}
      <div className="space-y-4">
        {BARS.map(({ key, label, weight, color }) => {
          const value = compositeScore[key]

          return (
            <div key={key} className="flex items-center gap-3">
              {/* Label */}
              <div className="w-28 flex-shrink-0">
                <span className="text-sm text-muted">{label}</span>
                <span className="text-xs text-faint ml-1">({weight})</span>
              </div>

              {/* Bar track */}
              <div className="flex-1 h-3 bg-line rounded-full overflow-hidden">
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
                className="w-12 text-right text-sm text-fg"
                style={{ fontFamily: 'var(--font-mono), monospace' }}
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
