'use client'

export default function IntegrationBar() {
  const integrations = [
    'GoHighLevel',
    'Instantly.ai',
    'Google Analytics',
    'PostgreSQL',
    'Docker',
    'n8n',
  ]

  return (
    <section className="py-12 border-y border-[#27272a]">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-sm text-[#52525b] mb-8">Integrated with the tools you already use</p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-[#52525b]">
          {integrations.map((name) => (
            <span key={name} className="text-sm font-semibold tracking-wide uppercase">{name}</span>
          ))}
        </div>
      </div>
    </section>
  )
}
