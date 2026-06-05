import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Demo - See CircuitOS Pro in Action',
  description: 'See how CircuitOS Pro scores each decision with calibrated confidence, acts within governed rules, and proves the call was sound on a signed audit trail.',
  openGraph: {
    title: 'Demo - See CircuitOS Pro in Action',
    description: 'See how CircuitOS Pro scores decisions with calibrated confidence, acts within governed rules, and proves every call on a signed audit trail.',
    url: 'https://usecircuitos.com/demo',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Demo - See CircuitOS Pro in Action',
    description: 'See how CircuitOS Pro scores decisions with calibrated confidence, acts within governed rules, and proves every call on a signed audit trail.',
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
