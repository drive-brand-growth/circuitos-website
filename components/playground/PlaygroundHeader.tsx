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
    <div className="py-6 md:py-8">
      {kicker ? <p className="text-sm font-medium text-accent mb-3">{kicker}</p> : null}
      <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">{title}</h1>
      <p className="text-muted text-sm md:text-base max-w-2xl leading-relaxed">{lede}</p>

      {persona && (
        <div className="flex items-center gap-3 mt-4">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-accent/20 text-accent">
            {persona.name}
          </span>
          <button onClick={onReset} className="text-xs text-subtle hover:text-fg transition-colors">
            Reset
          </button>
        </div>
      )}
    </div>
  )
}
