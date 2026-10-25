import { fill, type SiteContent, type StepEntry } from '@/lib/content'

type FooterProps = {
  site: SiteContent
  steps: StepEntry[]
}

export default function Footer({ site, steps }: FooterProps) {
  const text = (value: string) => fill(value, site.contactEmail)

  return (
    <footer className="py-16 px-6 border-t border-[#27272a]">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <span className="text-xl font-semibold">
              <span className="text-blue-500">//</span> Circuit Method
            </span>
            <p className="text-sm text-[#71717a] mt-2 leading-relaxed">{site.tagline}</p>
            <p className="text-xs text-[#52525b] mt-4 leading-relaxed">{site.coreLine}</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[#a1a1aa] mb-4">Method</h2>
            <ul className="space-y-3 text-sm text-[#71717a]">
              <li>
                <a href="/method" className="hover:text-white transition-colors">
                  Overview
                </a>
              </li>
              {steps.map((step) => (
                <li key={step.slug}>
                  <a href={`/method/${step.slug}`} className="hover:text-white transition-colors">
                    {step.entry.name}
                  </a>
                </li>
              ))}
              <li>
                <a href="/method/glossary" className="hover:text-white transition-colors">
                  Glossary
                </a>
              </li>
            </ul>
          </div>

          {site.linkGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#a1a1aa] mb-4">{group.title}</h2>
              <ul className="space-y-3 text-sm text-[#71717a]">
                {group.links.map((item) => (
                  <li key={item.href}>
                    <a href={text(item.href)} className="hover:text-white transition-colors">
                      {text(item.label)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-[#27272a] text-center text-sm text-[#71717a]">
          © {new Date().getFullYear()} Noel Pena. {site.name}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
