import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Australia — Matt Travels",
  description: "Aug 2024 —雪梨、藍山、墨爾本、大洋路、雅拉河谷。十五天的南半球冬旅。",
  openGraph: {
    title: "Australia",
    description: "Winter 2025 — 雪梨、藍山、墨爾本、大洋路、雅拉河谷。",
    type: "article",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
