import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Revenue intelligence insights from CircuitOS. Governance, scoring, and the future of autonomous revenue operations.',
  openGraph: {
    title: 'Insights | CircuitOS',
    description: 'Revenue intelligence insights from CircuitOS. Governance, scoring, and autonomous revenue operations.',
    url: 'https://usecircuitos.com/insights',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insights | CircuitOS',
    description: 'Revenue intelligence insights. Governance, scoring, and autonomous revenue operations.',
  },
  alternates: { canonical: 'https://usecircuitos.com/insights' },
}

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
