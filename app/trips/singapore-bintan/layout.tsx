import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Singapore & Bintan — Matt Travels",
  description: "Summer 2026 — 新加坡城市探索，接著渡輪前往民丹島 Club Med，六天的熱帶輕旅行。",
  openGraph: {
    title: "Singapore & Bintan",
    description: "Summer 2026 — 新加坡城市探索，接著渡輪前往民丹島 Club Med，六天的熱帶輕旅行。",
    images: [
      {
        url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778602513/Bin1_pjzspe.jpg",
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
    description: "Summer 2026 — 六天的熱帶輕旅行。",
    images: ["https://res.cloudinary.com/dydhvvubl/image/upload/v1778602513/Bin1_pjzspe.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
