type MarkProps = {
  className?: string
  title?: string
}

export default function Mark({ className = 'h-8 w-8', title = 'The Circuit Method mark' }: MarkProps) {
  return (
    <svg
      className={`block ${className}`}
      viewBox="0.7 2.5 28.48 27.4"
      fill="none"
      role="img"
      aria-label={title}
      shapeRendering="geometricPrecision"
    >
      <path
        d="M23.9 22.14A11.2 11.2 0 1 0 23.9 10.26"
        stroke="currentColor"
        strokeWidth="3.8"
        strokeLinecap="round"
      />
      <circle cx="25.13" cy="9.5" r="2.7" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="25.13" cy="22.9" r="2.7" stroke="currentColor" strokeWidth="1.6" />
      <path d="M23.13 20.1L26.93 11.9" stroke="#ff2d2d" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
