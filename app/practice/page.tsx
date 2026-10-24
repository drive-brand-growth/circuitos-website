import { notFound } from 'next/navigation'
import PageShell from '@/components/PageShell'
import PracticeApp from '@/components/playground/PracticeApp'
import { getPage, metaFor } from '@/lib/content'

export async function generateMetadata() {
  return metaFor('practice')
}

export default async function PracticePage() {
  const page = await getPage('practice')
  if (!page) notFound()
  const stages = page.sections[0]?.items ?? []
  const close = page.sections[1]

  return (
    <PageShell>
      <div className="practice">
        <PracticeApp
          copy={{
            kicker: page.kicker,
            headline: page.headline,
            lede: page.lede[0] ?? '',
            stages: stages.map((item) => ({ label: item.label, text: item.text })),
            closeTitle: close?.heading ?? '',
            closeBody: close?.paragraphs[0] ?? '',
            closeHref: close?.items[0]?.href || '/forecasting',
            closeLabel: close?.items[0]?.label || 'How a forecast is scored',
          }}
        />
      </div>
    </PageShell>
  )
}
