'use client'

import { useEffect, useRef, useState } from 'react'

const LINES = [
  { index: '01', name: 'RULE', text: 'Approve when the lead clears the line.', stage: 'text-stage-1' },
  { index: '02', name: 'ODDS', text: 'Stated odds 0.62.', stage: 'text-stage-2' },
  { index: '03', name: 'CAUSE', text: 'Checked against the base rate.', stage: 'text-stage-3' },
] as const

const SCORE = '0.18'

/**
 * A small terminal that types an example rule, states odds, and shows a score.
 * Values are generic. Nothing here is a client result.
 * The row height is reserved up front so typing does not move the page.
 */
export default function ExampleRun({ className = '' }: { className?: string }) {
  const root = useRef<HTMLElement>(null)
  const [typed, setTyped] = useState<string[]>(() => LINES.map((line) => line.text))
  const [scoreOn, setScoreOn] = useState(true)
  const [active, setActive] = useState<number | null>(null)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (media.matches) return

    const node = root.current
    const visible = { current: true }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting
      },
      { threshold: 0.25 }
    )
    if (node) observer.observe(node)

    let stop = false
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        window.setTimeout(resolve, ms)
      })

    async function wait(ms: number) {
      let left = ms
      while (left > 0 && !stop) {
        if (!visible.current) {
          await sleep(160)
          continue
        }
        const slice = Math.min(48, left)
        await sleep(slice)
        left -= slice
      }
    }

    async function run() {
      while (!stop) {
        setScoreOn(false)
        setTyped(LINES.map(() => ''))
        for (let i = 0; i < LINES.length; i += 1) {
          const text = LINES[i].text
          setActive(i)
          for (let count = 1; count <= text.length; count += 1) {
            if (stop) return
            await wait(22)
            const next = text.slice(0, count)
            setTyped((prev) => {
              const copy = [...prev]
              copy[i] = next
              return copy
            })
          }
          await wait(360)
        }
        setActive(null)
        setScoreOn(true)
        await wait(1900)
      }
    }

    const start = window.setTimeout(() => {
      void run()
    }, 600)

    return () => {
      stop = true
      window.clearTimeout(start)
      observer.disconnect()
    }
  }, [])

  return (
    <figure ref={root} className={`overflow-hidden rounded-panel border border-line bg-ink ${className}`}>
      <figcaption className="flex items-baseline justify-between gap-4 px-5 py-3">
        <span className="eyebrow">Example</span>
        <span className="text-right font-mono text-xs text-subtle">Not a real result</span>
      </figcaption>
      <div className="border-t border-line">
        {LINES.map((line, index) => (
          <div key={line.name} className="grid grid-cols-[6.75rem_1fr] border-t border-line first:border-t-0">
            <p className={`px-4 py-3 font-mono text-sm leading-relaxed ${line.stage}`}>
              {line.index} {line.name}
            </p>
            <div className="relative bg-black px-4 py-3 font-mono text-sm leading-relaxed text-white">
              <span className="invisible" aria-hidden="true">
                {line.text}
              </span>
              <span className="absolute inset-0 px-4 py-3" aria-hidden="true">
                {typed[index]}
                {active === index ? <span className="caret" /> : null}
              </span>
            </div>
          </div>
        ))}
        <div
          className={`grid grid-cols-[6.75rem_1fr] border-t border-line ${
            scoreOn ? 'bg-stage-scored text-on-scored' : ''
          }`}
        >
          <p className={`px-4 py-3 font-mono text-sm leading-relaxed ${scoreOn ? '' : 'text-fg'}`}>SCORE</p>
          <div className={`relative px-4 py-3 font-mono text-sm leading-relaxed ${scoreOn ? '' : 'bg-black text-white'}`}>
            <span className="invisible" aria-hidden="true">
              {SCORE}
            </span>
            <span className="absolute inset-0 flex items-center px-4" aria-hidden="true">
              {scoreOn ? SCORE : ''}
            </span>
          </div>
        </div>
      </div>
      <p className="sr-only">
        Example only, not a real result. Rule: Approve when the lead clears the line. Odds: stated 0.62. Cause:
        checked against the base rate. Score: 0.18.
      </p>
    </figure>
  )
}
