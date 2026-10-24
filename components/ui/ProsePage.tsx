import Callout from '@/components/ui/Callout'
import Card from '@/components/ui/Card'
import Container from '@/components/ui/Container'
import DataTable from '@/components/ui/DataTable'
import EmptyChart from '@/components/ui/EmptyChart'
import SectionHeader from '@/components/ui/SectionHeader'
import { fill, isHeldCopy, type PageContent, type StepEntry, type TermEntry } from '@/lib/content'

type ProsePageProps = {
  page: PageContent
  email: string
  steps?: StepEntry[]
  terms?: TermEntry[]
}

export default function ProsePage({ page, email, steps = [], terms = [] }: ProsePageProps) {
  const text = (value: string | null | undefined) => fill(value, email)
  const loopTerms = terms.filter((term) => term.entry.group === 'loop')

  return (
    <article className="pb-24 pt-16 sm:pt-24">
      <Container>
        <div className="rise">
          <SectionHeader as="h1" kicker={text(page.kicker)} title={text(page.headline)} />
          {page.updated ? (
            <p className="mt-4 text-sm text-[var(--muted)]">Last updated: {text(page.updated)}</p>
          ) : null}
          <div className="mt-8 space-y-6 text-[var(--muted)]">
            {page.lede.filter((paragraph) => !isHeldCopy(paragraph)).map((paragraph) => (
              <p key={paragraph}>{text(paragraph)}</p>
            ))}
          </div>
        </div>

        {page.sections.map((section, index) => {
          const paragraphs = section.paragraphs.filter((paragraph) => !isHeldCopy(paragraph))
          const items = section.items.filter((item) => !isHeldCopy(item.text) && !isHeldCopy(item.label))
          const callout = section.callout && !isHeldCopy(section.callout) ? section.callout : ''
          const hasList = section.listStyle !== 'none' && items.length > 0
          const hasEmbed = section.embed === 'table' || section.embed === 'chart' || section.embed === 'steps' || section.embed === 'terms'
          if (!paragraphs.length && !hasList && !callout && !hasEmbed) return null
          return (
          <section key={`${section.heading}-${index}`} className="mt-20 sm:mt-28">
            {section.heading && !isHeldCopy(section.heading) ? (
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{text(section.heading)}</h2>
            ) : null}
            {paragraphs.length > 0 ? (
              <div className={`${section.heading ? 'mt-6' : ''} space-y-5 text-[var(--muted)]`}>
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{text(paragraph)}</p>
                ))}
              </div>
            ) : null}
            {section.listStyle === 'bullets' && items.length > 0 ? (
              <ul className="reading mt-6 list-disc space-y-3 pl-5 text-[var(--muted)]">
                {items.map((item) => (
                  <li key={item.text || item.label}>{text(item.text || item.label)}</li>
                ))}
              </ul>
            ) : null}
            {section.listStyle === 'numbers' && items.length > 0 ? (
              <ol className="reading mt-6 list-decimal space-y-3 pl-5 text-[var(--muted)]">
                {items.map((item) => (
                  <li key={item.text || item.label}>{text(item.text || item.label)}</li>
                ))}
              </ol>
            ) : null}
            {section.listStyle === 'cards' && items.length > 0 ? (
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {items.map((item) => (
                  <li key={item.label || item.text}>
                    <Card href={item.href || undefined}>
                      {item.label ? <h3 className="text-lg font-semibold">{text(item.label)}</h3> : null}
                      {item.text ? <p className="mt-2 text-[var(--muted)]">{text(item.text)}</p> : null}
                    </Card>
                  </li>
                ))}
              </ul>
            ) : null}
            {section.listStyle === 'links' && items.length > 0 ? (
              <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {items.map((item) => (
                  <a key={item.href || item.label} className="link" href={text(item.href)}>
                    {text(item.label)}
                  </a>
                ))}
              </p>
            ) : null}
            {callout ? (
              <div className="mt-8">
                <Callout>{text(callout)}</Callout>
              </div>
            ) : null}
            {section.embed === 'table' && page.table.columns.length > 0 ? (
              <div className="mt-6">
                <DataTable
                  caption={text(page.table.caption)}
                  columns={page.table.columns}
                  rows={page.table.rows.map((row) => row.cells)}
                />
              </div>
            ) : null}
            {section.embed === 'chart' ? (
              <div className="mt-6">
                <EmptyChart />
              </div>
            ) : null}
            {section.embed === 'steps' ? (
              <ol className="mt-8 grid gap-4">
                {steps.map((step) => (
                  <li key={step.slug}>
                    <Card href={`/method/${step.slug}`} className="md:p-8">
                      <div className="flex items-baseline justify-between gap-4">
                        <p className="font-mono text-xs text-[var(--muted)]">0{step.entry.order}</p>
                        <p className="kicker">{step.entry.kicker}</p>
                      </div>
                      <h3 className="mt-3 text-2xl font-semibold">{step.entry.name}</h3>
                      <p className="mt-3 max-w-2xl text-[var(--muted)]">
                        {step.entry.lede.find((paragraph) => !isHeldCopy(paragraph))}
                      </p>
                    </Card>
                  </li>
                ))}
              </ol>
            ) : null}
            {section.embed === 'terms' ? (
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {loopTerms.map((term) => (
                  <li key={term.slug}>
                    <Card href={`/method/glossary#${term.slug}`}>
                      <h3 className="font-semibold">{term.entry.name}</h3>
                      <p className="mt-2 text-sm text-[var(--muted)]">
                        {isHeldCopy(term.entry.text) ? null : term.entry.text}
                      </p>
                    </Card>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
          )
        })}
      </Container>
    </article>
  )
}
