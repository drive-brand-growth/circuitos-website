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
  primary: 'btn-solid',
  secondary: 'btn-outline',
  quiet: 'btn text-muted hover:text-fg',
}

export default function Button({
  href,
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  onClick,
}: ButtonProps) {
  const cls = `${styles[variant]} ${className}`
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
