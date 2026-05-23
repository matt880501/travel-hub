import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tokyo — Matt Travels",
  description: "May 2024 — 河口湖、原宿、淺草、澀谷、晴空塔。五天的東京之旅。",
  openGraph: {
    title: "Tokyo 2024",
    description: "May 2024 — 河口湖、原宿、淺草、澀谷、晴空塔。",
    images: [
      {
        url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1779526543/To1_rgcmr9.jpg",
        width: 1200,
        height: 630,
        alt: "Tokyo 2024",
      },
    ],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tokyo 2024",
    description: "May 2024 — 河口湖、原宿、淺草、澀谷、晴空塔。",
    images: ["https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1779526543/To1_rgcmr9.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
