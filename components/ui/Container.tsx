type ContainerProps = {
  children: React.ReactNode
  width?: 'prose' | 'page'
  className?: string
}

export default function Container({ children, width = 'prose', className = '' }: ContainerProps) {
  const max = width === 'page' ? 'max-w-page' : 'max-w-prose'
  return <div className={`mx-auto w-full ${max} px-6 ${className}`}>{children}</div>
}
