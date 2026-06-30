import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Revenue Physics Playground',
  description: 'Interactive decisioning engine — fire signals, watch the Bayesian probability update, and see governed decisions run in real-time. Observe. Decide. Act. Prove.',
  openGraph: {
    title: 'Revenue Physics Playground | CircuitOS',
    description: 'Interactive decisioning engine — fire signals, watch the Bayesian probability update, and see governed decisions run in real-time.',
    url: 'https://usecircuitos.com/playground',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Revenue Physics Playground | CircuitOS',
    description: 'Interactive decisioning engine — fire signals, watch the Bayesian probability update, and see governed decisions run in real-time.',
  },
  alternates: { canonical: 'https://usecircuitos.com/playground' },
}

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
