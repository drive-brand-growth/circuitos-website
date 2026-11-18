type CalloutProps = {
  title?: string
  children: React.ReactNode
}

export default function Callout({ title, children }: CalloutProps) {
  return (
    <aside className="border-l-2 border-accent pl-6 py-1">
      {title ? <p className="eyebrow mb-3">{title}</p> : null}
      <div className="text-heading text-fg">{children}</div>
    </aside>
  )
}
