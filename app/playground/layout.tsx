import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Revenue Physics Playground',
  description: 'Interactive Bayesian scoring engine with social intelligence, DMN routing, and real-time lead qualification. See how CircuitOS evaluates leads in real-time.',
  openGraph: {
    title: 'Revenue Physics Playground | CircuitOS',
    description: 'Interactive Bayesian scoring engine — fire signals, watch scores update, see DMN routing in real-time.',
    type: 'website',
  },
}

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
