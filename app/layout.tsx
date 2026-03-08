import type { Metadata, Viewport } from 'next'
import './globals.css'
import Analytics from '@/components/Analytics'
import AriaX from '@/components/AriaX'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#000000',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://usecircuitos.com'),
  title: {
    default: 'CircuitOS - Autonomous Revenue Intelligence Platform',
    template: '%s | CircuitOS'
  },
  description: 'Pre-configured revenue intelligence. Predictive scoring, autonomous outreach, content intelligence, and closed-loop optimization. One system, measurable results.',
  keywords: [
    'revenue intelligence platform',
    'AI lead scoring',
    'autonomous outreach',
    'content intelligence',
    'predictive scoring',
    'multi-vertical platform',
    'sales automation',
    'lead enrichment',
    'AI content generation',
    'closed-loop marketing',
  ],
  authors: [{ name: 'CircuitOS', url: 'https://usecircuitos.com' }],
  creator: 'DriveBrandGrowth',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://usecircuitos.com',
    siteName: 'CircuitOS',
    title: 'CircuitOS - Autonomous Revenue Intelligence',
    description: 'Pre-configured revenue intelligence. Predictive scoring, autonomous outreach, and closed-loop optimization. One system, measurable results.',
    images: ['https://usecircuitos.com/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CircuitOS - Revenue Intelligence That Learns',
    description: 'Pre-configured revenue intelligence. Predictive scoring, autonomous outreach, and closed-loop optimization. One system, measurable results.',
    images: ['https://usecircuitos.com/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
  },
  alternates: {
    canonical: 'https://usecircuitos.com',
  },
  icons: {
    icon: '/circuitos-icon.svg',
    apple: '/circuitos-icon.svg',
  },
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'DriveBrandGrowth',
  url: 'https://drivebrandgrowth.com',
  logo: 'https://usecircuitos.com/circuitos-logo-full.svg',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'hello@usecircuitos.com',
    contactType: 'sales',
  },
  sameAs: [],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="antialiased overflow-x-hidden">
        <div className="overflow-x-hidden w-full">
          <Analytics />
          {children}
          <AriaX />
        </div>
      </body>
    </html>
  )
}
