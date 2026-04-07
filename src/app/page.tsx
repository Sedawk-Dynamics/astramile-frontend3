"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Radio, Zap, Shield, RotateCcw } from "lucide-react";
import TextReveal from "@/components/TextReveal";
import Marquee from "@/components/Marquee";
import AnimatedCounter from "@/components/AnimatedCounter";
import MagneticWrap from "@/components/MagneticWrap";
import ParallaxImage from "@/components/ParallaxImage";

const rockets = [
  { name: "Falcon Heavy", payload: "63,800 kg", success: "100%", image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=600&q=80" },
  { name: "Starship", payload: "150,000 kg", success: "Testing", image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=600&q=80" },
  { name: "Atlas V", payload: "18,850 kg", success: "99%", image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80" },
];

const stats = [
  { value: 150, suffix: "+", label: "Missions" },
  { value: 320, suffix: "+", label: "Satellites" },
  { value: 45, suffix: "", label: "Nations" },
  { value: 1200, suffix: "+", label: "Experiments" },
];

const techs = [
  { icon: Zap, title: "Ion Propulsion", desc: "Next-gen engines with record thrust efficiency for deep space exploration missions.", metric: "40%", metricLabel: "Efficiency", image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=500&q=80" },
  { icon: Shield, title: "Heat Shields", desc: "Ablative composites withstanding 3,000\u00b0F during hypersonic atmospheric re-entry.", metric: "3000°F", metricLabel: "Max Temp", image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=500&q=80" },
  { icon: RotateCcw, title: "Reusable Boosters", desc: "Autonomous propulsive landing technology reducing launch costs by 70%.", metric: "70%", metricLabel: "Cost Saved", image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=500&q=80" },
];

const news = [
  { title: "Starship Completes First Orbital Flight", date: "Mar 15, 2026", image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=400&q=80", cat: "Milestone" },
  { title: "Mars Sample Return Timeline Announced", date: "Mar 10, 2026", image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400&q=80", cat: "Mars" },
  { title: "Lunar Gateway Module Launched", date: "Feb 28, 2026", image: "https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=400&q=80", cat: "Moon" },
];

export default function Home() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, 80]);

  return (
    <div className="page-enter">
      {/* ═══ HERO ═══ */}
      <section className="relative h-screen overflow-hidden">
        {/* Background image — Karman line with moon */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Karman line.webp"
            alt="Karman line"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Dark overlay — stronger on left for text readability */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.15) 100%)",
          }} />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-40" style={{
            background: "linear-gradient(to top, var(--bg), transparent)",
          }} />
        </div>

        {/* Left-aligned tagline only */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="relative z-10 h-full flex items-center"
        >
          <div className="w-full px-5 md:px-10 lg:px-16">
            <div className="max-w-2xl">
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] leading-[1.05] tracking-tight hero-glitch-text">
                {"Launching the Future Beyond Earth".split(" ").map((word, i) => (
                  <span key={i} className="inline-block mr-[0.2em]">
                    {word.split("").map((char, j) => (
                      <motion.span
                        key={j}
                        className="inline-block"
                        initial={{ opacity: 0 }}
                        animate={{
                          opacity: [0, 1, 1, 0.2, 1, 0.6, 1],
                          x: [0, -2, 3, -1, 0],
                          textShadow: [
                            "0 0 0px transparent",
                            "-2px 0 #7db4e0, 2px 0 #c49a6c",
                            "2px 0 #c49a6c, -2px 0 #7db4e0",
                            "0 0 8px rgba(125,180,224,0.6)",
                            "0 0 0px transparent",
                          ],
                        }}
                        transition={{
                          delay: 0.4 + i * 0.18 + j * 0.03,
                          duration: 0.6,
                          ease: "easeOut",
                          times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1],
                        }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </span>
                ))}
              </h1>
            </div>
          </div>
        </motion.div>

        {/* Decorative large text */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none z-[1]">
          <div className="whitespace-nowrap font-bold tracking-tighter leading-none translate-y-[20%]"
            style={{ color: "#ffffff", opacity: 0.03, fontSize: "18vw" }}>
            ASTRAMILE&nbsp;&nbsp;ASTRAMILE&nbsp;&nbsp;ASTRAMILE
          </div>
        </div>
      </section>

      {/* ═══ ROCKETS ═══ */}
      <section className="relative py-32 px-5 section-line overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="watermark-top">Rockets</div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <motion.span initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="section-num block mb-4">01 &mdash; Fleet</motion.span>
              <h2 className="font-display text-3xl md:text-5xl">
                <TextReveal>Our Rockets</TextReveal>
              </h2>
            </div>
            <Link href="/rockets" className="text-xs t-muted hover:t-primary flex items-center gap-1 group uppercase tracking-[0.15em] font-mono transition-colors hover-line">
              View all <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-px" style={{ border: "1px solid var(--border)" }}>
            {rockets.map((r, i) => (
              <motion.div key={r.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="group cursor-pointer tilt-hover gradient-border"
                style={{ borderRight: i < 2 ? "1px solid var(--border)" : "none" }}>
                <div className="relative h-72 overflow-hidden img-zoom">
                  <Image src={r.image} alt={r.name} fill className="object-cover" sizes="33vw" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg), transparent 60%)" }} />
                  <motion.div className="absolute top-4 right-4 tag"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}>
                    {r.success}
                  </motion.div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-sm mb-1 group-hover:opacity-60 transition-opacity">{r.name}</h3>
                  <p className="text-xs t-muted font-mono">Payload: {r.payload} to LEO</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section className="relative py-32 px-5 section-line overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="watermark-top">About</div>
        </div>
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <ParallaxImage
              src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=900&q=80"
              alt="Space station"
              className="aspect-[4/3]"
              speed={0.1}
            />
          </motion.div>

          <div>
            <motion.span initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="section-num block mb-4">02 &mdash; About</motion.span>
            <h2 className="font-display text-3xl md:text-4xl mb-6">
              <TextReveal>Pushing the boundaries of space exploration</TextReveal>
            </h2>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="t-secondary leading-relaxed mb-4">
              From launching cutting-edge satellites to planning humanity&apos;s first permanent settlements beyond Earth,
              we are dedicated to unlocking the mysteries of the cosmos.
            </motion.p>
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="t-muted leading-relaxed mb-8">
              Every mission brings us closer to becoming a multi-planetary species, with world-class engineers
              and scientists making interplanetary travel a reality.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: 0.4 }}>
              <MagneticWrap className="inline-block">
                <Link href="/about" className="btn btn-ghost text-xs">Learn More <ArrowRight className="w-3 h-3" /></Link>
              </MagneticWrap>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ MARQUEE 2 ═══ */}
      <Marquee items={["Innovation", "Exploration", "Discovery", "Technology", "Future", "Beyond", "Cosmos", "Pioneer"]} speed={35} />

      {/* ═══ TECH ═══ */}
      <section className="relative py-40 px-5 overflow-hidden">
        {/* Background aurora */}
        <div className="aurora-bg opacity-40" />

        <div className="relative z-10 max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
            <div>
              <motion.span initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="section-num block mb-4">03 &mdash; Innovation</motion.span>
              <h2 className="font-display text-4xl md:text-6xl">
                <TextReveal>Technology</TextReveal>
              </h2>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="t-muted text-sm md:text-base mt-4 max-w-md font-mono">
                Engineering systems that push the limits of what&apos;s possible in space.
              </motion.p>
            </div>
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
              <MagneticWrap className="inline-block">
                <Link href="/technology" className="btn btn-ice text-xs">
                  All Technologies <ArrowRight className="w-3 h-3" />
                </Link>
              </MagneticWrap>
            </motion.div>
          </div>

          {/* Tech cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {techs.map((t, i) => (
              <motion.div key={t.title}
                initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
                whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="group cursor-pointer"
              >
                <div className="card overflow-hidden gradient-border h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden img-zoom">
                    <Image src={t.image} alt={t.title} fill className="object-cover" sizes="33vw" />
                    <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg-card) 5%, transparent 60%)" }} />

                    {/* Metric badge */}
                    <motion.div
                      className="absolute top-4 right-4 glass rounded-lg px-3 py-2 text-center"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.15 }}
                    >
                      <p className="text-lg font-bold font-mono grad-text leading-none">{t.metric}</p>
                      <p className="text-[8px] t-faint uppercase tracking-[0.2em] mt-0.5">{t.metricLabel}</p>
                    </motion.div>

                    {/* Icon floating */}
                    <motion.div
                      className="absolute bottom-4 left-5 w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", border: "1px solid var(--border)" }}
                      whileHover={{ rotate: 15, scale: 1.15 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <t.icon className="w-5 h-5 text-accent" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-display text-base mb-3 group-hover:text-accent-light transition-colors duration-300">{t.title}</h3>
                    <p className="t-muted text-sm leading-relaxed flex-1">{t.desc}</p>

                    {/* Bottom bar */}
                    <div className="mt-6 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                      <div className="flex items-center justify-between">
                        <motion.div className="h-px flex-1 mr-4 origin-left"
                          style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-warm), transparent)" }}
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + i * 0.15, duration: 1 }}
                        />
                        <motion.span
                          className="text-[10px] t-faint uppercase tracking-[0.15em] font-mono flex items-center gap-1 group-hover:text-accent transition-colors"
                          whileHover={{ x: 3 }}
                        >
                          Learn more <ArrowRight className="w-3 h-3" />
                        </motion.span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GALLERY ═══ */}
      <section className="relative py-32 px-5 section-line overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="watermark-top">Gallery</div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <motion.span initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="section-num block mb-4">04 &mdash; Visual Archive</motion.span>
              <h2 className="font-display text-3xl md:text-5xl">
                <TextReveal>Gallery</TextReveal>
              </h2>
            </div>
            <Link href="/gallery" className="text-xs t-muted hover:t-primary flex items-center gap-1 group uppercase tracking-[0.15em] font-mono transition-colors hover-line">
              Full gallery <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 auto-rows-[200px] md:auto-rows-[280px]">
            {[
              { img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80", span: "md:col-span-2 md:row-span-2" },
              { img: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=400&q=80", span: "" },
              { img: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400&q=80", span: "" },
              { img: "https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=600&q=80", span: "md:col-span-2" },
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className={`relative overflow-hidden img-zoom cursor-pointer group ${item.span}`}>
                <Image src={item.img} alt="Space" fill className="object-cover" sizes="50vw" />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-500" />
                <motion.div
                  className="absolute bottom-3 right-3 w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEWS ═══ */}
      <section className="relative py-32 px-5 section-line overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="watermark-top">News</div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <motion.span initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="section-num block mb-4">05 &mdash; Updates</motion.span>
              <h2 className="font-display text-3xl md:text-5xl">
                <TextReveal>Latest News</TextReveal>
              </h2>
            </div>
            <Link href="/news" className="text-xs t-muted hover:t-primary flex items-center gap-1 group uppercase tracking-[0.15em] font-mono transition-colors hover-line">
              All news <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-px" style={{ border: "1px solid var(--border)" }}>
            {news.map((n, i) => (
              <motion.div key={n.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.7 }}
                className="group cursor-pointer tilt-hover gradient-border"
                style={{ borderRight: i < 2 ? "1px solid var(--border)" : "none" }}>
                <div className="relative h-56 overflow-hidden img-zoom">
                  <Image src={n.image} alt={n.title} fill className="object-cover" sizes="33vw" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg), transparent 60%)" }} />
                  <motion.span className="absolute top-4 left-4 tag"
                    initial={{ opacity: 0, y: -8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}>
                    {n.cat}
                  </motion.span>
                </div>
                <div className="p-6">
                  <p className="text-[10px] t-faint font-mono mb-3">{n.date}</p>
                  <h3 className="text-sm font-semibold group-hover:opacity-60 transition-opacity line-clamp-2">{n.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="relative py-40 px-5 overflow-hidden">
        {/* Aurora background */}
        <div className="aurora-bg" />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
            <h2 className="font-display text-4xl md:text-6xl mb-6">
              <TextReveal>Ready to Explore?</TextReveal>
            </h2>
            <p className="t-muted text-sm mb-12 max-w-md mx-auto font-mono leading-relaxed">
              Join thousands of space enthusiasts and stay updated on missions and breakthroughs.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <MagneticWrap>
                <Link href="/contact" className="btn btn-accent">Get In Touch <ArrowRight className="w-3 h-3" /></Link>
              </MagneticWrap>
              <MagneticWrap>
                <Link href="/launches" className="btn btn-ice">Live Launches</Link>
              </MagneticWrap>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
