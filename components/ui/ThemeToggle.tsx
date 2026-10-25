'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggle() {
    const next = !document.documentElement.classList.contains('dark')
    document.documentElement.classList.toggle('dark', next)
    document.documentElement.style.colorScheme = next ? 'dark' : 'light'
    localStorage.setItem('theme', next ? 'dark' : 'light')
    setDark(next)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      className="rounded-full px-3 py-1.5 text-sm text-[var(--muted)] ring-1 ring-[var(--line)] hover:text-[var(--fg)]"
    >
      {dark ? 'Light' : 'Dark'}
    </button>
  )
}
