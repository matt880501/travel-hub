import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tokyo 2024 — Matt Travels",
  description: "May 2024 — 河口湖、原宿、淺草、澀谷、晴空塔。五天的東京之旅。",
  openGraph: {
    title: "Tokyo 2024",
    description: "May 2024 — 河口湖、原宿、淺草、澀谷、晴空塔。",
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
