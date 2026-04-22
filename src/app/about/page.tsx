"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Rocket, Satellite, Globe, FlaskConical } from "lucide-react";
import PageHero from "@/components/PageHero";
import { LoadingBlock, EmptyBlock, ErrorBlock } from "@/components/DataState";
import { ApiAbout, ApiStat, resolveImage, usePublicSingle, usePublicList } from "@/lib/publicApi";

const STAT_ICONS = [Rocket, Satellite, Globe, FlaskConical];

function StatCounter({ value, inView }: { value: string; inView: boolean }) {
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!inView) return;
    const match = value.match(/^([\d,.]+)(.*)$/);
    if (!match) { setDisplay(value); return; }
    const target = Number(match[1].replace(/,/g, ""));
    if (Number.isNaN(target)) { setDisplay(value); return; }
    const suffix = match[2] ?? "";
    const dur = 1800;
    const start = Date.now();
    const timer = setInterval(() => {
      const p = Math.min((Date.now() - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.floor(eased * target).toLocaleString() + suffix);
      if (p >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);
  return <span>{display}</span>;
}

export default function AboutPage() {
  const { data: about, loading: loadingAbout, error: errorAbout } = usePublicSingle<ApiAbout>("/api/about");
  const { data: siteStats } = usePublicList<ApiStat>("/api/stats");
  const statsRef = useRef(null);
  const inView = useInView(statsRef, { once: true });

  // Prefer about.stats; if empty, fall back to /api/stats rows; if still empty, show nothing.
  const stats =
    (about?.stats && about.stats.length > 0
      ? about.stats
      : siteStats.map((s) => ({ label: s.label, value: s.value }))) ?? [];

  const heroImage = resolveImage(about?.heroImage);

  return (
    <div className="page-enter">
      <PageHero
        title="About AstraMile"
        subtitle="Pioneering the next frontier of human exploration."
        image={heroImage ?? "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1400&q=80"}
        label="Our Story"
      />

      {loadingAbout && <LoadingBlock label="Loading content…" />}
      {!loadingAbout && errorAbout && <ErrorBlock error={errorAbout} />}
      {!loadingAbout && !errorAbout && !about?.headline && !about?.body && (
        <EmptyBlock
          title="No About content yet"
          hint="Open the admin panel ▸ About page to write the headline, body, mission, vision, and stats."
        />
      )}

      {about && (about.headline || about.body) && (
        <section className="py-28 px-5 section-line">
          <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="tag mb-4 inline-block">Our Mission</span>
              {about.headline && (
                <h2 className="text-3xl md:text-4xl font-bold t-primary mb-5 leading-snug">{about.headline}</h2>
              )}
              {about.body && <p className="t-secondary leading-relaxed mb-4">{about.body}</p>}
              {about.mission && <p className="t-muted leading-relaxed mb-4">{about.mission}</p>}
              {about.vision && <p className="t-muted leading-relaxed">{about.vision}</p>}
            </motion.div>

            {heroImage && (
              <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden gradient-border">
                <Image src={heroImage} alt="Hero" fill className="object-cover" sizes="50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/50 to-transparent" />
              </motion.div>
            )}
          </div>
        </section>
      )}

      {stats.length > 0 && (
        <section ref={statsRef} className="py-20 px-5">
          <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map((s, i) => {
              const IconComp = STAT_ICONS[i % STAT_ICONS.length];
              return (
                <motion.div key={s.label + i} initial={{ opacity: 0, y: 30, filter: "blur(4px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="card p-6 text-center gradient-border">
                  <IconComp className="w-6 h-6 text-accent/60 mx-auto mb-3" />
                  <p className="text-3xl font-bold grad-text mb-1">
                    <StatCounter value={s.value} inView={inView} />
                  </p>
                  <p className="text-[11px] t-muted uppercase tracking-wider">{s.label}</p>
                </motion.div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
