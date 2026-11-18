type ContainerProps = {
  children: React.ReactNode
  width?: 'prose' | 'page'
  className?: string
}

/** Page column. It shares its left edge with the header so every page lines up. */
export default function Container({ children, width = 'prose', className = '' }: ContainerProps) {
  const max = width === 'page' ? 'max-w-4xl' : 'max-w-3xl'
  return (
    <div className={`shell ${className}`}>
      <div className={max}>{children}</div>
    </div>
  )
}
