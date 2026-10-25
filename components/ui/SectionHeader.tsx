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
  const size = as === 'h1' ? 'text-4xl md:text-5xl' : 'text-3xl md:text-4xl'
  return (
    <header className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      {kicker ? <p className="text-sm font-medium text-blue-400 mb-3">{kicker}</p> : null}
      <Tag className={`${size} font-bold tracking-[-0.02em] text-white`}>{title}</Tag>
      {lede ? (
        <p className={`mt-4 text-lg text-[#a1a1aa] leading-[1.6] ${align === 'center' ? 'mx-auto' : ''}`}>{lede}</p>
      ) : null}
    </header>
  )
}
