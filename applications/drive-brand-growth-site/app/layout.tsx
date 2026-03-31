import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://drivebrandgrowth.com'),
  title: "Drive Brand Growth | Revenue Operating Systems",
  description:
    "We build revenue operating systems for $10M-$50M companies. AI that scores leads, decides what to do, and proves every decision. Powered by CircuitOS.",
  keywords: [
    "revenue prediction",
    "AI lead scoring",
    "DMN decision tables",
    "ML pipeline",
    "sales automation",
    "lead qualification",
    "CircuitOS",
    "enterprise AI",
  ],
  authors: [{ name: "Noel Pena", url: "https://drivebrandgrowth.com" }],
  icons: {
    icon: "/dbg-icon.svg",
    apple: "/dbg-icon.svg",
  },
  openGraph: {
    title: "Drive Brand Growth | Revenue Operating Systems",
    description:
      "We build revenue operating systems for $10M-$50M companies. AI that scores, decides, and proves. Powered by CircuitOS.",
    url: "https://drivebrandgrowth.com",
    siteName: "Drive Brand Growth",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Drive Brand Growth | Revenue Operating Systems",
    description:
      "We build revenue operating systems for $10M-$50M companies. AI that scores, decides, and proves. Powered by CircuitOS.",
  },
  alternates: { canonical: 'https://drivebrandgrowth.com' },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large' as const,
    'max-snippet': -1,
    'max-video-preview': -1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': 'https://drivebrandgrowth.com/#organization',
                  name: 'Drive Brand Growth',
                  url: 'https://drivebrandgrowth.com',
                  description: 'AI systems that predict which deals close. Production-grade ML scoring, DMN decision tables, and autonomous agents.',
                  founder: {
                    '@type': 'Person',
                    name: 'Noel Pena',
                    url: 'https://drivebrandgrowth.com',
                    image: 'https://drivebrandgrowth.com/headshot.jpg',
                    jobTitle: 'Founder',
                  },
                  sameAs: [],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://drivebrandgrowth.com/#website',
                  url: 'https://drivebrandgrowth.com',
                  name: 'Drive Brand Growth',
                  publisher: { '@id': 'https://drivebrandgrowth.com/#organization' },
                },
                {
                  '@type': 'ProfessionalService',
                  name: 'Drive Brand Growth',
                  url: 'https://drivebrandgrowth.com',
                  description: 'Revenue prediction systems powered by AI. ML scoring, DMN decision tables, and autonomous agents.',
                  founder: {
                    '@type': 'Person',
                    name: 'Noel Pena',
                  },
                  areaServed: 'US',
                  serviceType: ['AI Lead Scoring', 'Revenue Intelligence', 'Marketing Automation'],
                },
              ],
            }),
          }}
        />
        {children}
      </body>
    </html>
  );
}
