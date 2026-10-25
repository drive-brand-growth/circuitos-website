type ContainerProps = {
  children: React.ReactNode
  width?: 'prose' | 'page'
  className?: string
}

export default function Container({ children, width = 'prose', className = '' }: ContainerProps) {
  const max = width === 'page' ? 'max-w-4xl' : 'max-w-3xl'
  return <div className={`mx-auto w-full ${max} px-6 ${className}`}>{children}</div>
}
