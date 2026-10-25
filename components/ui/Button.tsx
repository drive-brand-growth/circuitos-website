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
  primary: 'btn-primary text-white rounded-lg font-semibold',
  secondary: 'border border-[#27272a] rounded-lg font-semibold hover:bg-white/5 transition-colors',
  quiet: 'text-[#a1a1aa] hover:text-white transition-colors',
}

export default function Button({
  href,
  children,
  variant = 'primary',
  type = 'button',
  className = '',
  onClick,
}: ButtonProps) {
  const cls = `inline-flex items-center justify-center px-8 py-3.5 text-base ${styles[variant]} ${className}`
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
