import type { Metadata, Viewport } from 'next'
import './globals.css'
import Analytics from '@/components/Analytics'
import { getPage, getSite } from '@/lib/content'
import { personJsonLd, websiteJsonLd } from '@/lib/seo'
import { SITE_URL } from '@/lib/site'

const themeScript = `(function(){try{var s=localStorage.getItem('theme');var d=s==='dark'||(s!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';}catch(e){}})();`

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f5f7' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
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
    authors: [{ name: 'Noel Pena', url: `${SITE_URL}/about` }],
    creator: 'Noel Pena',
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
      icon: [
        { url: '/mark-ink.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: light)' },
        { url: '/mark.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: dark)' },
      ],
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [site, about] = await Promise.all([getSite(), getPage('about')])
  const person = personJsonLd(about?.description)
  const website = websiteJsonLd(site.name, site.description)

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }} />
      </head>
      <body className="antialiased overflow-x-hidden">
        <Analytics />
        {children}
      </body>
    </html>
  )
}
