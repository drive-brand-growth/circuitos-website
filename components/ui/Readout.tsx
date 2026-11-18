type ReadoutProps = {
  items: { label: string; value: string }[]
  className?: string
}

/** A row of small instrument style readings. Values come from real data, never from copy. */
export default function Readout({ items, className = '' }: ReadoutProps) {
  return (
    <dl className={`grid grid-cols-2 overflow-hidden rounded-panel border border-line sm:grid-cols-3 ${items.length > 3 ? 'lg:grid-cols-5' : ''} ${className}`}>
      {items.map((item, index) => (
        <div
          key={item.label}
          className={`-mb-px -mr-px border-b border-r border-line px-5 py-5 ${
            items.length % 2 === 1 && index === items.length - 1 ? 'max-sm:col-span-2' : ''
          }`}
        >
          <dt className="font-mono text-eyebrow uppercase leading-normal text-subtle">{item.label}</dt>
          <dd className="mt-2 font-mono text-sm text-soft">{item.value}</dd>
        </div>
      ))}
    </dl>
  )
}
