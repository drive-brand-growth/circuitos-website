import Link from 'next/link'

const TICKS = [0.25, 0.5, 0.75]

export default function EmptyChart() {
  return (
    <figure className="panel p-4 sm:p-6">
      <svg
        viewBox="0 0 420 340"
        width="420"
        height="340"
        className="mx-auto block h-auto w-full max-w-xl"
        role="img"
        aria-label="Empty calibration chart. Stated odds against how often the call happened. The diagonal is the target line. No calls have been scored in public yet, so no results are plotted."
      >
        {TICKS.map((tick) => (
          <g key={tick} className="stroke-line" strokeWidth="1">
            <line x1={60 + tick * 320} y1="40" x2={60 + tick * 320} y2="280" />
            <line x1="60" y1={280 - tick * 240} x2="380" y2={280 - tick * 240} />
          </g>
        ))}
        <line x1="60" y1="40" x2="60" y2="280" className="stroke-line-strong" />
        <line x1="60" y1="280" x2="380" y2="280" className="stroke-line-strong" />
        <line x1="60" y1="280" x2="380" y2="40" className="stroke-accent" strokeWidth="1.5" strokeDasharray="5 5" />
        <text x="220" y="316" textAnchor="middle" fontSize="13" className="fill-muted font-sans">
          Stated odds, low to high
        </text>
        <text x="26" y="160" textAnchor="middle" fontSize="13" className="fill-muted font-sans" transform="rotate(-90 26 160)">
          How often it happened
        </text>
        <text x="322" y="62" textAnchor="end" fontSize="12" className="fill-accent font-sans">
          The line you are aiming at
        </text>
        <text x="290" y="255" textAnchor="middle" fontSize="12" letterSpacing="1.2" className="fill-soft font-mono">
          NO CALLS SCORED YET
        </text>
      </svg>
      <figcaption className="px-2 pb-2 pt-4 text-sm leading-relaxed text-muted">
        Empty on purpose. No calls have been scored in public yet, so nothing is plotted. The diagonal is the target,
        not a result. Scored calls will be listed on the{' '}
        <Link href="/scorecard" className="link">
          scorecard
        </Link>{' '}
        first.
      </figcaption>
    </figure>
  )
}
