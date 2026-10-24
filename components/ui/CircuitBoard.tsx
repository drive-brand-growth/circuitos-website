'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

// Example receipt readouts for this teaching graphic only.
// They are not client results. The visible board shows PASS and a filled meter, not a percent.
// Placeholder scores, if a number is ever required: Recorded 1, Measured 1, Proven 1.

type CircuitStage = {
  slug: string
  name: string
  href: string
  line: string
}

type Point = { x: number; y: number }

type TraceSpec = {
  id: string
  d: string
  color: string
  delay: number
}

type BoardGeometry = {
  id: 'wide' | 'stack'
  vbW: number
  vbH: number
  bodyW: number
  bodyH: number
  pin: number
  switchW: number
  switchH: number
  chips: Point[]
  switches: Point[]
  traces: TraceSpec[]
  vias: Point[]
  holes: Point[]
  passives: Point[]
  returnD: string
  example: { x: number; y: number; anchor: 'start' | 'middle'; size: number }
}

type Tip = {
  cx: number
  cy: number
  left: number
  right: number
  top: number
  bottom: number
}

const ORDER = ['signal', 'switch', 'current', 'breaker', 'ground'] as const

const STAGE_COLOR: Record<(typeof ORDER)[number], string> = {
  signal: '#64d2ff',
  switch: '#ff2d2d',
  current: '#ffd60a',
  breaker: '#30d158',
  ground: '#bf5af2',
}

const RECEIPT_COLOR = '#d5d8dc'

const RECEIPTS = [
  { id: 'recorded', name: 'Recorded' },
  { id: 'measured', name: 'Measured' },
  { id: 'proven', name: 'Proven' },
] as const

const FLOW_TAIL = 'Example receipts then read Recorded, Measured, and Proven.'

function tip(point: Point, bodyW: number, bodyH: number, pin: number): Tip {
  const halfW = bodyW / 2
  const halfH = bodyH / 2
  return {
    cx: point.x,
    cy: point.y,
    left: point.x - halfW - pin,
    right: point.x + halfW + pin,
    top: point.y - halfH - pin,
    bottom: point.y + halfH + pin,
  }
}

function wideBoard(): BoardGeometry {
  const bodyW = 128
  const bodyH = 52
  const pin = 8
  const chips = [
    { x: 150, y: 98 },
    { x: 392, y: 98 },
    { x: 654, y: 98 },
    { x: 654, y: 238 },
    { x: 348, y: 238 },
  ]
  const ends = chips.map((chip) => tip(chip, bodyW, bodyH, pin))
  const railY = 318
  const switchW = 132
  const switchH = 78
  const switchY = 398
  const switches = [
    { x: 176, y: switchY },
    { x: 480, y: switchY },
    { x: 784, y: switchY },
  ]
  const enterY = switchY - switchH / 2 + 8
  const colors = ORDER.map((slug) => STAGE_COLOR[slug])

  return {
    id: 'wide',
    vbW: 960,
    vbH: 480,
    bodyW,
    bodyH,
    pin,
    switchW,
    switchH,
    chips,
    switches,
    traces: [
      { id: 'signal', delay: 0, color: colors[0], d: `M ${ends[0].right} ${ends[0].cy} H ${ends[1].left}` },
      { id: 'switch', delay: 1, color: colors[1], d: `M ${ends[1].right} ${ends[1].cy} H ${ends[2].left}` },
      { id: 'current', delay: 2, color: colors[2], d: `M ${ends[2].cx} ${ends[2].bottom} V ${ends[3].top}` },
      { id: 'breaker', delay: 3, color: colors[3], d: `M ${ends[3].left} ${ends[3].cy} H ${ends[4].right}` },
      { id: 'ground', delay: 4, color: colors[4], d: `M ${ends[4].cx} ${ends[4].bottom} V ${railY}` },
      { id: 'recorded', delay: 5, color: RECEIPT_COLOR, d: `M ${ends[4].cx} ${railY} H ${switches[0].x} V ${enterY}` },
      { id: 'measured', delay: 6, color: RECEIPT_COLOR, d: `M ${switches[0].x} ${railY} H ${switches[1].x} V ${enterY}` },
      { id: 'proven', delay: 7, color: RECEIPT_COLOR, d: `M ${switches[1].x} ${railY} H ${switches[2].x} V ${enterY}` },
    ],
    vias: [
      { x: ends[4].cx, y: railY },
      { x: switches[0].x, y: railY },
      { x: switches[1].x, y: railY },
      { x: switches[2].x, y: railY },
    ],
    holes: [
      { x: 28, y: 28 },
      { x: 932, y: 28 },
      { x: 28, y: 452 },
      { x: 932, y: 452 },
    ],
    passives: [
      { x: 812, y: 150 },
      { x: 868, y: 46 },
    ],
    returnD: `M 36 ${railY} V ${ends[0].cy} H ${ends[0].left}`,
    example: { x: 52, y: 292, anchor: 'start', size: 13 },
  }
}

