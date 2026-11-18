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
  const size = as === 'h1' ? 'text-title' : 'text-heading'
  return (
    <header className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {kicker ? <p className="eyebrow mb-5">{kicker}</p> : null}
      <Tag className={`${size} text-fg`}>{title}</Tag>
      {lede ? <p className={`mt-5 text-lead text-muted ${align === 'center' ? 'mx-auto' : ''}`}>{lede}</p> : null}
    </header>
  )
}
