type HeaderProps = {
  kicker?: string
  title: string
  lede?: string
  align?: 'left' | 'center'
  as?: 'h1' | 'h2'
}

export default function SectionHeader({
  kicker,
  title,
  lede,
  align = 'left',
  as = 'h2',
}: HeaderProps) {
  const Tag = as
  const size =
    as === 'h1'
      ? 'text-5xl sm:text-6xl lg:text-7xl'
      : 'text-4xl sm:text-5xl'
  return (
    <header className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {kicker ? <p className="kicker">{kicker}</p> : null}
      <Tag className={`${kicker ? 'mt-4' : ''} ${size} font-semibold tracking-tight text-[var(--fg)]`}>
        {title}
      </Tag>
      {lede ? (
        <p className={`reading mt-6 text-[var(--muted)] ${align === 'center' ? 'mx-auto' : ''}`}>{lede}</p>
      ) : null}
    </header>
  )
}