function stackBoard(): BoardGeometry {
  const bodyW = 156
  const bodyH = 56
  const pin = 7
  const chips = [
    { x: 200, y: 72 },
    { x: 200, y: 184 },
    { x: 200, y: 296 },
    { x: 200, y: 408 },
    { x: 200, y: 520 },
  ]
  const ends = chips.map((chip) => tip(chip, bodyW, bodyH, pin))
  const busX = 34
  const jogY = ends[4].bottom + 26
  const railY = 692
  const switchW = 108
  const switchH = 86
  const switchY = 742
  const switches = [
    { x: 74, y: switchY },
    { x: 200, y: switchY },
    { x: 326, y: switchY },
  ]
  const enterY = switchY - switchH / 2 + 8
  const colors = ORDER.map((slug) => STAGE_COLOR[slug])

  return {
    id: 'stack',
    vbW: 400,
    vbH: 820,
    bodyW,
    bodyH,
    pin,
    switchW,
    switchH,
    chips,
    switches,
    traces: [
      { id: 'signal', delay: 0, color: colors[0], d: `M ${ends[0].cx} ${ends[0].bottom} V ${ends[1].top}` },
      { id: 'switch', delay: 1, color: colors[1], d: `M ${ends[1].cx} ${ends[1].bottom} V ${ends[2].top}` },
      { id: 'current', delay: 2, color: colors[2], d: `M ${ends[2].cx} ${ends[2].bottom} V ${ends[3].top}` },
      { id: 'breaker', delay: 3, color: colors[3], d: `M ${ends[3].cx} ${ends[3].bottom} V ${ends[4].top}` },
      { id: 'ground', delay: 4, color: colors[4], d: `M ${ends[4].cx} ${ends[4].bottom} V ${jogY} H ${busX}` },
      { id: 'recorded', delay: 5, color: RECEIPT_COLOR, d: `M ${busX} ${jogY} V ${railY} H ${switches[0].x} V ${enterY}` },
      { id: 'measured', delay: 6, color: RECEIPT_COLOR, d: `M ${switches[0].x} ${railY} H ${switches[1].x} V ${enterY}` },
      { id: 'proven', delay: 7, color: RECEIPT_COLOR, d: `M ${switches[1].x} ${railY} H ${switches[2].x} V ${enterY}` },
    ],
    vias: [
      { x: busX, y: jogY },
      { x: switches[0].x, y: railY },
      { x: switches[1].x, y: railY },
      { x: switches[2].x, y: railY },
    ],
    holes: [
      { x: 18, y: 18 },
      { x: 382, y: 18 },
      { x: 18, y: 802 },
      { x: 382, y: 802 },
    ],
    passives: [
      { x: 318, y: 96 },
      { x: 318, y: 250 },
    ],
    returnD: `M ${busX} ${jogY} V ${ends[0].cy} H ${ends[0].left}`,
    example: { x: 200, y: (jogY + railY) / 2, anchor: 'middle', size: 14 },
  }
}

const WIDE = wideBoard()
const STACK = stackBoard()

function percent(value: number, total: number): string {
  return `${(value / total) * 100}%`
}

