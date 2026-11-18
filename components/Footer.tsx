import Link from 'next/link'
import { fill, type SiteContent, type StepEntry } from '@/lib/content'

type FooterProps = {
  site: SiteContent
  steps: StepEntry[]
}

const linkClass =
  'inline-flex min-h-11 max-w-full items-center break-words leading-snug text-muted transition-colors duration-200 hover:text-fg sm:min-h-0 sm:py-1.5'

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (href.startsWith('mailto:') || href.startsWith('http')) {
    return (
      <a href={href} className={linkClass}>
        {children}
      </a>
    )
  }
  return (
    <Link href={href} prefetch={false} className={linkClass}>
      {children}
    </Link>
  )
}

export default function Footer({ site, steps }: FooterProps) {
  const text = (value: string) => fill(value, site.contactEmail)

  return (
    <footer className="border-t border-line">
      <div className="shell py-section-sm">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-3 lg:grid-cols-12">
          <div className="col-span-2 min-w-0 md:col-span-3 lg:col-span-5">
            <p className="flex items-center gap-2 text-[1.0625rem] font-semibold tracking-[-0.02em] text-fg">
              <span aria-hidden="true" className="font-mono text-accent">
                {'//'}
              </span>
              Circuit Method
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{site.tagline}</p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-subtle">{site.coreLine}</p>
          </div>

          <div className="min-w-0 lg:col-span-2">
            <h2 className="eyebrow">Method</h2>
            <ul className="mt-4 text-sm sm:mt-5">
              <li>
                <FooterLink href="/method">Overview</FooterLink>
              </li>
              {steps.map((step) => (
                <li key={step.slug}>
                  <FooterLink href={`/method/${step.slug}`}>{step.entry.name}</FooterLink>
                </li>
              ))}
              <li>
                <FooterLink href="/method/glossary">Glossary</FooterLink>
              </li>
            </ul>
          </div>

          {site.linkGroups.map((group, index) => (
            <div key={group.title} className={`min-w-0 ${index === 0 ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <h2 className="eyebrow">{group.title}</h2>
              <ul className="mt-4 text-sm sm:mt-5">
                {group.links.map((item) => (
                  <li key={item.href}>
                    <FooterLink href={text(item.href)}>{text(item.label)}</FooterLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-line pt-8 text-sm text-subtle">
          © {new Date().getFullYear()} {site.name}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
