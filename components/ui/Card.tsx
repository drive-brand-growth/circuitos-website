import Link from 'next/link'

type CardProps = {
  href?: string
  children: React.ReactNode
  className?: string
}

export default function Card({ href, children, className = '' }: CardProps) {
  if (!href) return <div className={`panel p-6 md:p-8 ${className}`}>{children}</div>
  return (
    <Link href={href} className={`panel-link p-6 md:p-8 ${className}`}>
      {children}
    </Link>
  )
}