function ChipPins({ cx, cy, hw, hh }: { cx: number; cy: number; hw: number; hh: number }) {
  const count = 3
  const pins: JSX.Element[] = []
  for (let index = 1; index <= count; index += 1) {
    const alongY = cy - hh + ((hh * 2) * index) / (count + 1)
    const alongX = cx - hw + ((hw * 2) * index) / (count + 1)
    pins.push(
      <rect key={`${cx}-${cy}-l-${index}`} x={cx - hw - 8} y={alongY - 1.5} width={8} height={3} rx={0.5} fill="#d2d2d7" />,
      <rect key={`${cx}-${cy}-r-${index}`} x={cx + hw} y={alongY - 1.5} width={8} height={3} rx={0.5} fill="#d2d2d7" />,
      <rect key={`${cx}-${cy}-t-${index}`} x={alongX - 1.5} y={cy - hh - 8} width={3} height={8} rx={0.5} fill="#d2d2d7" />,
      <rect key={`${cx}-${cy}-b-${index}`} x={alongX - 1.5} y={cy + hh} width={3} height={8} rx={0.5} fill="#d2d2d7" />,
    )
  }
  return <g>{pins}</g>
}

function Passive({ x, y }: Point) {
  return (
    <g>
      <rect x={x} y={y} width={6} height={11} rx={1} fill="#c49262" />
      <rect x={x + 16} y={y} width={6} height={11} rx={1} fill="#c49262" />
      <rect x={x + 4} y={y + 2.2} width={14} height={6.6} rx={1} fill="#1a1f1c" stroke="#8d9390" strokeWidth={0.8} />
    </g>
  )
}

