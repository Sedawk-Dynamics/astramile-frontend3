"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const footerLinks = {
  Company: [
    { href: "/about", label: "About" },
    { href: "/team", label: "Our Team" },
    { href: "/news", label: "News" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ],
  Missions: [
    { href: "/launches", label: "Launches" },
    { href: "/rockets", label: "Rockets" },
    { href: "/technology", label: "Technology" },
    { href: "/missions", label: "Missions" },
  ],
  Resources: [
    { href: "/gallery", label: "Gallery" },
    { href: "/blog", label: "Blog" },
    { href: "#", label: "Privacy Policy" },
    { href: "#", label: "Terms of Service" },
  ],
  Connect: [
    { href: "#", label: "X / Twitter" },
    { href: "#", label: "LinkedIn" },
    { href: "#", label: "YouTube" },
  ],
};

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden" style={{
      borderTop: "1px solid var(--border)",
      background: "linear-gradient(to bottom, var(--bg), var(--bg-alt))",
    }}>
      {/* Aurora decoration */}
      <div className="aurora-bg opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 sm:gap-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 md:col-span-1">
            <motion.div className="mb-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}>
              <Image
                src="/logos/astramlile png.png"
                alt="AstraMile"
                width={140}
                height={35}
                className="h-7 w-auto opacity-80"
              />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-sm leading-relaxed max-w-xs t-faint">
              Building the future of space transportation. Making orbit
              accessible for everyone.
            </motion.p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links], colIdx) => (
            <motion.div key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 + colIdx * 0.08 }}>
              <h4 className="text-[10px] tracking-[0.2em] uppercase t-faint mb-5">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm t-faint hover:t-secondary transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 sm:mt-20 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
          style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-[11px] t-faint tracking-wider" style={{ opacity: 0.5 }}>
            &copy; {new Date().getFullYear()} AstraMile Space Technologies
          </p>

          <button
            onClick={scrollToTop}
            className="text-[10px] tracking-[0.2em] uppercase t-faint hover:t-secondary transition-colors flex items-center gap-2 group"
          >
            Back to top
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              className="group-hover:-translate-y-1 transition-transform"
            >
              <path d="M6 10V2M3 5l3-3 3 3" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            </svg>
          </button>
        </motion.div>
      </div>

      {/* Decorative large text */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none">
        <div className="text-[12vw] font-bold tracking-tighter text-center leading-none translate-y-[10%]"
          style={{ color: "var(--text)", opacity: 0.01 }}>
          ASTRAMILE
        </div>
      </div>
    </footer>
  );
}
