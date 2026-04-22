"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowUpRight, Zap, Shield, RotateCcw, Rocket } from "lucide-react";
import * as LucideIcons from "lucide-react";
import TextReveal from "@/components/TextReveal";
import Marquee from "@/components/Marquee";
import MagneticWrap from "@/components/MagneticWrap";
import ParallaxImage from "@/components/ParallaxImage";
import {
  ApiRocket, ApiTech, ApiNews,
  resolveImage, usePublicList, usePublicSingle, ApiAbout,
} from "@/lib/publicApi";

type IconComponent = React.ComponentType<{ className?: string }>;
const ICON_DEFAULTS: IconComponent[] = [Zap, Shield, RotateCcw];

function resolveIcon(name: string | null, fallbackIdx: number): IconComponent {
  const lib = LucideIcons as unknown as Record<string, IconComponent>;
  if (name && lib[name]) return lib[name];
  return ICON_DEFAULTS[fallbackIdx] ?? Zap;
}

function formatPayload(kg: number | null | undefined): string {
  if (kg === null || kg === undefined) return "—";
  return `${kg.toLocaleString()} kg`;
}
function formatSuccess(rate: number | null | undefined): string {
  if (rate === null || rate === undefined) return "—";
  return `${rate}%`;
}
function formatNewsDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function Home() {
  const { scrollYProgress } = useScroll();
  useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  useTransform(scrollYProgress, [0, 0.15], [0, 80]);

  const { data: rockets } = usePublicList<ApiRocket>("/api/rockets");
  const { data: techs } = usePublicList<ApiTech>("/api/technology");
  const { data: news } = usePublicList<ApiNews>("/api/news");
  const { data: about } = usePublicSingle<ApiAbout>("/api/about");

  const topRockets = rockets.slice(0, 3);
  const topTechs = techs.slice(0, 3);
  const topNews = news.slice(0, 3);

  return (
    <div className="page-enter">
      {/* ═══ HERO ═══ */}
      <section className="relative h-[100svh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/4F8Heeu5L5U?autoplay=1&mute=1&loop=1&playlist=4F8Heeu5L5U&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&iv_load_policy=3"
              allow="autoplay; encrypted-media"
              className="absolute top-1/2 left-1/2 pointer-events-none"
              style={{
                border: "none",
                width: "100vw",
                height: "56.25vw",
                minHeight: "100vh",
                minWidth: "177.78vh",
                transform: "translate(-50%, -50%)",
              }}
            />
          </div>
          <Image src="/Karman line.webp" alt="Karman line" fill className="object-cover -z-10" sizes="100vw" priority />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.6) 100%)",
          }} />
          <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40" style={{
            background: "linear-gradient(to top, var(--bg), transparent)",
          }} />
        </div>

        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[45%] z-10 pointer-events-none hidden md:block"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 0.6, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/Astramile A Png.png"
            alt="A"
            width={800}
            height={800}
            className="w-[90vw] lg:w-[85vw] h-auto max-w-none saturate-150"
            priority
          />
        </motion.div>

        <motion.div
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 pointer-events-none md:hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/logos/astramile svg.svg"
            alt="AstraMile"
            width={200}
            height={50}
            className="w-48 sm:w-56 h-auto"
            priority
          />
        </motion.div>

        <motion.div
          className="absolute bottom-10 right-6 sm:bottom-14 sm:right-10 md:bottom-20 md:right-16 z-20 pointer-events-none hidden md:flex flex-col items-end gap-2"
          initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 5, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/logos/astramile svg.svg"
            alt="AstraMile"
            width={180}
            height={45}
            className="w-36 md:w-44 h-auto opacity-95"
          />
          <motion.div
            className="h-px w-full origin-right"
            style={{ background: "linear-gradient(270deg, var(--accent), var(--accent-warm), transparent)" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 5.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
          <motion.span
            className="font-display italic text-lg md:text-xl tracking-[0.12em] grad-text"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 5.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            Beyond Infinity
          </motion.span>
        </motion.div>
      </section>

      {/* ═══ MARQUEE ═══ */}
      <Marquee items={["Falcon Heavy", "Starship", "Atlas V", "Ariane 5", "PSLV", "GSLV", "Mars", "Moon", "Europa", "Deep Space"]} speed={25} />

      {/* ═══ ROCKETS ═══ */}
      {topRockets.length > 0 && (
        <section className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-5 overflow-hidden">
          <div className="absolute inset-0">
            <Image src="https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1600&q=80" alt="Rocket launch" fill className="object-cover opacity-[0.07]" sizes="100vw" />
          </div>
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, var(--bg), transparent 20%, transparent 80%, var(--bg))" }} />

          <div className="relative z-10 max-w-[1400px] mx-auto">
            <div className="watermark-top">Rockets</div>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
              <div>
                <motion.span initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  className="section-num block mb-4">01 &mdash; Fleet</motion.span>
                <h2 className="font-display text-3xl md:text-5xl">
                  <TextReveal>Our Rockets</TextReveal>
                </h2>
                <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}
                  className="t-muted text-sm mt-3 max-w-md font-mono">
                  A fleet of proven launch vehicles engineered for every orbit.
                </motion.p>
              </div>
              <Link href="/rockets" className="text-xs t-muted hover:t-primary flex items-center gap-1 group uppercase tracking-[0.15em] font-mono transition-colors hover-line">
                View all <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {topRockets.map((r, i) => {
                const img = resolveImage(r.image);
                return (
                  <motion.div key={r.id}
                    initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="group cursor-pointer">
                    <div className="card overflow-hidden gradient-border">
                      <div className={`relative h-56 sm:h-64 md:h-80 overflow-hidden img-zoom ${!img ? "bg-[var(--surface)]" : ""}`}>
                        {img && <Image src={img} alt={r.name} fill className="object-cover" sizes="33vw" />}
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg-card) 10%, transparent 60%)" }} />
                        {r.successRate !== null && (
                          <motion.div className="absolute top-4 right-4 glass rounded-lg px-3 py-1.5"
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + i * 0.1 }}>
                            <span className="text-xs font-mono font-bold text-accent">{formatSuccess(r.successRate)}</span>
                          </motion.div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="font-display text-lg mb-1 group-hover:text-accent-light transition-colors">{r.name}</h3>
                        {r.payloadKg !== null && (
                          <p className="text-xs t-muted font-mono mb-4">Payload: {formatPayload(r.payloadKg)} to LEO</p>
                        )}
                        <motion.div className="h-px origin-left"
                          style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-warm), transparent)" }}
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + i * 0.15, duration: 1 }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ ABOUT ═══ */}
      {(about?.headline || about?.body) && (
        <section className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-5 overflow-hidden">
          <div className="aurora-bg opacity-30" />

          <div className="relative z-10 max-w-[1400px] mx-auto">
            <div className="watermark-top">About</div>
          </div>
          <div className="relative z-10 max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -60, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
              <div className="relative">
                <ParallaxImage
                  src={resolveImage(about.heroImage) ?? "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=900&q=80"}
                  alt="About"
                  className="aspect-[4/3]"
                  speed={0.1}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}>
              <motion.span initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="section-num block mb-4">02 &mdash; About</motion.span>
              {about.headline && (
                <h2 className="font-display text-3xl md:text-4xl mb-6">
                  <TextReveal>{about.headline}</TextReveal>
                </h2>
              )}
              {about.body && (
                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="t-secondary leading-relaxed mb-4">
                  {about.body}
                </motion.p>
              )}
              {about.mission && (
                <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="t-muted leading-relaxed mb-8">
                  {about.mission}
                </motion.p>
              )}

              <motion.div initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-8">
                <MagneticWrap className="inline-block">
                  <Link href="/about" className="btn btn-accent text-xs">Learn More <ArrowRight className="w-3 h-3" /></Link>
                </MagneticWrap>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══ MARQUEE 2 ═══ */}
      <Marquee items={["Innovation", "Exploration", "Discovery", "Technology", "Future", "Beyond", "Cosmos", "Pioneer"]} speed={35} />

      {/* ═══ TECH ═══ */}
      {topTechs.length > 0 && (
        <section className="relative py-20 sm:py-28 md:py-40 px-4 sm:px-5 overflow-hidden">
          <div className="aurora-bg opacity-40" />

          <div className="relative z-10 max-w-[1400px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-4 md:gap-6">
              <div>
                <motion.span initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  className="section-num block mb-4">03 &mdash; Innovation</motion.span>
                <h2 className="font-display text-4xl md:text-6xl">
                  <TextReveal>Technology</TextReveal>
                </h2>
                <motion.p initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="t-muted text-sm md:text-base mt-4 max-w-md font-mono">
                  Engineering systems that push the limits of what&apos;s possible in space.
                </motion.p>
              </div>
              <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
                <MagneticWrap className="inline-block">
                  <Link href="/technology" className="btn btn-ice text-xs">All Technologies <ArrowRight className="w-3 h-3" /></Link>
                </MagneticWrap>
              </motion.div>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {topTechs.map((t, i) => {
                const Icon = resolveIcon(t.icon, i);
                const img = resolveImage(t.image);
                return (
                  <motion.div key={t.id}
                    initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="group cursor-pointer">
                    <div className="card overflow-hidden gradient-border h-full flex flex-col">
                      <div className={`relative h-48 overflow-hidden img-zoom ${!img ? "bg-[var(--surface)]" : ""}`}>
                        {img && <Image src={img} alt={t.title} fill className="object-cover" sizes="33vw" />}
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg-card) 5%, transparent 60%)" }} />
                        {(t.metric || t.metricLabel) && (
                          <motion.div className="absolute top-4 right-4 glass rounded-lg px-3 py-2 text-center"
                            initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                            transition={{ delay: 0.4 + i * 0.15 }}>
                            {t.metric && <p className="text-lg font-bold font-mono grad-text leading-none">{t.metric}</p>}
                            {t.metricLabel && <p className="text-[8px] t-faint uppercase tracking-[0.2em] mt-0.5">{t.metricLabel}</p>}
                          </motion.div>
                        )}
                        <motion.div className="absolute bottom-4 left-5 w-11 h-11 rounded-xl flex items-center justify-center"
                          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", border: "1px solid var(--border)" }}
                          whileHover={{ rotate: 15, scale: 1.15 }} transition={{ type: "spring", stiffness: 300 }}>
                          <Icon className="w-5 h-5 text-accent" />
                        </motion.div>
                      </div>
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="font-display text-base mb-3 group-hover:text-accent-light transition-colors duration-300">{t.title}</h3>
                        <p className="t-muted text-sm leading-relaxed flex-1">{t.description}</p>
                        <div className="mt-6 pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                          <div className="flex items-center justify-between">
                            <motion.div className="h-px flex-1 mr-4 origin-left"
                              style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-warm), transparent)" }}
                              initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
                              transition={{ delay: 0.5 + i * 0.15, duration: 1 }} />
                            <motion.span className="text-[10px] t-faint uppercase tracking-[0.15em] font-mono flex items-center gap-1 group-hover:text-accent transition-colors"
                              whileHover={{ x: 3 }}>
                              Learn more <ArrowRight className="w-3 h-3" />
                            </motion.span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ GALLERY strip (decorative, kept static) ═══ */}
      <section className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-5 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=1600&q=80" alt="Nebula" fill className="object-cover opacity-[0.05]" sizes="100vw" />
        </div>
        <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, var(--bg), transparent 15%, transparent 85%, var(--bg))" }} />

        <div className="relative z-10 max-w-[1400px] mx-auto">
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

          <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2 auto-rows-[150px] sm:auto-rows-[200px] md:auto-rows-[280px]">
            {[
              { img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80", span: "md:col-span-2 md:row-span-2", label: "Earth from Orbit" },
              { img: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=400&q=80", span: "", label: "Deep Space" },
              { img: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400&q=80", span: "", label: "Mars Surface" },
              { img: "https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=600&q=80", span: "md:col-span-2", label: "Nebula" },
            ].map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={`relative overflow-hidden img-zoom cursor-pointer group rounded-sm ${item.span}`}>
                <Image src={item.img} alt={item.label} fill className="object-cover" sizes="50vw" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors duration-700" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)" }}>
                  <p className="text-xs font-mono t-secondary">{item.label}</p>
                </div>
                <motion.div
                  className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 glass rounded-lg"
                  whileHover={{ scale: 1.1 }}>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ NEWS + CTA ═══ */}
      <section className="relative py-20 sm:py-28 md:py-36 px-4 sm:px-5 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=1600&q=80" alt="Moon surface" fill className="object-cover" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-black/70" />
        <div className="aurora-bg opacity-20" />

        {topNews.length > 0 && (
          <div className="relative z-10 max-w-[1400px] mx-auto">
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

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {topNews.map((n, i) => {
                const img = resolveImage(n.coverImage);
                return (
                  <motion.div key={n.id}
                    initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
                    whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12, duration: 0.8 }}
                    className="group cursor-pointer">
                    <div className="card overflow-hidden gradient-border tilt-hover">
                      <div className={`relative h-56 overflow-hidden img-zoom ${!img ? "bg-[var(--surface)]" : ""}`}>
                        {img && <Image src={img} alt={n.title} fill className="object-cover" sizes="33vw" />}
                        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg-card) 10%, transparent 60%)" }} />
                        <motion.span className="absolute top-4 left-4 glass rounded-lg px-3 py-1 text-[10px] font-mono uppercase tracking-wider"
                          initial={{ opacity: 0, y: -8 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + i * 0.1 }}>
                          {n.category}
                        </motion.span>
                      </div>
                      <div className="p-6">
                        <p className="text-[10px] t-faint font-mono mb-3">{formatNewsDate(n.publishedAt)}</p>
                        <h3 className="text-base font-semibold group-hover:text-accent-light transition-colors line-clamp-2 mb-4">{n.title}</h3>
                        <span className="text-[10px] t-faint uppercase tracking-[0.15em] font-mono flex items-center gap-1 group-hover:text-accent transition-colors">
                          Read more <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        <div className="relative z-10 max-w-2xl mx-auto text-center mt-20 sm:mt-28 md:mt-32">
          <motion.div
            initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>

            <motion.div
              className="w-16 h-16 mx-auto mb-8 rounded-2xl flex items-center justify-center"
              style={{ background: "rgba(125,180,224,0.08)", border: "1px solid rgba(125,180,224,0.2)" }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
              <Rocket className="w-7 h-7 text-accent" />
            </motion.div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-6xl mb-6">
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
                <Link href="/launches" className="btn btn-ice" style={{ borderColor: "rgba(255,255,255,0.2)" }}>Live Launches</Link>
              </MagneticWrap>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
