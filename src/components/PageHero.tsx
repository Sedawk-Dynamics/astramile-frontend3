"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import TextReveal from "./TextReveal";

export default function PageHero({
  title,
  subtitle,
  image,
  label,
}: {
  title: string;
  subtitle: string;
  image: string;
  label?: string;
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.4], [0, 40]);

  return (
    <section ref={ref} className="relative h-[70vh] min-h-[450px] flex items-end overflow-hidden">
      <motion.div style={{ scale: imgScale, y: imgY }} className="absolute inset-0">
        <Image src={image} alt={title} fill priority className="object-cover" sizes="100vw" />
      </motion.div>
      <div className="absolute inset-0" style={{
        background: `linear-gradient(to top, var(--bg), color-mix(in srgb, var(--bg) 40%, transparent), color-mix(in srgb, var(--bg) 10%, transparent))`,
      }} />

      {/* Aurora overlay */}
      <div className="absolute inset-0 aurora-bg opacity-40" />

      <motion.div style={{ opacity: contentOpacity, y: contentY }}
        className="relative z-10 max-w-[1400px] mx-auto w-full px-5 md:px-8 pb-16">
        {label && (
          <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }} className="section-num mb-6 block">
            {label}
          </motion.span>
        )}
        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl tracking-tight mb-4">
          <TextReveal delay={0.2}>{title}</TextReveal>
        </h1>
        <motion.p initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, delay: 0.5 }} className="t-secondary text-lg md:text-xl max-w-xl">
          {subtitle}
        </motion.p>
      </motion.div>
    </section>
  );
}
