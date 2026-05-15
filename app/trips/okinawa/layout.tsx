import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Okinawa — Matt Travels",
  description: "沖繩 5 天，自駕環島、青之洞窟、美ら海水族館、古宇利島，和名城ビーチ的海風。",
  openGraph: {
    title: "Okinawa",
    description: "沖繩 5 天，自駕環島、青之洞窟、美ら海水族館、古宇利島，和名城ビーチ的海風。",
    images: [
      {
        url: "https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778843907/OKI1_kvpgjq.jpg",
        width: 1200,
        height: 630,
        alt: "Okinawa, Japan",
      },
    ],
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Okinawa",
    description: "沖繩 5 天，自駕環島、青之洞窟、美ら海水族館、古宇利島。",
    images: ["https://res.cloudinary.com/dydhvvubl/image/upload/f_auto,q_auto/v1778843907/OKI1_kvpgjq.jpg"],
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
