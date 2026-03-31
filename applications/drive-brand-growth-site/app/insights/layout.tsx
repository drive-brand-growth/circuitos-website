import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insights — Noel Pena",
  description: "Retail data intelligence, LPR marketing, and customer relationship frameworks by Noel Pena. Distance Data. Transactional Blindness.",
  openGraph: {
    title: "Insights — Noel Pena | Drive Brand Growth",
    description: "Retail data intelligence, LPR marketing, and customer relationship frameworks.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Insights — Noel Pena",
    description: "Distance Data. Transactional Blindness. Two decades of retail intelligence.",
  },
};

export default function InsightsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
