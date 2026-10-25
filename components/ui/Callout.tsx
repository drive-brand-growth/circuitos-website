type CalloutProps = {
  title?: string
  children: React.ReactNode
}

export default function Callout({ title, children }: CalloutProps) {
  return (
    <aside className="card rounded-xl px-6 py-6 md:px-8">
      {title ? <p className="text-sm font-medium text-blue-400 mb-3">{title}</p> : null}
      <div className="text-xl md:text-2xl font-bold tracking-[-0.02em] text-white">{children}</div>
    </aside>
  )
}
