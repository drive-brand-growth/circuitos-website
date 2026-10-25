'use client'

import { useState } from 'react'

type NavItem = { href: string; label: string }

type NavProps = {
  items: NavItem[]
  ctaLabel: string
  ctaHref: string
}

export default function Nav({ items, ctaLabel, ctaHref }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-[#27272a] bg-black/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-8 min-w-0">
          <a href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-lg sm:text-xl font-semibold tracking-tight whitespace-nowrap">
              <span className="text-blue-500">//</span> Circuit Method
            </span>
          </a>
          <div className="hidden xl:flex items-center gap-6 text-sm text-[#a1a1aa]">
            {items.map((item) => (
              <a key={item.href} href={item.href} className="font-medium hover:text-white transition-colors whitespace-nowrap">
                {item.label}
              </a>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <a href={ctaHref} className="text-sm btn-primary text-white px-3 sm:px-4 py-2 rounded-lg font-medium whitespace-nowrap">
            {ctaLabel}
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden text-[#a1a1aa] hover:text-white"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="xl:hidden border-t border-[#27272a] bg-black/95 backdrop-blur-xl">
          <div className="px-6 py-4 space-y-3">
            {items.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="block text-[#a1a1aa] hover:text-white transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
