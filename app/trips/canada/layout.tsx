import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Canada — Matt Travels",
  description: "Autumn 2026 — 落基山脈、Banff、Jasper，13天加拿大深秋之旅。",
  openGraph: {
    title: "Canada",
    description: "Autumn 2026 — 落基山脈、Banff、Jasper，13天加拿大深秋之旅。",
    images: [
      {
        url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778680358/CA1_c2rier.jpg",
        width: 1200,
        height: 630,
        alt: "Canadian Rockies",
      },
    ],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Canada",
    description: "Autumn 2026 — 13天加拿大落基山脈。",
    images: ["https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778680358/CA1_c2rier.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
