import Wordmark from '@/components/Wordmark'
import { fill, type SiteContent, type StepEntry } from '@/lib/content'

type FooterProps = {
  site: SiteContent
  steps: StepEntry[]
}

export default function Footer({ site, steps }: FooterProps) {
  const text = (value: string) => fill(value, site.contactEmail)

  return (
    <footer className="border-t border-[var(--line)] px-6 py-20">
      <div className="mx-auto grid max-w-page gap-12 md:grid-cols-4">
        <div>
          <span className="text-[var(--fg)]">
            <Wordmark markClassName="h-8 w-8" />
          </span>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-[var(--muted)]">{site.coreLine}</p>
        </div>
        <div>
          <h2 className="kicker">Method</h2>
          <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
            <li>
              <a className="hover:text-[var(--fg)]" href="/method">
                Overview
              </a>
            </li>
            {steps.map((step) => (
              <li key={step.slug}>
                <a className="hover:text-[var(--fg)]" href={`/method/${step.slug}`}>
                  {step.entry.name}
                </a>
              </li>
            ))}
            <li>
              <a className="hover:text-[var(--fg)]" href="/method/glossary">
                Glossary
              </a>
            </li>
          </ul>
        </div>
        {site.linkGroups.map((group) => (
          <div key={group.title}>
            <h2 className="kicker">{group.title}</h2>
            <ul className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              {group.links.map((item) => (
                <li key={item.href}>
                  <a className="hover:text-[var(--fg)]" href={text(item.href)}>
                    {text(item.label)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mx-auto mt-16 max-w-page border-t border-[var(--line)] pt-8 text-sm text-[var(--muted)]">
        © {new Date().getFullYear()} Noel Pena. {site.name}.
      </p>
    </footer>
  )
}
