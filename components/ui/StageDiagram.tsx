type StageNode = {
  slug: string
  name: string
  href: string
  accent?: boolean
}

type StageDiagramProps = {
  stages: StageNode[]
  centerTitle: string
  centerLine: string
}

const NODES = [
  { x: 320, y: 148 },
  { x: 478, y: 262 },
  { x: 418, y: 446 },
  { x: 222, y: 446 },
  { x: 162, y: 262 },
] as const

export default function StageDiagram({ stages, centerTitle, centerLine }: StageDiagramProps) {
  if (stages.length !== 5) {
    return (
      <ol className="grid gap-4 sm:grid-cols-2">
        {stages.map((stage, index) => (
          <li key={stage.slug}>
            <a href={stage.href} className="card block p-5">
              <span className="font-mono text-xs text-[var(--muted)]">0{index + 1}</span>
              <span className="mt-2 block font-semibold">{stage.name}</span>
            </a>
          </li>
        ))}
      </ol>
    )
  }

  return (
    <svg
      viewBox="0 0 640 620"
      className="mx-auto h-auto w-full max-w-xl"
      role="img"
      aria-label="Five stages arranged as a closed circuit"
    >
      <circle cx="320" cy="310" r="168" fill="none" stroke="var(--fg)" strokeOpacity="0.88" strokeWidth="3" />
      <text
        x="320"
        y="300"
        textAnchor="middle"
        fill="var(--fg)"
        fontSize="18"
        fontFamily="system-ui, sans-serif"
        fontWeight="600"
      >
        {centerTitle}
      </text>
      <text
        x="320"
        y="328"
        textAnchor="middle"
        fill="var(--muted)"
        fontSize="13"
        fontFamily="system-ui, sans-serif"
      >
        {centerLine}
      </text>
      {stages.map((stage, index) => {
        const node = NODES[index]
        return (
          <a key={stage.slug} href={stage.href}>
            <circle
              cx={node.x}
              cy={node.y}
              r="54"
              fill="var(--bg-elevated)"
              stroke={stage.accent ? 'var(--switch)' : 'var(--fg)'}
              strokeWidth={stage.accent ? 3 : 1.5}
            />
            <text
              x={node.x}
              y={node.y - 4}
              textAnchor="middle"
              fill="var(--fg)"
              fontSize="16"
              fontFamily="system-ui, sans-serif"
              fontWeight="600"
            >
              {stage.name}
            </text>
            <text
              x={node.x}
              y={node.y + 16}
              textAnchor="middle"
              fill="var(--muted)"
              fontSize="11"
              fontFamily="ui-monospace, monospace"
            >
              0{index + 1}
            </text>
          </a>
        )
      })}
    </svg>
  )
}
