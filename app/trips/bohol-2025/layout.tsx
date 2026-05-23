import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bohol — Matt Travels",
  description: "薄荷島 5 天，追海豚、浮潛、巧克力山、眼鏡猴，和 Amorita Resort 的南洋假期。",
  openGraph: {
    title: "Bohol",
    description: "薄荷島 5 天，追海豚、浮潛、巧克力山、眼鏡猴，和 Amorita Resort 的南洋假期。",
    images: [
      {
        url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778682135/BO1_flckks.jpg",
        width: 1200,
        height: 630,
        alt: "Bohol, Philippines",
      },
    ],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bohol",
    description: "薄荷島 5 天，追海豚、浮潛、巧克力山、眼鏡猴。",
    images: ["https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778682135/BO1_flckks.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
