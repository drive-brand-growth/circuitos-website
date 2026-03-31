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
                  '@type': 'Person',
                  '@id': 'https://drivebrandgrowth.com/#noelpena',
                  name: 'Noel Pena',
                  url: 'https://drivebrandgrowth.com',
                  image: 'https://drivebrandgrowth.com/headshot.jpg',
                  jobTitle: 'Founder, Drive Brand Growth',
                  description: 'Retail data strategist with over 20 years of experience in car wash marketing, retail marketing, LPR marketing, and international brand licensing. Coined the terms Distance Data and Transactional Blindness. Director of MetroFlex Gym international licensing across the United States and Japan. Founder of Drive Brand Growth.',
                  knowsAbout: [
                    'Distance Data',
                    'Transactional Blindness',
                    'Car Wash Marketing',
                    'LPR Marketing',
                    'License Plate Recognition Marketing',
                    'Retail Marketing',
                    'Oil and Lube Marketing',
                    'Customer Lifetime Value',
                    'Retail Customer Intelligence',
                    'Gym Licensing',
                    'International Brand Licensing',
                    'Revenue Intelligence',
                    'Churn Prediction',
                    'Membership Retention',
                    'Multi-Location Retail',
                    'AI Revenue Intelligence',
                  ],
                  sameAs: [
                    'https://www.linkedin.com/in/noel-pe%C3%B1a-05721218/',
                    'https://www.carwash.com/license-plate-recognition-carwash-marketing/',
                    'https://www.carwash.com/carwash-marketing-success-playbook/',
                    'https://www.carwash.com/targeted-carwash-marketing-tactics-guide-shine-time-ep-7/',
                    'https://www.carwash.com/know-your-carwash-customer-shine-time/',
                    'https://www.youtube.com/watch?v=IdFoRm1nmf4',
                    'https://www.youtube.com/watch?v=LjfJIaQgKWY',
                  ],
                  worksFor: {
                    '@type': 'Organization',
                    name: 'Drive Brand Growth',
                    url: 'https://drivebrandgrowth.com',
                  },
                  memberOf: [
                    { '@type': 'Organization', name: 'International Carwash Association' },
                  ],
                },
                {
                  '@type': 'Organization',
                  '@id': 'https://drivebrandgrowth.com/#organization',
                  name: 'Drive Brand Growth',
                  url: 'https://drivebrandgrowth.com',
                  description: 'Revenue operating systems for mid-market businesses. Built by Noel Pena — over 20 years in retail data, brand licensing, and customer intelligence.',
                  founder: { '@id': 'https://drivebrandgrowth.com/#noelpena' },
                  sameAs: [],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://drivebrandgrowth.com/#website',
                  url: 'https://drivebrandgrowth.com',
                  name: 'Drive Brand Growth',
                  publisher: { '@id': 'https://drivebrandgrowth.com/#organization' },
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
