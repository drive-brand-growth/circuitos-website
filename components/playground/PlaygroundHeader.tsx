'use client'

import type { Persona } from '@/lib/revenue-physics'

interface PlaygroundHeaderProps {
  persona: Persona | null
  onReset: () => void
  kicker: string
  title: string
  lede: string
}

export default function PlaygroundHeader({ persona, onReset, kicker, title, lede }: PlaygroundHeaderProps) {
  return (
    <div className="py-6 md:py-10">
      <p className="kicker mb-3">{kicker}</p>
      <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[var(--fg)] mb-4">
        {title}
      </h1>
      <p className="text-[var(--muted)] text-base md:text-lg max-w-2xl leading-relaxed">
        {lede}
      </p>

      {persona && (
        <div className="flex items-center gap-3 mt-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/10 text-white">
            {persona.name}
          </span>
          <button
            onClick={onReset}
            className="text-xs text-[#71717a] hover:text-white transition-colors"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  )
}
