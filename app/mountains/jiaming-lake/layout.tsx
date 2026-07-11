import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "嘉明湖 — Matt's Mountain Archive",
  description: "2023.6 — 向陽山、三叉山、嘉明湖，天使的眼淚，月亮的鏡子。",
  openGraph: {
    title: "嘉明湖 — Jiaming Lake",
    description: "2023.6 — 向陽山、三叉山、嘉明湖，天使的眼淚，月亮的鏡子。",
    images: [
      {
        url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693006/%E6%9C%88%E4%BA%AE%E7%9A%84%E9%8F%A1%E5%AD%90_dictfi.jpg",
        width: 1200,
        height: 630,
        alt: "嘉明湖",
      },
    ],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "嘉明湖 — Jiaming Lake",
    description: "2023.6 — 向陽山、三叉山、嘉明湖。",
    images: ["https://res.cloudinary.com/dydhvvubl/image/upload/v1783693006/%E6%9C%88%E4%BA%AE%E7%9A%84%E9%8F%A1%E5%AD%90_dictfi.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
