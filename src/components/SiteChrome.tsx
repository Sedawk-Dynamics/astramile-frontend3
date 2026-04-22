"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import BackToTop from "@/components/BackToTop";
import CursorFollower from "@/components/CursorFollower";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const isAdmin = pathname.startsWith("/admin");

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
      <CursorFollower />
    </>
  );
}
