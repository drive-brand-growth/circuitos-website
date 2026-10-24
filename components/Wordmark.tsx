import Mark from '@/components/Mark'

type WordmarkProps = {
  className?: string
  markClassName?: string
  compact?: boolean
}

export default function Wordmark({
  className = '',
  markClassName = 'h-8 w-8',
  compact = false,
}: WordmarkProps) {
  return (
    <span className={`inline-flex items-center gap-2.5 text-inherit ${className}`}>
      <Mark className={`${markClassName} shrink-0`} />
      <span className={`font-semibold tracking-tight leading-none ${compact ? 'text-[15px]' : 'text-base'}`}>
        The Circuit Method
        <sup className="text-[0.55em] ml-0.5 font-semibold">™</sup>
      </span>
    </span>
  )
}
