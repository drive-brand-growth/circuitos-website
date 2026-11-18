'use client'

import { useEffect } from 'react'

/** Fades top level sections in as they enter. Opacity only, and already visible sections stay put. */
export default function SectionReveal() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>('main > section, main > article, main > .practice')
    )
    if (!nodes.length) return

    const revealNow = (node: HTMLElement) => {
      node.classList.add('reveal', 'is-in')
    }

    const pending: HTMLElement[] = []
    for (const node of nodes) {
      const box = node.getBoundingClientRect()
      const seen = box.top < window.innerHeight * 0.82 && box.bottom > 0
      if (seen) revealNow(node)
      else pending.push(node)
    }

    for (const node of pending) node.classList.add('reveal')

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('is-in')
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    )

    for (const node of pending) observer.observe(node)

    const failsafe = window.setTimeout(() => {
      for (const node of pending) node.classList.add('is-in')
    }, 4000)

    return () => {
      observer.disconnect()
      window.clearTimeout(failsafe)
    }
  }, [])

  return null
}
