'use client'

import Link from 'next/link'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

// Example receipt stamps for this teaching drawing only.
// They are not client results. The sheet shows PASS, and the bank is marked Example.

type CircuitStage = {
  slug: string
  name: string
  href: string
  line: string
  kicker: string
}

const ORDER = ['signal', 'switch', 'current', 'breaker', 'ground'] as const

type StageSlug = (typeof ORDER)[number]

const STAGE_COLOR: Record<StageSlug, string> = {
  signal: '#64d2ff',
  switch: '#ff2d2d',
  current: '#ffd60a',
  breaker: '#30d158',
  ground: '#bf5af2',
}

const RECEIPTS = [
  { id: 'recorded', name: 'Recorded' },
  { id: 'measured', name: 'Measured' },
  { id: 'proven', name: 'Proven' },
] as const

const VB_W = 1280
const VB_H = 600
const TOP = 136
const BW = 150
const BH = 268
const WIRE = 292

const BLOCK_X: Record<StageSlug, number> = {
  signal: 36,
  switch: 204,
  current: 372,
  breaker: 540,
  ground: 708,
}

const DELAY: Record<StageSlug | (typeof RECEIPTS)[number]['id'], number> = {
  signal: 0.12,
  switch: 1.02,
  current: 1.92,
  breaker: 2.82,
  ground: 3.72,
  recorded: 4.68,
  measured: 5.58,
  proven: 6.48,
}

const INK = '#d7e8f8'
const INK_DIM = '#8eb4d4'
const SANS = 'ui-sans-serif, system-ui, sans-serif'
const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace'

function center(slug: StageSlug) {
  return BLOCK_X[slug] + BW / 2
}

function wave(x: number, y: number, count: number, width: number, amp: number) {
  let d = `M ${x} ${y}`
  for (let i = 0; i < count; i += 1) {
    const dir = i % 2 === 0 ? -amp : amp
    const x1 = x + i * width
    d += ` Q ${x1 + width / 2} ${y + dir} ${x1 + width} ${y}`
  }
  return { d, end: x + count * width }
}

function rectPath(x: number, y: number, w: number, h: number) {
  return `M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z`
}

function delayStyle(delay: number, closeAt?: number, stampAt?: number): React.CSSProperties {
  return {
    '--d': `${delay}s`,
    '--close': `${closeAt ?? delay}s`,
    '--stamp': `${stampAt ?? delay}s`,
  } as React.CSSProperties
}

function percent(value: number, total: number) {
  return `${(value / total) * 100}%`
}

function Wire({ d, color, delay }: { d: string; color: string; delay: number }) {
  return (
    <g style={delayStyle(delay)}>
      <path d={d} className="bp-draw bp-glow" stroke={color} pathLength={100} />
      <path d={d} className="bp-draw bp-core" stroke={color} pathLength={100} />
      <path d={d} className="bp-pulse bp-pulse-glow" stroke={color} pathLength={100} />
      <path d={d} className="bp-pulse bp-pulse-core" pathLength={100} />
    </g>
  )
}

function Dimension({ x, y, w, label, delay }: { x: number; y: number; w: number; label: string; delay: number }) {
  const mid = x + w / 2
  const gap = Math.min(w - 36, Math.max(48, label.length * 6.15))
  const half = gap / 2
  return (
    <g style={delayStyle(delay)}>
      <path className="bp-draw bp-tick" d={`M ${x} ${y} H ${mid - half} M ${mid + half} ${y} H ${x + w}`} pathLength={100} />
      <path className="bp-draw bp-tick" d={`M ${x} ${y - 5} V ${y + 5} M ${x + w} ${y - 5} V ${y + 5}`} pathLength={100} />
      <text className="bp-ink bp-kicker" x={mid} y={y - 8} textAnchor="middle">
        {label}
      </text>
    </g>
  )
}

function SwitchArm({ x, y, length, delay, closeAt }: { x: number; y: number; length: number; delay: number; closeAt: number }) {
  return (
    <g transform={`translate(${x} ${y})`} style={delayStyle(delay, closeAt)}>
      <path className="bp-draw bp-arm bp-symbol" d={`M 0 0 H ${length}`} pathLength={100} />
    </g>
  )
}

function PassStamp({ x, y, delay }: { x: number; y: number; delay: number }) {
  const w = 92
  const h = 34
  return (
    <g className="bp-pass" style={delayStyle(delay, delay, delay + 0.72)} transform={`translate(${x} ${y - h / 2})`}>
      <rect width={w} height={h} rx={2} />
      <rect x={3.5} y={3.5} width={w - 7} height={h - 7} rx={1} />
      <text x={w / 2} y={h / 2 + 4} textAnchor="middle">
        PASS
      </text>
    </g>
  )
}

