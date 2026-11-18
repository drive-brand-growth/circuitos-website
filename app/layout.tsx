import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Analytics from '@/components/Analytics'
import { getSite } from '@/lib/content'
import { publisherJsonLd, websiteJsonLd } from '@/lib/seo'
import { SITE_URL } from '@/lib/site'

/* Fonts are self hosted at build time. Swap display and metric matched fallbacks keep layout from shifting. */
const sans = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-sans' })
const mono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-mono', weight: ['400', '500'] })

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#ffffff',
  viewportFit: 'cover',
}

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${site.name} · ${site.promise}`,
      template: `%s · ${site.name}`,
    },
    description: site.description,
    authors: [{ name: site.name, url: SITE_URL }],
    creator: site.name,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: SITE_URL,
      siteName: site.name,
      title: `${site.name} · ${site.promise}`,
      description: site.tagline,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${site.name} · ${site.promise}`,
      description: site.tagline,
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    icons: {
      icon: [{ url: '/mark.svg', type: 'image/svg+xml' }],
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite()
  const publisher = publisherJsonLd()
  const website = websiteJsonLd(site.name, site.description)

  return (
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(publisher) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      </head>
      <body>
        <Analytics />
        {children}
      </body>
    </html>
  )
}
