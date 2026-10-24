import { notFound } from 'next/navigation'
import PageShell from '@/components/PageShell'
import PracticeApp from '@/components/playground/PracticeApp'
import { getPage, isHeldCopy, metaFor } from '@/lib/content'

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
            kicker: isHeldCopy(page.kicker) ? '' : page.kicker,
            headline: page.headline,
            lede: page.lede.find((paragraph) => !isHeldCopy(paragraph)) ?? '',
            stages: stages
              .filter((item) => !isHeldCopy(item.label) && !isHeldCopy(item.text))
              .map((item) => ({ label: item.label, text: item.text })),
            closeTitle: close?.heading && !isHeldCopy(close.heading) ? close.heading : '',
            closeBody: close?.paragraphs?.find((paragraph) => !isHeldCopy(paragraph)) ?? '',
            closeHref: close?.items[0]?.href || '/forecasting',
            closeLabel:
              close?.items.find((item) => !isHeldCopy(item.label))?.label || 'How a forecast is scored',
          }}
        />
      </div>
    </PageShell>
  )
}
