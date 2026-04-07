"use client";

import { motion } from "framer-motion";

export default function SectionHeading({
  title,
  subtitle,
  label,
  align = "center",
}: {
  title: string;
  subtitle?: string;
  label?: string;
  align?: "center" | "left";
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      className={`mb-20 ${align === "center" ? "text-center" : ""}`}
    >
      {label && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="tag mb-4 inline-block"
        >
          {label}
        </motion.span>
      )}
      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
        <span className="grad-text">{title}</span>
      </h2>
      {subtitle && (
        <p className={`t-secondary text-lg md:text-xl leading-relaxed ${align === "center" ? "max-w-2xl mx-auto" : "max-w-xl"}`}>
          {subtitle}
        </p>
      )}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className={`mt-6 h-px ${align === "center" ? "mx-auto" : ""}`}
        style={{
          width: 120,
          transformOrigin: align === "center" ? "center" : "left",
          background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
        }}
      />
    </motion.div>
  );
}
