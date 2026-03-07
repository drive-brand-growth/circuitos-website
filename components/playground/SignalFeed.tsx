'use client'

import { useEffect, useRef } from 'react'
import type { FiredSignalEntry } from '@/lib/revenue-physics'
import { ENGINES } from '@/lib/revenue-physics'

interface SignalFeedProps {
  entries: FiredSignalEntry[]
}

function getEngineColor(engineName: string): string {
  const engine = ENGINES.find(e => e.name === engineName)
  return engine?.color ?? '#a1a1aa'
}

export default function SignalFeed({ entries }: SignalFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [entries.length])

  return (
    <div className="bg-[#1a1a1a] border border-[#27272a] rounded-xl overflow-hidden">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#27272a]">
        <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
        <span className="text-sm font-medium text-white">Signal Feed</span>
      </div>

      {/* Terminal body */}
      <div
        ref={scrollRef}
        className="bg-black/50 max-h-[300px] overflow-y-auto p-4 font-mono text-xs leading-relaxed"
      >
        {entries.length === 0 && (
          <span className="text-[#52525b]">Awaiting signals...</span>
        )}
        {entries.map((entry, i) => {
          const isNegative = entry.signal.likelihoodRatio < 1
          const prevPosterior = i > 0 ? entries[i - 1].posteriorAfter : 0
          const posteriorUp = entry.posteriorAfter >= prevPosterior
          const primaryEngine = entry.engines[0]

          return (
            <div key={entry.signal.id} className="flex flex-wrap gap-x-1">
              <span className="text-[#71717a]">
                [T+{entry.time.toFixed(1)}h]
              </span>
              <span className={isNegative ? 'text-red-400' : 'text-[#71717a]'}>
                {isNegative ? '▼' : '▶'}
              </span>
              <span className={isNegative ? 'text-red-400' : 'text-white'}>
                {entry.signal.label}
              </span>
              <span className="text-yellow-400">
                (LR {entry.signal.likelihoodRatio.toFixed(1)})
              </span>
              <span className="text-[#71717a]">&rarr;</span>
              <span className={posteriorUp ? 'text-green-400' : 'text-red-400'}>
                P={entry.posteriorAfter.toFixed(4)}
              </span>
              {primaryEngine && (
                <span style={{ color: getEngineColor(primaryEngine) }}>
                  [{primaryEngine}]
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
