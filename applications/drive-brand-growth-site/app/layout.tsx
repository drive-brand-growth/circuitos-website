import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: 'swap' });

export const metadata: Metadata = {
  title: "Drive Brand Growth | Revenue Prediction Systems",
  description:
    "AI systems that predict which deals close. Built by someone who closed the deals, not just analyzed them. Production-grade ML scoring, DMN decision tables, and autonomous agents.",
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
    icon: "/circuitos-icon.svg",
    apple: "/circuitos-icon.svg",
  },
  openGraph: {
    title: "Drive Brand Growth | Revenue Prediction Systems",
    description:
      "AI systems that predict which deals close. Production-grade ML scoring with explainable DMN decision tables.",
    url: "https://drivebrandgrowth.com",
    siteName: "Drive Brand Growth",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Drive Brand Growth | Revenue Prediction Systems",
    description:
      "AI systems that predict which deals close. Production-grade ML scoring with explainable DMN decision tables.",
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
        {children}
      </body>
    </html>
  );
}
