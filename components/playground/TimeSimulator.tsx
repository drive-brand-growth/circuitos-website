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
    <div className="bg-[#1a1a1a] border border-[#27272a] rounded-xl p-6">
      <h3 className="font-medium text-white mb-4">Time Simulator</h3>

      {/* Current time display */}
      <div className="font-mono text-2xl text-white mb-6 text-center">
        T + {currentTime.toFixed(1)}h
      </div>

      {/* Advance buttons */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {TIME_STEPS.map(h => (
          <button
            key={h}
            onClick={() => onAdvance(h)}
            className="bg-[#27272a] hover:bg-[#3f3f46] rounded-lg px-4 py-2 font-mono text-sm text-white transition-colors"
          >
            +{h}h
          </button>
        ))}
      </div>

      {/* Decay preview */}
      <div className="border-t border-[#27272a] pt-4">
        <p className="text-xs text-[#71717a] mb-2 font-mono">Decay preview</p>
        <div className="grid grid-cols-4 gap-2">
          {TIME_STEPS.map(h => {
            const decayed = applyDecay(posterior, decayRate, h)
            const loss = posterior - decayed
            return (
              <div
                key={h}
                className="text-center font-mono text-xs"
              >
                <div className="text-[#a1a1aa]">+{h}h</div>
                <div className="text-white">{decayed.toFixed(4)}</div>
                <div className="text-red-400">-{loss.toFixed(4)}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
