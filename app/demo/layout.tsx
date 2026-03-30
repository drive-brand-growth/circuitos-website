import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Demo - See CircuitOS In Action',
  description: 'See how CircuitOS scores leads across 72+ signals, makes autonomous decisions with governance, and proves every action with a full audit trail.',
  openGraph: {
    title: 'Demo - See CircuitOS In Action',
    description: 'See how CircuitOS scores leads, makes autonomous decisions, and proves every action with a full audit trail.',
    url: 'https://usecircuitos.com/demo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Demo - See CircuitOS In Action',
    description: 'See how CircuitOS scores leads, makes autonomous decisions, and proves every action with a full audit trail.',
  },
  alternates: { canonical: 'https://usecircuitos.com/demo' },
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
