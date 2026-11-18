const MONO = "'JetBrains Mono', ui-monospace, monospace"
const SANS = 'Inter, system-ui, sans-serif'

const NODES = [
  { n: '01', name: 'RULE', note: 'written first', x: 130, y: 70, labelY: 42, noteY: 104 },
  { n: '02', name: 'ODDS', note: 'stated, then scored', x: 310, y: 70, labelY: 42, noteY: 104 },
  { n: '03', name: 'CAUSE', note: 'tested against a baseline', x: 220, y: 250, labelY: 288, noteY: 310 },
] as const

/** Static line drawing of the three steps as one loop. No motion. */
export default function LoopDiagram({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 440 330"
      className={`block h-auto ${className}`}
      role="img"
      aria-label="Diagram of one loop with three points. The rule is written first. The odds are stated, then scored. The cause is tested against a baseline. The result returns to the start."
    >
      <rect x="50" y="70" width="340" height="180" rx="14" fill="none" stroke="#52525b" strokeWidth="1.5" />
      <g fill="none" stroke="#a1a1aa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M215 64 L223 70 L215 76" />
        <path d="M384 155 L390 163 L396 155" />
        <path d="M311 244 L303 250 L311 256" />
        <path d="M137 244 L129 250 L137 256" />
        <path d="M44 165 L50 157 L56 165" />
      </g>
      <g fill="#a1a1aa" fontFamily={SANS} fontSize="13" textAnchor="middle">
        <text x="220" y="158">The result returns.</text>
        <text x="220" y="178">The forecast gets scored.</text>
      </g>
      {NODES.map((node) => (
        <g key={node.name}>
          <circle cx={node.x} cy={node.y} r="9" fill="#000000" stroke="#60a5fa" strokeWidth="2" />
          <circle cx={node.x} cy={node.y} r="3" fill="#60a5fa" />
          <text x={node.x} y={node.labelY} textAnchor="middle" fontFamily={MONO} fontSize="14" fontWeight="500">
            <tspan fill="#60a5fa">{node.n}</tspan>
            <tspan fill="#fafafa" dx="8">
              {node.name}
            </tspan>
          </text>
          <text x={node.x} y={node.noteY} textAnchor="middle" fill="#a1a1aa" fontFamily={SANS} fontSize="13">
            {node.note}
          </text>
        </g>
      ))}
    </svg>
  )
}
