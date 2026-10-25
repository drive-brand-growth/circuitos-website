import Link from 'next/link'

type CardProps = {
  href?: string
  children: React.ReactNode
  className?: string
}

export default function Card({ href, children, className = '' }: CardProps) {
  const cls = `card rounded-xl block p-5 md:p-8 ${className}`
  if (!href) return <div className={cls}>{children}</div>
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  )
}
