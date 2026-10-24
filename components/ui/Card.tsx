import Link from 'next/link'

type CardProps = {
  href?: string
  children: React.ReactNode
  className?: string
}

export default function Card({ href, children, className = '' }: CardProps) {
  const cls = `card block p-6 sm:p-7 ${className}`
  if (!href) return <div className={cls}>{children}</div>
  return (
    <Link href={href} className={cls}>
      {children}
    </Link>
  )
}
