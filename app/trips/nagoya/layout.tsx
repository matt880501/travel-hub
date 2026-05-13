import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nagoya · Takayama · Inuyama — Matt Travels",
  description: "Winter 2026 — 名古屋、飛驒高山、白川鄉合掌村、犬山城下町。六天的冷色旅程。",
  openGraph: {
    title: "Nagoya · Takayama · Inuyama",
    description: "Winter 2026 — 名古屋、飛驒高山、白川鄉合掌村、犬山城下町。六天的冷色旅程。",
    images: [
      {
        url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778669488/NG1_cfqqat.jpg",
        width: 1200,
        height: 630,
        alt: "Shirakawago — Nagoya Trip",
      },
    ],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nagoya · Takayama · Inuyama",
    description: "Winter 2026 — 六天的冷色旅程。",
    images: ["https://res.cloudinary.com/dydhvvubl/image/upload/v1778669488/NG1_cfqqat.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
