'use client'

import { useState } from 'react'
import Wordmark from '@/components/Wordmark'
import Button from '@/components/ui/Button'
import ThemeToggle from '@/components/ui/ThemeToggle'

type NavItem = { href: string; label: string }

type NavProps = {
  items: NavItem[]
  ctaLabel: string
  ctaHref: string
}

export default function Nav({ items, ctaLabel, ctaHref }: NavProps) {
  const [open, setOpen] = useState(false)

  return (
    <header className="nav-bar sticky top-0 z-50 border-b border-[var(--line)]">
      <nav className="mx-auto flex h-16 max-w-page items-center justify-between gap-4 px-5" aria-label="Primary">
        <a href="/" className="shrink-0 text-[var(--fg)]" aria-label="The Circuit Method home">
          <Wordmark compact markClassName="h-8 w-8" />
        </a>
        <div className="hidden items-center gap-6 text-sm text-[var(--muted)] lg:flex">
          {items.map((item) => (
            <a key={item.href} href={item.href} className="font-medium hover:text-[var(--fg)]">
              {item.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Button href={ctaHref} className="hidden sm:inline-flex">
            {ctaLabel}
          </Button>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            className="rounded-full px-3 py-1.5 text-sm text-[var(--muted)] lg:hidden"
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </nav>
      {open ? (
        <div className="border-t border-[var(--line)] lg:hidden">
          <div className="mx-auto max-w-page space-y-1 px-5 py-4">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block py-2 text-[var(--muted)] hover:text-[var(--fg)]"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-2">
              <Button href={ctaHref} className="w-full">
                {ctaLabel}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