function Sheet({
  stages,
  tagline,
  active,
  onActivate,
  onChipClick,
  onReplay,
}: {
  stages: CircuitStage[]
  tagline: string
  active: string | null
  onActivate: (id: string) => void
  onChipClick: (event: React.MouseEvent<HTMLAnchorElement>, slug: string) => void
  onReplay: () => void
}) {
  const signalWave = wave(92, WIRE, 3, 24, 14)
  const signalWire = `${signalWave.d} H ${center('switch') - 36}`
  const switchWire = `M ${center('switch') + 36} ${WIRE} H ${center('current') - 30}`
  const currentWire = `M ${center('current') - 30} ${WIRE} H ${center('breaker') - 36}`
  const breakerWire = `M ${center('breaker') + 36} ${WIRE} H ${center('ground')}`
  const groundWire = `M ${center('ground')} ${WIRE} H 936 M ${center('ground')} ${WIRE} V 362`
  const bus = 'M 948 168 V 404'
  const receiptY = [188, WIRE, 392]

  return (
    <div className="bp-sheet" data-active={active ?? undefined}>
      <svg className="bp-svg" viewBox={`0 0 ${VB_W} ${VB_H}`} aria-hidden="true" focusable="false">
        <defs>
          <pattern id="bp-grid" width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M 22 0 H 0 V 22" fill="none" stroke="rgba(146, 186, 224, 0.16)" strokeWidth="0.7" />
          </pattern>
          <pattern id="bp-major" width="110" height="110" patternUnits="userSpaceOnUse">
            <path d="M 110 0 H 0 V 110" fill="none" stroke="rgba(176, 210, 240, 0.24)" strokeWidth="0.9" />
          </pattern>
          <radialGradient id="bp-vignette" cx="50%" cy="46%" r="68%">
            <stop offset="0%" stopColor="#14325f" stopOpacity="0.55" />
            <stop offset="72%" stopColor="#0a1e3c" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={VB_W} height={VB_H} fill="#0a1e3c" />
        <rect width={VB_W} height={VB_H} fill="url(#bp-grid)" />
        <rect width={VB_W} height={VB_H} fill="url(#bp-major)" />
        <rect width={VB_W} height={VB_H} fill="url(#bp-vignette)" />

        <path className="bp-frame" d="M 24 18 H 1256 V 582 H 24 Z" />
        <path className="bp-frame" d="M 40 78 V 36 H 82 M 1198 36 H 1240 V 78 M 40 522 V 564 H 82 M 1240 522 V 564 H 1198" />
        <path className="bp-tick" d="M 360 48 H 455 M 825 48 H 920" />
        <path className="bp-tick" d="M 348 48 V 36 M 348 48 V 60 M 932 48 V 36 M 932 48 V 60" />
        <text className="bp-title" x={VB_W / 2} y={54} textAnchor="middle">
          REVENUE CIRCUIT
        </text>
        <path className="bp-frame" d="M 40 524 H 1240" />
        <text className="bp-footer" x={48} y={558} textAnchor="start">
          THE CIRCUIT METHOD™
        </text>
        <text className="bp-footer bp-footer-center" x={620} y={558} textAnchor="middle">
          {tagline}
        </text>
        <text className="bp-footer" x={1232} y={558} textAnchor="end">
          SHEET 1 OF 1
        </text>

        {ORDER.map((slug) => {
          const stage = stages.find((item) => item.slug === slug)
          if (!stage) return null
          const x = BLOCK_X[slug]
          const cx = center(slug)
          const delay = DELAY[slug]
          return (
            <g key={slug} className={`bp-stage bp-stage-${slug}`}>
              {stage.kicker ? (
                <Dimension x={x} y={TOP - 18} w={BW} label={stage.kicker} delay={delay} />
              ) : null}
              <g style={delayStyle(delay)}>
                <path className="bp-draw bp-block" d={rectPath(x, TOP, BW, BH)} pathLength={100} />
                <text className="bp-ink bp-index" x={cx} y={TOP + 28} textAnchor="middle">
                  0{ORDER.indexOf(slug) + 1}
                </text>
                <text className="bp-ink bp-name" x={cx} y={TOP + 52} textAnchor="middle">
                  {stage.name}
                </text>
              </g>
            </g>
          )
        })}

        <g className="bp-stage bp-stage-signal" style={delayStyle(DELAY.signal)}>
          <circle className="bp-draw bp-symbol" cx={74} cy={WIRE} r={18} pathLength={100} />
          <path className="bp-draw bp-symbol" d={wave(60, WIRE, 2, 14, 6).d} pathLength={100} />
        </g>
        <g className="bp-stage bp-stage-signal">
          <Wire d={signalWire} color={STAGE_COLOR.signal} delay={DELAY.signal} />
        </g>

        <g className="bp-stage bp-stage-switch">
          <Wire d={switchWire} color={STAGE_COLOR.switch} delay={DELAY.switch} />
          <g style={delayStyle(DELAY.switch)}>
            <circle className="bp-ink bp-node" cx={center('switch') - 36} cy={WIRE} r={3.3} />
            <circle className="bp-ink bp-node" cx={center('switch') + 36} cy={WIRE} r={3.3} />
          </g>
          <SwitchArm x={center('switch') - 36} y={WIRE} length={72} delay={DELAY.switch} closeAt={DELAY.switch + 0.58} />
        </g>

        <g className="bp-stage bp-stage-current">
          <Wire d={currentWire} color={STAGE_COLOR.current} delay={DELAY.current} />
          <g style={delayStyle(DELAY.current)}>
            <circle className="bp-draw bp-symbol" cx={center('current')} cy={WIRE} r={28} pathLength={100} />
            <circle className="bp-draw bp-symbol" cx={center('current')} cy={WIRE} r={18} pathLength={100} />
            <circle className="bp-draw bp-symbol" cx={center('current')} cy={WIRE} r={8} pathLength={100} />
          </g>
        </g>

        <g className="bp-stage bp-stage-breaker">
          <Wire d={breakerWire} color={STAGE_COLOR.breaker} delay={DELAY.breaker} />
          <g style={delayStyle(DELAY.breaker)}>
            <circle className="bp-ink bp-node" cx={center('breaker') - 36} cy={WIRE} r={3.3} />
            <circle className="bp-ink bp-node" cx={center('breaker') + 36} cy={WIRE} r={3.3} />
            <path
              className="bp-draw bp-symbol"
              d={`M ${center('breaker') - 36} ${WIRE} L ${center('breaker') - 4} ${WIRE - 18} L ${center('breaker') + 36} ${WIRE}`}
              pathLength={100}
            />
            <path
              className="bp-draw bp-symbol"
              d={rectPath(center('breaker') - 16, WIRE + 10, 30, 16)}
              pathLength={100}
            />
            <path className="bp-draw bp-symbol" d={`M ${center('breaker') - 8} ${WIRE + 18} H ${center('breaker') + 8}`} pathLength={100} />
          </g>
        </g>

        <g className="bp-stage bp-stage-ground">
          <Wire d={groundWire} color={STAGE_COLOR.ground} delay={DELAY.ground} />
          <g style={delayStyle(DELAY.ground)}>
            <path className="bp-draw bp-symbol" d={`M ${center('ground') - 18} 362 H ${center('ground') + 18}`} pathLength={100} />
            <path className="bp-draw bp-symbol" d={`M ${center('ground') - 11} 369 H ${center('ground') + 11}`} pathLength={100} />
            <path className="bp-draw bp-symbol" d={`M ${center('ground') - 5} 376 H ${center('ground') + 5}`} pathLength={100} />
          </g>
        </g>

        <g style={delayStyle(DELAY.recorded)}>
          <path className="bp-draw bp-symbol" d={bus} pathLength={100} />
          <text className="bp-ink bp-example" x={1112} y={132} textAnchor="middle">
            Example
          </text>
        </g>

        {RECEIPTS.map((receipt, index) => {
          const y = receiptY[index]
          const delay = DELAY[receipt.id]
          return (
            <g key={receipt.id} className={`bp-stage bp-stage-${receipt.id}`}>
              <g style={delayStyle(delay)}>
                <path className="bp-draw bp-symbol" d={`M 948 ${y} H 986`} pathLength={100} />
                <circle className="bp-ink bp-node" cx={986} cy={y} r={3.1} />
                <circle className="bp-ink bp-node" cx={1044} cy={y} r={3.1} />
                <text className="bp-ink bp-receipt" x={986} y={y - 30} textAnchor="start">
                  {receipt.name}
                </text>
              </g>
              <SwitchArm x={986} y={y} length={58} delay={delay} closeAt={delay + 0.5} />
              <PassStamp x={1066} y={y} delay={delay} />
            </g>
          )
        })}
      </svg>

      {stages.map((stage) => {
        const slug = stage.slug as StageSlug
        const x = BLOCK_X[slug]
        return (
          <Link
            key={stage.slug}
            href={stage.href}
            data-stage={stage.slug}
            className={`bp-hit bp-hit-${stage.slug}`}
            style={{
              left: percent(x, VB_W),
              top: percent(TOP, VB_H),
              width: percent(BW, VB_W),
              height: percent(BH, VB_H),
            }}
            onMouseEnter={() => onActivate(stage.slug)}
            onFocus={() => onActivate(stage.slug)}
            onClick={(event) => onChipClick(event, stage.slug)}
          >
            <span className="sr-only">{stage.name}</span>
          </Link>
        )
      })}

      {RECEIPTS.map((receipt, index) => {
        const y = receiptY[index]
        return (
          <button
            key={receipt.id}
            type="button"
            data-stage={receipt.id}
            className={`bp-hit bp-hit-${receipt.id}`}
            style={{
              left: percent(970, VB_W),
              top: percent(y - 36, VB_H),
              width: percent(200, VB_W),
              height: percent(64, VB_H),
            }}
            aria-label={`${receipt.name}. Example score readout. Pass.`}
            onMouseEnter={() => onActivate(receipt.id)}
            onFocus={() => onActivate(receipt.id)}
            onClick={() => onActivate(receipt.id)}
          />
        )
      })}

      <button type="button" className="bp-replay" onMouseEnter={onReplay} onClick={onReplay}>
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="16" cy="16" r="9" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <path d="M16 7.5 V13 M16 19 V24.5 M7.5 16 H13 M19 16 H24.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="16" cy="16" r="1.4" fill="currentColor" />
        </svg>
        <span>Replay</span>
      </button>
    </div>
  )
}

