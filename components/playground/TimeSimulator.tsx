'use client'

import { applyDecay } from '@/lib/revenue-physics'

interface TimeSimulatorProps {
  currentTime: number
  posterior: number
  decayRate: number
  onAdvance: (hours: number) => void
}

const TIME_STEPS = [1, 4, 12, 24]

export default function TimeSimulator({
  currentTime,
  posterior,
  decayRate,
  onAdvance,
}: TimeSimulatorProps) {
  return (
    <div className="bg-surface border border-line rounded-xl p-6">
      <h3 className="font-medium text-fg mb-1">Ground · before an outcome</h3>
      <p className="text-xs text-subtle mb-4">Odds fade when nothing new arrives. The fade rate is an example value. This is not a score.</p>

      {/* Current time display */}
      <div className="font-mono text-2xl text-fg mb-6 text-center">
        T + {currentTime.toFixed(1)}h
      </div>

      {/* Advance buttons */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {TIME_STEPS.map(h => (
          <button
            key={h}
            onClick={() => onAdvance(h)}
            className="bg-line hover:bg-line-strong rounded-lg px-4 py-2 font-mono text-sm text-fg transition-colors"
          >
            +{h}h
          </button>
        ))}
      </div>

      {/* Decay preview */}
      <div className="border-t border-line pt-4">
        <p className="text-xs text-subtle mb-2 font-mono">Example fade preview</p>
        <div className="grid grid-cols-4 gap-2">
          {TIME_STEPS.map(h => {
            const decayed = applyDecay(posterior, decayRate, h)
            const loss = posterior - decayed
            return (
              <div
                key={h}
                className="text-center font-mono text-xs"
              >
                <div className="text-muted">+{h}h</div>
                <div className="text-fg">{decayed.toFixed(4)}</div>
                <div className="text-red-400">-{loss.toFixed(4)}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
