import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "百岳 — Matt Travels",
  description: "Matt's Taiwan Hundred Peaks archive — mountains climbed, memories from the trail.",
  openGraph: {
    title: "百岳 — Mountain Archive",
    description: "Matt's Taiwan Hundred Peaks archive — mountains climbed, memories from the trail.",
    images: [
      {
        url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1783693006/%E6%9C%88%E4%BA%AE%E7%9A%84%E9%8F%A1%E5%AD%90_dictfi.jpg",
        width: 1200,
        height: 630,
        alt: "百岳",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "百岳 — Mountain Archive",
    description: "Matt's Taiwan Hundred Peaks archive — mountains climbed, memories from the trail.",
    images: ["https://res.cloudinary.com/dydhvvubl/image/upload/v1783693006/%E6%9C%88%E4%BA%AE%E7%9A%84%E9%8F%A1%E5%AD%90_dictfi.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