function orderStages(stages: CircuitStage[]) {
  const ordered = ORDER.map((slug) => stages.find((stage) => stage.slug === slug))
  if (ordered.some((stage) => !stage || !stage.name)) return null
  return ordered as CircuitStage[]
}

export default function CircuitBoard({ stages, tagline }: { stages: CircuitStage[]; tagline: string }) {
  const ordered = orderStages(stages)
  const rootRef = useRef<HTMLDivElement>(null)
  const sheetRef = useRef<HTMLDivElement>(null)
  const replayLock = useRef(0)
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (window.matchMedia('(hover: hover)').matches) return
      const root = rootRef.current
      const target = event.target
      if (!root || !(target instanceof Node) || root.contains(target)) return
      setActive(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  useLayoutEffect(() => {
    const sheet = sheetRef.current
    if (!sheet) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    sheet.dataset.state = 'armed'
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return
        sheet.dataset.state = 'playing'
        observer.disconnect()
      },
      { threshold: 0.28 },
    )
    observer.observe(sheet)
    return () => observer.disconnect()
  }, [])

  function replay() {
    const sheet = sheetRef.current
    if (!sheet) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const now = performance.now()
    if (now - replayLock.current < 450) return
    replayLock.current = now
    sheet.dataset.state = 'armed'
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (sheetRef.current) sheetRef.current.dataset.state = 'playing'
      })
    })
  }

  if (!ordered) {
    return (
      <ol className="grid gap-4 sm:grid-cols-2">
        {stages.map((stage) => (
          <li key={stage.slug}>
            <Link href={stage.href} className="card block p-5">
              <span className="font-semibold">{stage.name}</span>
              <span className="mt-2 block text-sm text-[var(--muted)]">{stage.line}</span>
            </Link>
          </li>
        ))}
      </ol>
    )
  }

  const names = ordered.map((stage) => stage.name)
  const flowLabel = `The flow moves from ${names[0]} to ${names[1]}, then ${names[2]}, then ${names[3]}, then ${names[4]}. Example receipts then read Recorded, Measured, and Proven.`
  const activeStage = ordered.find((stage) => stage.slug === active)
  const activeReceipt = RECEIPTS.find((receipt) => receipt.id === active)
  const caption = activeStage?.line || (activeReceipt ? `${activeReceipt.name}. Example score readout.` : '\u00A0')

  function onChipClick(event: React.MouseEvent<HTMLAnchorElement>, slug: string) {
    const coarse = window.matchMedia('(hover: none)').matches
    if (!coarse || event.detail === 0) return
    if (active !== slug) {
      event.preventDefault()
      setActive(slug)
    }
  }

  return (
    <div
      ref={rootRef}
      id="circuit-board"
      role="group"
      aria-label={flowLabel}
      onMouseLeave={() => {
        if (window.matchMedia('(hover: hover)').matches) setActive(null)
      }}
      onBlur={(event) => {
        const next = event.relatedTarget
        if (next instanceof Node && event.currentTarget.contains(next)) return
        setActive(null)
      }}
    >
      <p className="sr-only">On a narrow screen the sheet scrolls sideways.</p>
      <div className="bp-scroll thin-scrollbar">
        <div ref={sheetRef}>
          <Sheet
            stages={ordered}
            tagline={tagline}
            active={active}
            onActivate={setActive}
            onChipClick={onChipClick}
            onReplay={replay}
          />
        </div>
      </div>
      <p className="bp-caption" aria-live="polite">
        {caption}
      </p>
    </div>
  )
}
