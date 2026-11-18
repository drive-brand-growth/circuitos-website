'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type NavItem = { href: string; label: string }

type NavProps = {
  items: NavItem[]
  ctaLabel: string
  ctaHref: string
}

export default function Nav({ items, ctaLabel, ctaHref }: NavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line/80 bg-ink/90 backdrop-blur-xl backdrop-saturate-150">
      <nav aria-label="Primary" className="shell flex h-header items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-10">
          <Link href="/" className="flex min-h-11 shrink-0 items-center gap-2 text-[1.0625rem] font-semibold tracking-[-0.02em] text-fg">
            <span aria-hidden="true" className="font-mono text-fg">
              {'//'}
            </span>
            <span className="whitespace-nowrap">Circuit Method</span>
          </Link>
          <ul className="hidden items-center gap-7 text-sm text-muted xl:flex">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} prefetch={false} className="whitespace-nowrap transition-colors duration-200 hover:text-fg">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            prefetch={false}
            href={ctaHref}
            className="hidden min-h-9 items-center whitespace-nowrap rounded-full border border-line-strong px-4 text-sm font-medium text-fg transition-colors duration-200 hover:border-subtle hover:bg-fg/[0.05] min-[440px]:inline-flex"
          >
            {ctaLabel}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center text-muted transition-colors hover:text-fg xl:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>
      {mobileOpen && (
        <div id="mobile-menu" className="border-t border-line bg-ink xl:hidden">
          <ul className="shell divide-y divide-line py-2">
            {items.map((link) => (
              <li key={link.href}>
                <Link
                  prefetch={false}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex min-h-12 items-center text-[1.0625rem] text-soft transition-colors hover:text-fg"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                prefetch={false}
                href={ctaHref}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-12 items-center text-[1.0625rem] font-medium text-fg"
              >
                {ctaLabel}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
