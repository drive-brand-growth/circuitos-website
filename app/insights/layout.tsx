import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Insights',
  description: 'Governed AI decisioning insights from CircuitOS. Calibration, governance, and provable decision quality.',
  openGraph: {
    title: 'Insights | CircuitOS',
    description: 'Governed AI decisioning insights from CircuitOS. Calibration, governance, and provable decision quality.',
    url: 'https://usecircuitos.com/insights',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insights | CircuitOS',
    description: 'Governed AI decisioning insights. Calibration, governance, and provable decision quality.',
  },
  alternates: { canonical: 'https://usecircuitos.com/insights' },
}

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
