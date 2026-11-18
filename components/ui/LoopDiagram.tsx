const NODES = [
  { n: '01', name: 'RULE', note: 'written first', x: 130, y: 70, labelY: 40, noteY: 104 },
  { n: '02', name: 'ODDS', note: 'stated, then scored', x: 310, y: 70, labelY: 40, noteY: 104 },
  { n: '03', name: 'CAUSE', note: 'tested against a baseline', x: 220, y: 250, labelY: 290, noteY: 312 },
] as const

/** Line drawing of the three steps as one loop. The trace draws once, unless reduced motion is set. */
export default function LoopDiagram({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 440 332"
      width="440"
      height="332"
      className={`block h-auto ${className}`}
      role="img"
      aria-label="Diagram of one loop with three points. The rule is written first. The odds are stated, then scored. The cause is tested against a baseline. The result returns to the start."
    >
      <rect x="50" y="70" width="340" height="180" rx="16" fill="none" className="stroke-line-strong" strokeWidth="1" />
      <rect
        x="50"
        y="70"
        width="340"
        height="180"
        rx="16"
        fill="none"
        pathLength={1}
        className="draw stroke-accent/70"
        strokeWidth="1.25"
      />
      <g fill="none" className="stroke-subtle" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
        <path d="M215 64 L223 70 L215 76" />
        <path d="M384 155 L390 163 L396 155" />
        <path d="M311 244 L303 250 L311 256" />
        <path d="M137 244 L129 250 L137 256" />
        <path d="M44 165 L50 157 L56 165" />
      </g>
      <g className="fill-subtle font-sans" fontSize="13" textAnchor="middle">
        <text x="220" y="156">The result returns.</text>
        <text x="220" y="176">The forecast gets scored.</text>
      </g>
      {NODES.map((node, index) => (
        <g key={node.name} className="fade-late" style={{ ['--i' as string]: index }}>
          <circle cx={node.x} cy={node.y} r="9" className="fill-ink stroke-accent" strokeWidth="1.5" />
          <circle cx={node.x} cy={node.y} r="3" className="fill-accent" />
          <text x={node.x} y={node.labelY} textAnchor="middle" className="font-mono" fontSize="13" letterSpacing="1.5">
            <tspan className="fill-accent">{node.n}</tspan>
            <tspan className="fill-fg" dx="8">
              {node.name}
            </tspan>
          </text>
          <text x={node.x} y={node.noteY} textAnchor="middle" className="fill-muted font-sans" fontSize="13">
            {node.note}
          </text>
        </g>
      ))}
    </svg>
  )
}
