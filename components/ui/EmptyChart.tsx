export default function EmptyChart() {
  return (
    <figure className="rounded-3xl bg-[var(--bg-elevated)] p-4 shadow-[var(--shadow)] ring-1 ring-[var(--line)] sm:p-6">
      <svg
        viewBox="0 0 420 360"
        role="img"
        aria-label="Empty chart. Stated odds against how often the call happened. A diagonal is the line you are aiming at. No results are plotted."
      >
        <line x1="60" y1="40" x2="60" y2="280" stroke="var(--line)" />
        <line x1="60" y1="280" x2="380" y2="280" stroke="var(--line)" />
        <line x1="60" y1="280" x2="380" y2="40" stroke="var(--switch)" strokeWidth="2" />
        <text x="220" y="320" textAnchor="middle" fill="var(--muted)" fontSize="13" fontFamily="system-ui, sans-serif">
          Stated odds, low to high
        </text>
        <text
          x="24"
          y="170"
          fill="var(--muted)"
          fontSize="13"
          fontFamily="system-ui, sans-serif"
          transform="rotate(-90 24 170)"
        >
          How often it happened
        </text>
        <text x="248" y="78" fill="var(--switch)" fontSize="12" fontFamily="system-ui, sans-serif">
          The line you are aiming at
        </text>
      </svg>
      <figcaption className="px-2 pb-2 text-sm text-[var(--muted)]">
        No results are plotted. This is the shape of the test, not a score from a business.
      </figcaption>
    </figure>
  )
}
