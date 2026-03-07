'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ENGINES, type SocialEnrichment, type EngineName } from '@/lib/revenue-physics'

interface SocialEnginePanelProps {
  socialEnrichments: SocialEnrichment[]
  latestSignalEngines: EngineName[]
}

export default function SocialEnginePanel({ socialEnrichments, latestSignalEngines }: SocialEnginePanelProps) {
  return (
    <div>
      <h4 className="text-sm font-medium text-[#a1a1aa] uppercase tracking-wider mb-3">
        Social Intelligence Engines
      </h4>

      <div className="flex flex-wrap gap-3">
        {ENGINES.map((engine) => {
          const enrichments = socialEnrichments.filter((e) => e.engine === engine.name)
          const isActive = latestSignalEngines.includes(engine.name)
          const hasData = enrichments.length > 0
          const latestResult = hasData ? enrichments[enrichments.length - 1].result : null

          return (
            <div
              key={engine.name}
              className="bg-[#1a1a1a]/50 border border-[#27272a] rounded-lg p-3 text-center flex-grow"
              style={{ minWidth: 150 }}
            >
              {/* Circle icon */}
              <div className="flex justify-center mb-2">
                <div
                  className="w-10 h-10 rounded-full border-2 flex items-center justify-center"
                  style={{ borderColor: engine.color }}
                >
                  <span
                    className="text-xs font-bold"
                    style={{ color: engine.color }}
                  >
                    {engine.name[0].toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Engine name */}
              <p className="text-sm font-medium text-white mb-1">{engine.displayName}</p>

              {/* Status indicator */}
              <div className="flex items-center justify-center gap-1.5 mb-2">
                {isActive ? (
                  <span className="relative flex h-2.5 w-2.5">
                    <span
                      className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
                      style={{ backgroundColor: engine.color }}
                    />
                    <span
                      className="relative inline-flex h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: engine.color }}
                    />
                  </span>
                ) : hasData ? (
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
                ) : (
                  <span className="inline-flex h-2.5 w-2.5 rounded-full bg-zinc-600" />
                )}
                <span className="text-xs text-[#a1a1aa]">
                  {isActive ? 'active' : hasData ? `${enrichments.length} result${enrichments.length !== 1 ? 's' : ''}` : 'idle'}
                </span>
              </div>

              {/* Latest enrichment text */}
              <AnimatePresence mode="wait">
                {latestResult && (
                  <motion.p
                    key={latestResult}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="text-xs text-zinc-500 truncate"
                    style={{ fontFamily: 'JetBrains Mono, monospace' }}
                    title={latestResult}
                  >
                    {latestResult}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
