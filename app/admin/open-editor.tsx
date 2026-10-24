'use client'

import { useEffect } from 'react'

export default function OpenEditor() {
  useEffect(() => {
    window.location.replace('/keystatic')
  }, [])

  return (
    <main className="mx-auto max-w-prose px-6 py-24">
      <p className="text-lg text-[var(--muted)]">Opening the editor.</p>
    </main>
  )
}
