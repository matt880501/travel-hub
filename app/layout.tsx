import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Matt Travels",
  description: "Matt's personal travel archive — trips, memories, and adventures around the world.",
  openGraph: {
    title: "Matt Travels",
    description: "Matt's personal travel archive — trips, memories, and adventures around the world.",
    url: "https://mattravels.com",
    siteName: "Matt Travels",
    images: [
      {
        url: "https://res.cloudinary.com/dydhvvubl/image/upload/v1778430029/Bin1_kryiyj.png",
        width: 1200,
        height: 630,
        alt: "Matt Travels",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Matt Travels",
    description: "Matt's personal travel archive — trips, memories, and adventures around the world.",
    images: ["https://res.cloudinary.com/dydhvvubl/image/upload/v1778430029/Bin1_kryiyj.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
