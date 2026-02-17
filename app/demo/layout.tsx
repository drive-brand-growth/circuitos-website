import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Demo - See CircuitOS In Action',
  description: 'Interactive walkthrough of CircuitOS lead scoring and content intelligence pipelines. See how AI scores leads across 72+ signals and generates quality-assured content.',
  openGraph: {
    title: 'Demo - See CircuitOS In Action',
    description: 'Interactive walkthrough of the CircuitOS scoring and content intelligence pipelines.',
  },
}

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
