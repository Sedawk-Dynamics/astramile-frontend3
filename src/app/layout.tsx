import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "AstraMile | Launching the Future Beyond Earth", template: "%s | AstraMile" },
  description: "Explore cutting-edge space missions, rocket technology, and upcoming launches reshaping our understanding of the cosmos.",
  keywords: ["space", "rocket", "launch", "missions", "astronauts", "exploration", "AstraMile"],
  icons: {
    icon: [{ url: "/astramile-a.svg", type: "image/svg+xml" }],
    shortcut: "/astramile-a.svg",
    apple: "/astramile-a.svg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://www.youtube-nocookie.com" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="preconnect" href="https://yt3.ggpht.com" />
        <link rel="dns-prefetch" href="https://www.google.com" />
        <link rel="preload" href="https://www.youtube.com/iframe_api" as="script" />
      </head>
      <body className="min-h-screen bg-bg">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
