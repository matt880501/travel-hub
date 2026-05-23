import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Australia — Matt Travels",
  description: "Aug 2024 —雪梨、藍山、墨爾本、大洋路、雅拉河谷。十五天的南半球冬旅。",
  openGraph: {
    title: "Australia",
    description: "Aug 2024 — 雪梨、藍山、墨爾本、大洋路、雅拉河谷。",
    images: [
      {
        url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862389/AU12_w6s7vd.jpg",
        width: 1200,
        height: 630,
        alt: "Australia",
      },
    ],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Australia",
    description: "Aug 2024 — 雪梨、藍山、墨爾本、大洋路、雅拉河谷。",
    images: ["https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778862389/AU12_w6s7vd.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
