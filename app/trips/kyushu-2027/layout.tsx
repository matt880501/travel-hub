import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kyushu — Matt Travels",
  description: "2027冬季 — 熊本・阿蘇・黑川溫泉・福岡，8天九州火山溫泉之旅。",
  openGraph: {
    title: "Kyushu",
    description: "2027冬季 — 熊本・阿蘇・黑川溫泉・福岡，8天九州火山溫泉之旅。",
    images: [
      {
        url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1791687372/DSC09767_bayxwo.jpg",
        width: 1200,
        height: 630,
        alt: "Mount Aso in winter",
      },
    ],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kyushu",
    description: "2027冬季 — 熊本・阿蘇・黑川溫泉・福岡，8天九州之旅。",
    images: ["https://res.cloudinary.com/dydhvvubl/image/upload/v1791687372/DSC09767_bayxwo.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
