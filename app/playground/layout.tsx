import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Revenue Physics Playground',
  description: 'Interactive scoring engine — fire signals, watch conviction scores update, see autonomous decisions in real-time. Score. Decide. Prove.',
  openGraph: {
    title: 'Revenue Physics Playground | CircuitOS',
    description: 'Interactive scoring engine — fire signals, watch conviction scores update, see autonomous decisions in real-time.',
    url: 'https://usecircuitos.com/playground',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Revenue Physics Playground | CircuitOS',
    description: 'Interactive scoring engine — fire signals, watch conviction scores update, see autonomous decisions in real-time.',
  },
  alternates: { canonical: 'https://usecircuitos.com/playground' },
}

export default function PlaygroundLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