function BoardFace({
  geometry,
  stages,
  active,
  onActivate,
  onChipClick,
}: {
  geometry: BoardGeometry
  stages: CircuitStage[]
  active: string | null
  onActivate: (id: string) => void
  onChipClick: (event: React.MouseEvent<HTMLAnchorElement>, slug: string) => void
}) {
  const halfW = geometry.bodyW / 2
  const halfH = geometry.bodyH / 2

  return (
    <div
      className={`circuit-layout circuit-layout-${geometry.id}`}
      style={{ '--board-ratio': `${geometry.vbW} / ${geometry.vbH}` } as React.CSSProperties}
      data-active={active ?? undefined}
    >
      <svg
        viewBox={`0 0 ${geometry.vbW} ${geometry.vbH}`}
        className="circuit-svg"
        aria-hidden="true"
        focusable="false"
      >
        <rect width={geometry.vbW} height={geometry.vbH} fill="#0e120f" />
        <rect x={12} y={12} width={geometry.vbW - 24} height={geometry.vbH - 24} rx={22} fill="#121815" />
        <rect
          x={18}
          y={18}
          width={geometry.vbW - 36}
          height={geometry.vbH - 36}
          rx={16}
          fill="none"
          stroke="rgba(232,220,176,0.34)"
          strokeWidth={1.25}
        />
        {geometry.holes.map((hole) => (
          <g key={`hole-${hole.x}-${hole.y}`}>
            <circle cx={hole.x} cy={hole.y} r={7} fill="none" stroke="rgba(232,220,176,0.5)" strokeWidth={1.2} />
            <circle cx={hole.x} cy={hole.y} r={3.1} fill="#070908" />
          </g>
        ))}
        {geometry.passives.map((pad) => (
          <Passive key={`pad-${pad.x}-${pad.y}`} x={pad.x} y={pad.y} />
        ))}
        <path
          d={geometry.returnD}
          fill="none"
          stroke="#5c3a1e"
          strokeWidth={4}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {geometry.traces.map((trace) => (
          <g key={trace.id}>
            <path
              d={trace.d}
              fill="none"
              stroke="#6b421c"
              strokeWidth={6.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={trace.d}
              className={`circuit-trace circuit-trace-${trace.id}`}
              fill="none"
              stroke={trace.color}
              strokeWidth={2.35}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={trace.d}
              className={`circuit-pulse circuit-pulse-glow circuit-delay-${trace.delay}`}
              fill="none"
              stroke={trace.color}
              strokeWidth={7}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={100}
              strokeDasharray="24 160"
            />
            <path
              d={trace.d}
              className={`circuit-pulse circuit-pulse-core circuit-delay-${trace.delay}`}
              fill="none"
              stroke="#ffffff"
              strokeWidth={3.2}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={100}
              strokeDasharray="16 160"
            />
          </g>
        ))}
        {geometry.vias.map((via) => (
          <g key={`via-${via.x}-${via.y}`}>
            <circle cx={via.x} cy={via.y} r={5.5} fill="#1a120c" stroke="#c4895a" strokeWidth={1.35} />
            <circle cx={via.x} cy={via.y} r={1.7} fill="#0c0f0d" />
          </g>
        ))}
        {geometry.chips.map((chip) => (
          <ChipPins key={`pins-${chip.x}-${chip.y}`} cx={chip.x} cy={chip.y} hw={halfW} hh={halfH} />
        ))}
        <text
          x={geometry.example.x}
          y={geometry.example.y}
          textAnchor={geometry.example.anchor}
          fill="rgba(232,220,176,0.78)"
          fontSize={geometry.example.size}
          fontFamily="system-ui, sans-serif"
          fontWeight={600}
        >
          Example
        </text>
      </svg>
      {stages.map((stage, index) => {
        const chip = geometry.chips[index]
        const color = STAGE_COLOR[stage.slug as (typeof ORDER)[number]]
        return (
          <Link
            key={stage.slug}
            href={stage.href}
            data-stage={stage.slug}
            className={`circuit-chip circuit-chip-${stage.slug} circuit-delay-${index}`}
            style={
              {
                left: percent(chip.x, geometry.vbW),
                top: percent(chip.y, geometry.vbH),
                width: percent(geometry.bodyW, geometry.vbW),
                height: percent(geometry.bodyH, geometry.vbH),
                '--stage': color,
              } as React.CSSProperties
            }
            onMouseEnter={() => onActivate(stage.slug)}
            onFocus={() => onActivate(stage.slug)}
            onClick={(event) => onChipClick(event, stage.slug)}
          >
            <span className="circuit-chip-index" aria-hidden="true">
              0{index + 1}
            </span>
            <span className="circuit-chip-name">{stage.name}</span>
          </Link>
        )
      })}
      {RECEIPTS.map((receipt, index) => {
        const point = geometry.switches[index]
        return (
          <button
            key={receipt.id}
            type="button"
            data-stage={receipt.id}
            className={`circuit-switch circuit-switch-${receipt.id}`}
            style={{
              left: percent(point.x, geometry.vbW),
              top: percent(point.y, geometry.vbH),
              width: percent(geometry.switchW, geometry.vbW),
              height: percent(geometry.switchH, geometry.vbH),
            }}
            aria-label={`${receipt.name}. Example score readout. Pass.`}
            onMouseEnter={() => onActivate(receipt.id)}
            onFocus={() => onActivate(receipt.id)}
            onClick={() => onActivate(receipt.id)}
          >
            <span className="circuit-switch-name">{receipt.name}</span>
            <span className="circuit-switch-row">
              <span className={`circuit-led circuit-led-${receipt.id}`} aria-hidden="true" />
              <span className="circuit-toggle" aria-hidden="true">
                <span className={`circuit-lever circuit-lever-${receipt.id}`} />
              </span>
            </span>
            <span className={`circuit-pass circuit-pass-${receipt.id}`}>PASS</span>
            <span className="circuit-meter" aria-hidden="true">
              <span className={`circuit-meter-fill circuit-meter-${receipt.id}`} />
            </span>
          </button>
        )
      })}
    </div>
  )
}

function orderStages(stages: CircuitStage[]): CircuitStage[] | null {
  const ordered = ORDER.map((slug) => stages.find((stage) => stage.slug === slug))
  if (ordered.some((stage) => !stage || !stage.name)) return null
  return ordered as CircuitStage[]
}

export default function CircuitBoard({ stages }: { stages: CircuitStage[] }) {
  const ordered = orderStages(stages)
  const rootRef = useRef<HTMLDivElement>(null)
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
  const flowLabel = `The flow moves from ${names[0]} to ${names[1]}, then ${names[2]}, then ${names[3]}, then ${names[4]}. ${FLOW_TAIL}`
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
      <div className="md:hidden">
        <BoardFace
          geometry={STACK}
          stages={ordered}
          active={active}
          onActivate={setActive}
          onChipClick={onChipClick}
        />
      </div>
      <div className="mx-auto hidden w-full max-w-5xl md:block">
        <BoardFace
          geometry={WIDE}
          stages={ordered}
          active={active}
          onActivate={setActive}
          onChipClick={onChipClick}
        />
      </div>
      <p className="circuit-caption" aria-live="polite">
        {caption}
      </p>
    </div>
  )
}
