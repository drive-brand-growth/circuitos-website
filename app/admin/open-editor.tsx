'use client'

import { useEffect } from 'react'

export default function OpenEditor() {
  useEffect(() => {
    window.location.replace('/keystatic')
  }, [])

  return (
    <main className="mx-auto max-w-3xl px-6 py-36">
      <p className="text-lg text-[#a1a1aa]">Opening the editor.</p>
    </main>
  )
}
