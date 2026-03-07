'use client'

import { motion } from 'framer-motion'
import { Check, Zap, AlertTriangle } from 'lucide-react'
import { SIGNALS, type SignalCategory } from '@/lib/revenue-physics'

interface SignalBoardProps {
  firedSignalIds: string[]
  onFireSignal: (signalId: string) => void
  disabled: boolean
}

const CATEGORY_CONFIG: Record<SignalCategory, { label: string; color: string; textColor: string; borderColor: string }> = {
  financial: { label: 'Financial', color: 'bg-green-500/10', textColor: 'text-green-400', borderColor: 'border-green-500/30' },
  authority: { label: 'Authority', color: 'bg-blue-500/10', textColor: 'text-blue-400', borderColor: 'border-blue-500/30' },
  fit: { label: 'Product Fit', color: 'bg-purple-500/10', textColor: 'text-purple-400', borderColor: 'border-purple-500/30' },
  engagement: { label: 'Engagement', color: 'bg-orange-500/10', textColor: 'text-orange-400', borderColor: 'border-orange-500/30' },
  market: { label: 'Market', color: 'bg-cyan-500/10', textColor: 'text-cyan-400', borderColor: 'border-cyan-500/30' },
  negative: { label: 'Negative', color: 'bg-red-500/10', textColor: 'text-red-400', borderColor: 'border-red-500/30' },
}

const CATEGORY_ORDER: SignalCategory[] = ['financial', 'authority', 'fit', 'engagement', 'market', 'negative']

export default function SignalBoard({ firedSignalIds, onFireSignal, disabled }: SignalBoardProps) {
  const grouped = CATEGORY_ORDER.map((category) => ({
    category,
    config: CATEGORY_CONFIG[category],
    signals: SIGNALS.filter((s) => s.category === category),
  }))

  return (
    <div className={`space-y-6 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      {grouped.map(({ category, config, signals }) => (
        <div key={category}>
          <div className={`flex items-center gap-2 mb-3 px-2`}>
            {category === 'negative' ? (
              <AlertTriangle className={`w-4 h-4 ${config.textColor}`} />
            ) : (
              <Zap className={`w-4 h-4 ${config.textColor}`} />
            )}
            <h4 className={`text-sm font-semibold uppercase tracking-wider ${config.textColor}`}>
              {config.label}
            </h4>
          </div>

          <div className="space-y-2">
            {signals.map((signal) => {
              const isFired = firedSignalIds.includes(signal.id)
              const isNegative = signal.category === 'negative'

              return (
                <motion.button
                  key={signal.id}
                  onClick={() => !isFired && onFireSignal(signal.id)}
                  disabled={isFired || disabled}
                  whileTap={!isFired && !disabled ? { scale: 0.98 } : undefined}
                  className={`
                    w-full flex items-center justify-between
                    bg-[#1a1a1a] border rounded-lg px-4 py-3
                    transition-colors text-left
                    ${isFired
                      ? 'border-[#27272a] opacity-50 cursor-default'
                      : isNegative
                        ? 'border-red-500/20 hover:border-red-500/50 cursor-pointer'
                        : 'border-[#27272a] hover:border-blue-500/50 cursor-pointer'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    {isFired ? (
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    ) : isNegative ? (
                      <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                    ) : (
                      <Zap className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${isFired ? 'text-zinc-500' : 'text-white'}`}>
                      {signal.label}
                    </span>
                  </div>

                  <span
                    className={`text-xs ${isNegative ? 'text-red-400' : 'text-zinc-400'}`}
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                  >
                    LR {signal.likelihoodRatio.toFixed(1)}
                  </span>
                </motion.button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
