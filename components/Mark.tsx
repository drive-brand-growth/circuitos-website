type MarkProps = {
  className?: string
  title?: string
}

export default function Mark({ className = 'h-8 w-8', title = 'The Circuit Method mark' }: MarkProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      role="img"
      aria-label={title}
    >
      <path
        d="M157.7 136.1A68 68 0 1 0 157.7 63.9"
        stroke="currentColor"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <circle cx="162" cy="62" r="13.5" stroke="currentColor" strokeWidth="7.5" />
      <circle cx="162" cy="138" r="13.5" stroke="currentColor" strokeWidth="7.5" />
      <path d="M154 120L172 80" stroke="#ff2d2d" strokeWidth="12" strokeLinecap="round" />
    </svg>
  )
}
