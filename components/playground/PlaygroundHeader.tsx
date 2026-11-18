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
    <div className="pb-6 md:pb-8">
      {kicker ? <p className="eyebrow mb-5">{kicker}</p> : null}
      <h1 className="mb-5 text-title text-fg">{title}</h1>
      <p className="max-w-2xl text-lead text-muted">{lede}</p>

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
