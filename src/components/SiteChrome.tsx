"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import CursorFollower from "@/components/CursorFollower";
import Chatbot from "@/components/Chatbot";
import { loadYouTubeApi } from "@/components/HeroYouTube";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (!isAdmin) {
      const id = window.setTimeout(() => { loadYouTubeApi(); }, 0);
      return () => window.clearTimeout(id);
    }
  }, [isAdmin]);

  if (isAdmin) {
    return <main className="relative z-10">{children}</main>;
  }

  return (
    <>
      <ScrollProgress />
      <div className="grain-overlay" aria-hidden="true" />
      <Navbar />
      <main className="relative z-10">{children}</main>
      <Footer />
      <BackToTop />
      <Chatbot />
      <CursorFollower />
    </>
  );
}
