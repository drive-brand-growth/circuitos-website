export default function EmptyChart() {
  return (
    <figure className="card rounded-xl p-4 sm:p-6">
      <svg
        viewBox="0 0 420 360"
        role="img"
        aria-label="Empty calibration chart. Stated odds against how often the call happened. The diagonal is the target line. No calls have been scored in public yet, so no results are plotted."
      >
        <line x1="60" y1="40" x2="60" y2="280" stroke="#3f3f46" />
        <line x1="60" y1="280" x2="380" y2="280" stroke="#3f3f46" />
        <line x1="60" y1="280" x2="380" y2="40" stroke="#3b82f6" strokeWidth="2" />
        <text x="220" y="320" textAnchor="middle" fill="#a1a1aa" fontSize="13" fontFamily="Inter, system-ui, sans-serif">
          Stated odds, low to high
        </text>
        <text
          x="24"
          y="170"
          fill="#a1a1aa"
          fontSize="13"
          fontFamily="Inter, system-ui, sans-serif"
          transform="rotate(-90 24 170)"
        >
          How often it happened
        </text>
        <text x="248" y="78" fill="#60a5fa" fontSize="12" fontFamily="Inter, system-ui, sans-serif">
          The line you are aiming at
        </text>
        <text x="220" y="236" textAnchor="middle" fill="#d4d4d8" fontSize="13" fontFamily="Inter, system-ui, sans-serif">
          No calls scored yet
        </text>
      </svg>
      <figcaption className="px-2 pb-2 text-sm text-[#a1a1aa]">
        Empty on purpose. No calls have been scored in public yet, so nothing is plotted. The diagonal is the target,
        not a result. Scored calls will be listed on the{' '}
        <a href="/scorecard" className="text-blue-400 underline underline-offset-2 hover:text-blue-300">
          scorecard
        </a>{' '}
        first.
      </figcaption>
    </figure>
  )
}
