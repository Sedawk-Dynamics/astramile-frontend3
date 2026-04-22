"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/rockets", label: "Rockets" },
  { href: "/missions", label: "Missions" },
  { href: "/launches", label: "Launches" },
  { href: "/gallery", label: "Gallery" },
  { href: "/team", label: "Our Team" },
  { href: "/technology", label: "Technology" },
  { href: "/news", label: "News" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(latest > 40);
    setHidden(latest > prev && latest > 200);
  });

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  return (
    <>
      <motion.header
        animate={{ y: hidden && !mobileOpen ? -100 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: scrolled ? "var(--glass-bg)" : "rgba(0,0,0,0.2)",
          borderBottom: scrolled ? "1px solid var(--glass-border)" : "none",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-5 md:px-8">
          <div className="flex items-center justify-between h-[64px]">
            {/* Logo */}
            <Link href="/" className="hover:opacity-60 transition-opacity">
              <Image src="/logos/astramile svg.svg" alt="AstraMile" width={140} height={36} priority />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden xl:flex items-center gap-0">
              {links.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link key={link.href} href={link.href}
                    className={`relative px-4 py-2 text-[11px] uppercase tracking-[0.15em] transition-all duration-300 ${
                      active ? "t-primary" : "t-muted hover:t-primary"
                    }`}>
                    {link.label}
                    {active && (
                      <motion.span layoutId="nav-line"
                        className="absolute bottom-0 left-4 right-4 h-px"
                        style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-warm))" }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} />
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="xl:hidden flex items-center gap-2">
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="w-9 h-9 flex items-center justify-center t-muted hover:t-primary transition-colors"
                style={{ border: "1px solid var(--border)" }}>
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-start justify-center pl-12"
            style={{ background: "var(--overlay-strong)" }}>

            {/* Aurora bg in mobile menu */}
            <div className="absolute inset-0 aurora-bg opacity-30" />

            <nav className="relative z-10 flex flex-col gap-4">
              {links.map((link, i) => (
                <motion.div key={link.href} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }} transition={{ delay: i * 0.03, duration: 0.3 }}>
                  <Link href={link.href}
                    className={`text-3xl font-display flex items-center gap-2 transition-opacity ${
                      pathname === link.href ? "opacity-100" : "opacity-30 hover:opacity-70"
                    }`}>
                    {link.label}
                    {pathname === link.href && <ArrowUpRight className="w-4 h-4" />}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
