import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chiang Mai — Matt Travels",
  description: "Spring 2026 — 清邁七天，春節氣氛、大象公園、Doi Inthanon 健行、尼曼區漫步。",
  openGraph: {
    title: "Chiang Mai",
    description: "Spring 2026 — 清邁七天，春節氣氛、大象公園、Doi Inthanon 健行、尼曼區漫步。",
    images: [
      {
        url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778430032/CM1_syxfa2.jpg",
        width: 1200,
        height: 630,
        alt: "Chiang Mai",
      },
    ],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Chiang Mai",
    description: "Spring 2026 — 清邁七天。",
    images: ["https://res.cloudinary.com/dydhvvubl/image/upload/v1778430032/CM1_syxfa2.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
