import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Singapore & Bintan — Matt Travels",
  description: "Summer 2026 — 新加坡 & 民丹島clubmed之旅。",
  openGraph: {
    title: "Singapore & Bintan",
    description: "Summer 2026 — 新加坡 & 民丹島clubmed之旅。",
    images: [
      {
        url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1785338512/SG3_vu8oms.jpg",
        width: 1200,
        height: 630,
        alt: "Bintan Island",
      },
    ],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Singapore & Bintan",
    description: "Summer 2026 — 新加坡 & 民丹島clubmed之旅。",
    images: ["https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1785338512/SG3_vu8oms.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
