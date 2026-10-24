import Link from 'next/link'

type ButtonProps = {
  href?: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'quiet'
  type?: 'button' | 'submit'
  className?: string
  onClick?: () => void
}

const styles = {
  primary: 'btn-primary',
  secondary:
    'bg-[var(--bg-elevated)] text-[var(--fg)] shadow-[var(--shadow)] ring-1 ring-[var(--line)] hover:opacity-80',
  quiet: 'text-[var(--fg)] hover:opacity-70',
}

export default function Button({
  href,
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  onClick,
}: ButtonProps) {
  const cls = `inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition duration-200 ${styles[variant]} ${className}`
  if (href) {
    const external = href.startsWith('mailto:') || href.startsWith('http')
    if (external) {
      return (
        <a href={href} className={cls}>
          {children}
        </a>
      )
    }
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type} onClick={onClick} className={cls}>
      {children}
    </button>
  )
}
