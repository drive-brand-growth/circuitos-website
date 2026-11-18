import { notFound } from 'next/navigation'
import PageShell from '@/components/PageShell'
import ProsePage from '@/components/ui/ProsePage'
import Readout from '@/components/ui/Readout'
import { getPage, getSite, metaFor } from '@/lib/content'
import { SCORECARD, summarize } from '@/lib/scorecard'

export async function generateMetadata() {
  return metaFor('proof')
}

export default async function ProofPage() {
  const [page, site] = await Promise.all([getPage('proof'), getSite()])
  if (!page) notFound()
  const record = summarize(SCORECARD)
  return (
    <PageShell>
      <ProsePage
        page={page}
        email={site.contactEmail}
        afterLede={
          <Readout
            items={[
              { label: 'Status', value: record.scored > 0 ? 'First calls scored' : 'In progress' },
              { label: 'Calls recorded', value: String(record.total) },
              { label: 'Calls scored', value: String(record.scored) },
            ]}
          />
        }
      />
    </PageShell>
  )
}
