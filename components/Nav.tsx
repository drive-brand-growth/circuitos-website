'use client'

import { useState } from 'react'

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-[#27272a] bg-black/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold tracking-tight">
              <span className="text-blue-500">//</span> Circuit<span className="text-blue-500">OS</span>
            </span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#a1a1aa]">
            <a href="/#platform" className="font-medium hover:text-white transition-colors">Platform</a>
            <a href="/#how-it-works" className="font-medium hover:text-white transition-colors">How it Works</a>
            <a href="/#capabilities" className="font-medium hover:text-white transition-colors">Capabilities</a>
            <a href="/#pricing" className="font-medium hover:text-white transition-colors">Pricing</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href="/#contact" className="hidden sm:inline text-sm font-medium text-[#a1a1aa] hover:text-white transition-colors">Contact</a>
          <a href="/demo" className="text-sm btn-primary text-white px-4 py-2 rounded-lg font-medium">
            See It In Action
          </a>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-[#a1a1aa] hover:text-white"
            aria-label="Toggle menu"
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
        <div className="md:hidden border-t border-[#27272a] bg-black/95 backdrop-blur-xl">
          <div className="px-6 py-4 space-y-3">
            {[
              { href: '/#platform', label: 'Platform' },
              { href: '/#how-it-works', label: 'How it Works' },
              { href: '/#capabilities', label: 'Capabilities' },
              { href: '/#pricing', label: 'Pricing' },
              { href: '/#contact', label: 'Contact' },
            ].map((link) => (
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
