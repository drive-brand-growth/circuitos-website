import Callout from '@/components/ui/Callout'
import Card from '@/components/ui/Card'
import Container from '@/components/ui/Container'
import DataTable from '@/components/ui/DataTable'
import EmptyChart from '@/components/ui/EmptyChart'
import SectionHeader from '@/components/ui/SectionHeader'
import { fill, type PageContent, type StepEntry, type TermEntry } from '@/lib/content'

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
            {page.lede.map((paragraph) => (
              <p key={paragraph}>{text(paragraph)}</p>
            ))}
          </div>
        </div>

        {page.sections.map((section, index) => (
          <section key={`${section.heading}-${index}`} className="mt-20 sm:mt-28">
            {section.heading ? (
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{text(section.heading)}</h2>
            ) : null}
            <div className={`${section.heading ? 'mt-6' : ''} space-y-5 text-[var(--muted)]`}>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{text(paragraph)}</p>
              ))}
            </div>
            {section.listStyle === 'bullets' && section.items.length > 0 ? (
              <ul className="reading mt-6 list-disc space-y-3 pl-5 text-[var(--muted)]">
                {section.items.map((item) => (
                  <li key={item.text || item.label}>{text(item.text || item.label)}</li>
                ))}
              </ul>
            ) : null}
            {section.listStyle === 'numbers' && section.items.length > 0 ? (
              <ol className="reading mt-6 list-decimal space-y-3 pl-5 text-[var(--muted)]">
                {section.items.map((item) => (
                  <li key={item.text || item.label}>{text(item.text || item.label)}</li>
                ))}
              </ol>
            ) : null}
            {section.listStyle === 'cards' && section.items.length > 0 ? (
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {section.items.map((item) => (
                  <li key={item.label || item.text}>
                    <Card href={item.href || undefined}>
                      {item.label ? <h3 className="text-lg font-semibold">{text(item.label)}</h3> : null}
                      {item.text ? <p className="mt-2 text-[var(--muted)]">{text(item.text)}</p> : null}
                    </Card>
                  </li>
                ))}
              </ul>
            ) : null}
            {section.listStyle === 'links' && section.items.length > 0 ? (
              <p className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                {section.items.map((item) => (
                  <a key={item.href || item.label} className="link" href={text(item.href)}>
                    {text(item.label)}
                  </a>
                ))}
              </p>
            ) : null}
            {section.callout ? (
              <div className="mt-8">
                <Callout>{text(section.callout)}</Callout>
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
                      <p className="mt-3 max-w-2xl text-[var(--muted)]">{step.entry.lede[0]}</p>
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
                      <p className="mt-2 text-sm text-[var(--muted)]">{term.entry.text}</p>
                    </Card>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </Container>
    </article>
  )
}
