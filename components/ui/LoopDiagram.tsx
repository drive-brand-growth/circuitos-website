const NODES = [
  {
    n: '01',
    name: 'RULE',
    note: 'written first',
    x: 118,
    y: 112,
    labelY: 36,
    noteY: 70,
    motion: 'loop-n1',
    ring: 'fill-ink stroke-stage-1',
    ink: 'fill-stage-1',
  },
  {
    n: '02',
    name: 'ODDS',
    note: 'stated, then scored',
    x: 270,
    y: 112,
    labelY: 36,
    noteY: 70,
    motion: 'loop-n2',
    ring: 'fill-ink stroke-stage-2',
    ink: 'fill-stage-2',
  },
  {
    n: '03',
    name: 'CAUSE',
    note: 'tested against a baseline',
    x: 210,
    y: 292,
    labelY: 340,
    noteY: 374,
    motion: 'loop-n3',
    ring: 'fill-ink stroke-stage-3',
    ink: 'fill-stage-3',
  },
] as const

/**
 * One loop, three steps. The line draws from the rule, through the odds, to the cause,
 * then the center line appears and the drawing fades back to white.
 * Label sizes stay at 14px or more when the drawing scales down to a 375px screen.
 */
export default function LoopDiagram({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 404"
      width="420"
      height="404"
      className={`loop-diagram block h-auto ${className}`}
      role="img"
      aria-label="Diagram of one loop with three points. The rule is written first. The odds are stated, then scored. The cause is tested against a baseline. The result returns to the start."
    >
      <g className="loop-ink">
        <rect x="52" y="112" width="316" height="180" rx="16" fill="none" className="stroke-line" strokeWidth="1" />
        <rect
          x="52"
          y="112"
          width="316"
          height="180"
          rx="16"
          fill="none"
          pathLength={1}
          className="loop-stroke"
          strokeWidth="1.5"
        />
        <g fill="none" className="stroke-line-strong" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
          <path d="M202 106 L210 112 L202 118" />
          <path d="M362 198 L368 206 L374 198" />
          <path d="M292 286 L284 292 L292 298" />
          <path d="M136 286 L128 292 L136 298" />
          <path d="M46 206 L52 198 L58 206" />
        </g>
        <g className="loop-center fill-fg font-sans" fontSize="17" textAnchor="middle">
          <text x="210" y="190">The result returns.</text>
          <text x="210" y="214">The forecast gets scored.</text>
        </g>
        {NODES.map((node) => (
          <g key={node.name} className={`loop-node ${node.motion}`}>
            <circle cx={node.x} cy={node.y} r="8" className={node.ring} strokeWidth="1.5" />
            <circle cx={node.x} cy={node.y} r="3" className={node.ink} />
            <text
              x={node.x}
              y={node.labelY}
              textAnchor="middle"
              className={`font-mono ${node.ink}`}
              fontSize="17"
              letterSpacing="1.2"
            >
              <tspan>{node.n}</tspan>
              <tspan dx="8">{node.name}</tspan>
            </text>
            <text x={node.x} y={node.noteY} textAnchor="middle" className={`${node.ink} font-sans`} fontSize="17">
              {node.note}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}
