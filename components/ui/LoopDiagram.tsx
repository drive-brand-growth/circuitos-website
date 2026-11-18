const NODES = [
  { n: '01', name: 'RULE', note: 'written first', x: 130, y: 74, labelY: 40, noteY: 112 },
  { n: '02', name: 'ODDS', note: 'stated, then scored', x: 310, y: 74, labelY: 40, noteY: 112 },
  { n: '03', name: 'CAUSE', note: 'tested against a baseline', x: 220, y: 264, labelY: 306, noteY: 332 },
] as const

/**
 * Line drawing of the three steps as one loop. The trace draws once, unless reduced motion is set.
 * Label sizes are set so they stay at 14px or more when the drawing scales down to a 390px screen.
 */
export default function LoopDiagram({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="24 12 392 336"
      width="392"
      height="336"
      className={`block h-auto ${className}`}
      role="img"
      aria-label="Diagram of one loop with three points. The rule is written first. The odds are stated, then scored. The cause is tested against a baseline. The result returns to the start."
    >
      <rect x="50" y="74" width="340" height="190" rx="16" fill="none" className="stroke-line-strong" strokeWidth="1" />
      <rect
        x="50"
        y="74"
        width="340"
        height="190"
        rx="16"
        fill="none"
        pathLength={1}
        className="draw stroke-accent/70"
        strokeWidth="1.25"
      />
      <g fill="none" className="stroke-subtle" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        <path d="M215 68 L223 74 L215 80" />
        <path d="M384 165 L390 173 L396 165" />
        <path d="M311 258 L303 264 L311 270" />
        <path d="M137 258 L129 264 L137 270" />
        <path d="M44 175 L50 167 L56 175" />
      </g>
      <g className="fill-subtle font-sans" fontSize="17" textAnchor="middle">
        <text x="220" y="170">The result returns.</text>
        <text x="220" y="196">The forecast gets scored.</text>
      </g>
      {NODES.map((node, index) => (
        <g key={node.name} className="fade-late" style={{ ['--i' as string]: index }}>
          <circle cx={node.x} cy={node.y} r="9" className="fill-ink stroke-accent" strokeWidth="1.5" />
          <circle cx={node.x} cy={node.y} r="3" className="fill-accent" />
          <text x={node.x} y={node.labelY} textAnchor="middle" className="font-mono" fontSize="17" letterSpacing="1.5">
            <tspan className="fill-accent">{node.n}</tspan>
            <tspan className="fill-fg" dx="8">
              {node.name}
            </tspan>
          </text>
          <text x={node.x} y={node.noteY} textAnchor="middle" className="fill-muted font-sans" fontSize="17">
            {node.note}
          </text>
        </g>
      ))}
    </svg>
  )
}
