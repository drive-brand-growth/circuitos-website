import Link from 'next/link'

const TICKS = [0.25, 0.5, 0.75]

/**
 * The calibration chart with nothing plotted. Labels are real text, not drawn text,
 * so they stay readable (14px or more) when the drawing scales down on a phone.
 */
export default function EmptyChart() {
  return (
    <figure className="panel p-5 sm:p-7">
      <div className="mx-auto max-w-xl">
        <p className="mb-3 text-xs text-muted">
          <span aria-hidden="true">↑ </span>How often it happened
        </p>
        <div className="relative">
          <svg
            viewBox="0 0 400 300"
            width="400"
            height="300"
            className="block h-auto w-full"
            role="img"
            aria-label="Empty calibration chart. Stated odds run across. How often the call happened runs up. The dashed diagonal is the target line. No calls have been scored in public yet, so no results are plotted."
          >
            {TICKS.map((tick) => (
              <g key={tick} className="stroke-line" strokeWidth="1">
                <line x1={tick * 400} y1="0" x2={tick * 400} y2="300" />
                <line x1="0" y1={300 - tick * 300} x2="400" y2={300 - tick * 300} />
              </g>
            ))}
            <line x1="0.5" y1="0" x2="0.5" y2="300" className="stroke-line-strong" />
            <line x1="0" y1="299.5" x2="400" y2="299.5" className="stroke-line-strong" />
            <line x1="0" y1="300" x2="400" y2="0" className="stroke-accent" strokeWidth="1.5" strokeDasharray="5 5" />
          </svg>
          <p className="absolute bottom-[14%] right-[4%] max-w-[55%] text-right font-mono text-xs uppercase tracking-[0.08em] text-soft">
            No calls scored yet
          </p>
          <p className="absolute left-[4%] top-[6%] max-w-[50%] text-xs text-accent">Dashed line: the line you are aiming at</p>
        </div>
        <p className="mt-3 text-right text-xs text-muted">
          Stated odds, low to high<span aria-hidden="true"> →</span>
        </p>
      </div>
      <figcaption className="mx-auto mt-5 max-w-xl text-sm text-muted">
        Empty on purpose. No calls have been scored in public yet, so nothing is plotted. The diagonal is the target,
        not a result. Scored calls will be listed on the{' '}
        <Link href="/scorecard" prefetch={false} className="link">
          scorecard
        </Link>{' '}
        first.
      </figcaption>
    </figure>
  )
}
