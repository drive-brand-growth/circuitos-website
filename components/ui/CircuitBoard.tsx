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

type Box = { x: number; y: number; w: number; h: number }

type PcbArt = {
  copper: string
  bus: string
  parts: string
  pads: string
  viaRings: string
  viaHoles: string
  ghosts: string[]
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
  returnD: string
  example: { x: number; y: number; anchor: 'start' | 'middle'; size: number }
  pcb: PcbArt
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

function mulberry32(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function ring(cx: number, cy: number, r: number) {
  const x = Math.round(cx)
  const y = Math.round(cy)
  return `M ${x - r} ${y} a ${r} ${r} 0 1 1 ${r * 2} 0 a ${r} ${r} 0 1 1 ${-r * 2} 0`
}

function keepOuts(
  chips: Point[],
  switches: Point[],
  bodyW: number,
  bodyH: number,
  switchW: number,
  switchH: number,
): Box[] {
  const pad = 8
  return [
    ...chips.map((chip) => ({
      x: chip.x - bodyW / 2 - pad,
      y: chip.y - bodyH / 2 - pad,
      w: bodyW + pad * 2,
      h: bodyH + pad * 2,
    })),
    ...switches.map((point) => ({
      x: point.x - switchW / 2 - pad,
      y: point.y - switchH / 2 - pad,
      w: switchW + pad * 2,
      h: switchH + pad * 2,
    })),
  ]
}

function buildPcb(width: number, height: number, seed: number, blocked: Box[]): PcbArt {
  const rand = mulberry32(seed)
  const copper: string[] = []
  const bus: string[] = []
  const parts: string[] = []
  const pads: string[] = []
  const viaRings: string[] = []
  const viaHoles: string[] = []
  const ghosts: string[] = []
  const margin = 18
  const wide = width > 700

  const inside = (x: number, y: number) => x > margin && y > margin && x < width - margin && y < height - margin
  const blockedAt = (x: number, y: number) =>
    blocked.some((box) => x > box.x && x < box.x + box.w && y > box.y && y < box.y + box.h)

  const addVia = (x: number, y: number) => {
    if (viaRings.length > 150 || !inside(x, y)) return
    const cx = Math.round(x)
    const cy = Math.round(y)
    viaRings.push(ring(cx, cy, 2.5))
    viaHoles.push(ring(cx, cy, 0.85))
  }

  const addPad = (x: number, y: number, r: number) => {
    if (!inside(x, y) || pads.length > 220) return
    pads.push(ring(x, y, r))
  }

  const pitch = wide ? 12 : 10
  for (const axis of ['h', 'v'] as const) {
    const span = axis === 'h' ? height : width
    const run = axis === 'h' ? width : height
    for (let a = margin + 2; a < span - margin; a += pitch) {
      let b = margin + Math.floor(rand() * 16)
      while (b < run - margin) {
        const len = 14 + Math.floor(rand() * (wide ? 86 : 46))
        const end = Math.min(run - margin, b + len)
        if (end - b > 12) {
          const x1 = axis === 'h' ? b : a
          const y1 = axis === 'h' ? a : b
          const x2 = axis === 'h' ? end : a
          const y2 = axis === 'h' ? a : end
          const d = `M ${x1} ${y1} L ${x2} ${y2}`
          copper.push(d)
          if (ghosts.length < 6 && end - b > 42 && rand() > 0.78) ghosts.push(d)
          if (rand() > 0.8) addVia(x2, y2)
          if (rand() > 0.9) addPad(x1, y1, 1.5)
        }
        b = end + 7 + Math.floor(rand() * 22)
      }
    }
  }

  const diagCount = wide ? 84 : 42
  for (let i = 0; i < diagCount; i += 1) {
    const x = margin + Math.floor(rand() * (width - margin * 2))
    const y = margin + Math.floor(rand() * (height - margin * 2))
    const len = 18 + Math.floor(rand() * 52)
    const sx = rand() > 0.5 ? 1 : -1
    const sy = rand() > 0.5 ? 1 : -1
    const x2 = x + sx * len
    const y2 = y + sy * len
    if (!inside(x2, y2)) continue
    const d = `M ${x} ${y} L ${x2} ${y2}`
    copper.push(d)
    if (rand() > 0.55) addVia(x, y)
    if (ghosts.length < 6 && len > 36 && rand() > 0.4) ghosts.push(d)
  }

  const walks = wide ? 110 : 56
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
    [1, 1],
    [1, -1],
    [-1, 1],
    [-1, -1],
  ]
  for (let i = 0; i < walks; i += 1) {
    let x = Math.round((margin + rand() * (width - margin * 2)) / 4) * 4
    let y = Math.round((margin + rand() * (height - margin * 2)) / 4) * 4
    const steps: string[] = []
    const count = 5 + Math.floor(rand() * 8)
    for (let s = 0; s < count; s += 1) {
      const dir = dirs[Math.floor(rand() * dirs.length)]
      const step = (2 + Math.floor(rand() * 5)) * 6
      const nx = x + dir[0] * step
      const ny = y + dir[1] * step
      if (!inside(nx, ny)) continue
      steps.push(`M ${x} ${y} L ${nx} ${ny}`)
      if (rand() > 0.62) addVia(nx, ny)
      x = nx
      y = ny
    }
    if (!steps.length) continue
    const d = steps.join(' ')
    copper.push(d)
    if (ghosts.length < 6 && steps.length > 3) ghosts.push(d)
  }

  const busCount = wide ? 7 : 4
  for (let i = 0; i < busCount; i += 1) {
    const horizontal = rand() > 0.42
    const len = (horizontal ? width : height) * (0.18 + rand() * 0.34)
    const x = margin + rand() * (width - margin * 2 - 30)
    const y = margin + rand() * (height - margin * 2 - 30)
    if (blockedAt(x, y)) continue
    for (let n = 0; n < 4; n += 1) {
      if (horizontal) {
        const yy = Math.round(y + n * 3)
        const x2 = Math.min(width - margin, Math.round(x + len))
        if (yy > margin && yy < height - margin) bus.push(`M ${Math.round(x)} ${yy} H ${x2}`)
      } else {
        const xx = Math.round(x + n * 3)
        const y2 = Math.min(height - margin, Math.round(y + len))
        if (xx > margin && xx < width - margin) bus.push(`M ${xx} ${Math.round(y)} V ${y2}`)
      }
    }
    addVia(x, y)
  }

  const ics = wide ? 11 : 6
  for (let i = 0; i < ics; i += 1) {
    const w = 26 + Math.floor(rand() * 24)
    const h = 14 + Math.floor(rand() * 12)
    const x = margin + Math.floor(rand() * (width - margin * 2 - w))
    const y = margin + Math.floor(rand() * (height - margin * 2 - h))
    if (blockedAt(x + w / 2, y + h / 2)) continue
    parts.push(`M ${x} ${y} h ${w} v ${h} h ${-w} z`)
    const pins = 4 + Math.floor(rand() * 3)
    for (let p = 1; p <= pins; p += 1) {
      const py = Math.round(y + (h * p) / (pins + 1))
      parts.push(`M ${x - 4} ${py} H ${x}`)
      parts.push(`M ${x + w} ${py} H ${x + w + 4}`)
      addPad(x - 4, py, 1.15)
      addPad(x + w + 4, py, 1.15)
    }
    pads.push(ring(x + 3, y + 3, 1.05))
  }

  const passives = wide ? 22 : 12
  for (let i = 0; i < passives; i += 1) {
    const x = margin + Math.floor(rand() * (width - margin * 2 - 16))
    const y = margin + Math.floor(rand() * (height - margin * 2 - 16))
    if (blockedAt(x, y)) continue
    if (rand() > 0.48) {
      if (rand() > 0.5) {
        parts.push(`M ${x} ${y - 2} h 16 v 4 h -16 z`)
        addPad(x, y, 1.45)
        addPad(x + 16, y, 1.45)
      } else {
        parts.push(`M ${x - 2} ${y} h 4 v 16 h -4 z`)
        addPad(x, y, 1.45)
        addPad(x, y + 16, 1.45)
      }
    } else {
      parts.push(`M ${x} ${y} v 9 M ${x + 3.5} ${y} v 9 M ${x - 6} ${y + 4.5} H ${x} M ${x + 3.5} ${y + 4.5} H ${x + 9}`)
      addPad(x - 6, y + 4.5, 1.15)
      addPad(x + 9, y + 4.5, 1.15)
    }
  }

  return {
    copper: copper.join(' '),
    bus: bus.join(' '),
    parts: parts.join(' '),
    pads: pads.join(' '),
    viaRings: viaRings.join(' '),
    viaHoles: viaHoles.join(' '),
    ghosts: ghosts.slice(0, 6),
  }
}

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
    returnD: `M 36 ${railY} V ${ends[0].cy} H ${ends[0].left}`,
    example: { x: 52, y: 292, anchor: 'start', size: 13 },
    pcb: buildPcb(960, 480, 0x51a7c0de, keepOuts(chips, switches, bodyW, bodyH, switchW, switchH)),
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
    returnD: `M ${busX} ${jogY} V ${ends[0].cy} H ${ends[0].left}`,
    example: { x: 200, y: (jogY + railY) / 2, anchor: 'middle', size: 14 },
    pcb: buildPcb(400, 820, 0x0b0a7d11, keepOuts(chips, switches, bodyW, bodyH, switchW, switchH)),
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
        <defs>
          <radialGradient id={`pcb-shade-${geometry.id}`} cx="48%" cy="38%" r="75%">
            <stop offset="0%" stopColor="#1b2a22" />
            <stop offset="46%" stopColor="#121a15" />
            <stop offset="100%" stopColor="#070b09" />
          </radialGradient>
          <radialGradient id={`pcb-sheen-${geometry.id}`} cx="8%" cy="0%" r="62%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.07" />
            <stop offset="72%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={geometry.vbW} height={geometry.vbH} fill={`url(#pcb-shade-${geometry.id})`} />
        <rect width={geometry.vbW} height={geometry.vbH} fill={`url(#pcb-sheen-${geometry.id})`} />
        <path d={geometry.pcb.copper} fill="none" stroke="#7a4e28" strokeWidth={1.15} strokeLinecap="round" strokeLinejoin="round" opacity={0.62} />
        <path d={geometry.pcb.copper} fill="none" stroke="#f0d2a4" strokeWidth={0.4} strokeLinecap="round" strokeLinejoin="round" opacity={0.28} />
        <path d={geometry.pcb.bus} fill="none" stroke="#d29a62" strokeWidth={0.72} strokeLinecap="round" opacity={0.7} />
        <path d={geometry.pcb.parts} fill="none" stroke="#cbbba6" strokeWidth={0.75} strokeLinejoin="miter" opacity={0.78} />
        <path d={geometry.pcb.pads} fill="#c49262" opacity={0.82} />
        <path d={geometry.pcb.viaRings} fill="none" stroke="#e0b07a" strokeWidth={0.7} opacity={0.8} />
        <path d={geometry.pcb.viaHoles} fill="#050706" />
        {geometry.pcb.ghosts.map((d, index) => (
          <path
            key={`ghost-${index}`}
            d={d}
            className={`circuit-ghost circuit-ghost-${index}`}
            pathLength={100}
            strokeDasharray="14 150"
          />
        ))}
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
        <path
          d={geometry.returnD}
          fill="none"
          stroke="#8a5a32"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.55}
        />
        {geometry.traces.map((trace) => (
          <g key={trace.id}>
            <path
              d={trace.d}
              fill="none"
              stroke={trace.color}
              strokeWidth={10}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.22}
            />
            <path
              d={trace.d}
              fill="none"
              stroke="#6b421c"
              strokeWidth={5.4}
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
              strokeWidth={12}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={100}
              strokeDasharray="34 200"
            />
            <path
              d={trace.d}
              className={`circuit-pulse circuit-pulse-core circuit-delay-${trace.delay}`}
              fill="none"
              stroke="#ffffff"
              strokeWidth={4.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={100}
              strokeDasharray="22 200"
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
