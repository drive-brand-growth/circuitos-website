type CalloutProps = {
  title?: string
  children: React.ReactNode
}

export default function Callout({ title, children }: CalloutProps) {
  return (
    <aside className="rounded-3xl bg-[var(--bg-elevated)] px-6 py-6 shadow-[var(--shadow)] ring-1 ring-[var(--line)] sm:px-8">
      {title ? <p className="kicker">{title}</p> : null}
      <div className={`${title ? 'mt-3' : ''} text-xl font-semibold tracking-tight text-[var(--fg)] sm:text-2xl`}>
        {children}
      </div>
    </aside>
  )
}
