"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Rocket, Satellite, Globe, FlaskConical, Target, Users, Award, Calendar } from "lucide-react";
import TextReveal from "@/components/TextReveal";
import PageHero from "@/components/PageHero";

const stats = [
  { icon: Rocket, value: 150, suffix: "+", label: "Missions Completed" },
  { icon: Satellite, value: 320, suffix: "+", label: "Satellites Launched" },
  { icon: Globe, value: 45, suffix: "", label: "Countries Served" },
  { icon: FlaskConical, value: 1200, suffix: "+", label: "Experiments" },
];

const milestones = [
  { year: "2005", title: "Program Founded", desc: "Established with a vision to make space accessible to all nations." },
  { year: "2010", title: "First Orbital Launch", desc: "Successfully placed our first satellite into low-Earth orbit." },
  { year: "2015", title: "100th Mission", desc: "Reached a century of successful launches across 3 rocket families." },
  { year: "2020", title: "Reusable Rockets", desc: "Landed our first booster back on the launch pad autonomously." },
  { year: "2024", title: "Lunar Mission", desc: "Delivered payload to the lunar surface as part of Artemis program." },
  { year: "2026", title: "Mars Preparation", desc: "Testing deep space life support systems for crewed Mars missions." },
];

const values = [
  { icon: Target, title: "Precision", desc: "Every component engineered to exacting standards with zero margin for error." },
  { icon: Users, title: "Collaboration", desc: "Partnering with 45+ nations to advance space science together." },
  { icon: Award, title: "Excellence", desc: "99.2% mission success rate across 150+ launches and counting." },
  { icon: Calendar, title: "Commitment", desc: "20+ years of continuous innovation pushing the boundaries of possible." },
];

function Counter({ value, suffix, inView }: { value: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 2000;
    const start = Date.now();
    const timer = setInterval(() => {
      const p = Math.min((Date.now() - start) / dur, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * value));
      if (p >= 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, value]);
  return <span>{count.toLocaleString()}{suffix}</span>;
}

export default function AboutPage() {
  const statsRef = useRef(null);
  const inView = useInView(statsRef, { once: true });

  return (
    <div className="page-enter">
      <PageHero
        title="About AstraMile"
        subtitle="Pioneering the next frontier of human exploration since 2005."
        image="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1400&q=80"
        label="Our Story"
      />

      {/* Mission Statement */}
      <section className="py-28 px-5 section-line">
        <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="tag mb-4 inline-block">Our Mission</span>
            <h2 className="text-3xl md:text-4xl font-bold t-primary mb-5 leading-snug">
              Making humanity a <span className="grad-text">multi-planetary species</span>
            </h2>
            <p className="t-secondary leading-relaxed mb-4">
              Our space program stands at the forefront of rocket innovation, pushing the boundaries of what&apos;s
              possible in space exploration. We develop rockets, spacecraft, and the technology needed to realize
              the dream of living and working in space.
            </p>
            <p className="t-muted leading-relaxed mb-4">
              With a fleet of proven launch vehicles and a pipeline of next-generation technologies, we serve
              commercial, government, and scientific customers worldwide. From deploying communication satellites
              to resupplying the International Space Station, every mission advances our understanding of the cosmos.
            </p>
            <p className="t-muted leading-relaxed">
              Looking ahead, our roadmap includes crewed lunar missions, Mars cargo delivery, and ultimately
              establishing the first permanent human settlement beyond Earth.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="grid grid-cols-2 gap-3">
            {[
              "https://images.unsplash.com/photo-1457364559154-aa2644600ebb?w=400&q=80",
              "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=400&q=80",
              "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=400&q=80",
              "https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=400&q=80",
            ].map((src, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30, filter: "blur(4px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative aspect-square overflow-hidden img-zoom gradient-border">
                <Image src={src} alt="Space" fill className="object-cover" sizes="25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/50 to-transparent" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="py-20 px-5">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 30, filter: "blur(4px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="card p-6 text-center gradient-border">
              <s.icon className="w-6 h-6 text-accent/60 mx-auto mb-3" />
              <p className="text-3xl font-bold grad-text mb-1">
                <Counter value={s.value} suffix={s.suffix} inView={inView} />
              </p>
              <p className="text-[11px] t-muted uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-28 px-5 section-line">
        <div className="max-w-[1400px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 35, filter: "blur(4px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }}
            className="text-center mb-14">
            <span className="tag mb-3 inline-block">What Drives Us</span>
            <h2 className="text-3xl md:text-5xl font-bold grad-text">Our Core Values</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 35, filter: "blur(4px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="card p-6 group text-center gradient-border">
                <div className="w-12 h-12 rounded-xl bg-accent/5 border border-accent/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/10 transition-colors">
                  <v.icon className="w-5 h-5 text-accent/60" />
                </div>
                <h3 className="text-base font-bold t-primary mb-2 group-hover:text-accent-light transition-colors">{v.title}</h3>
                <p className="t-muted text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-28 px-5">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 35, filter: "blur(4px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }}
            className="text-center mb-16">
            <span className="tag mb-3 inline-block">Our Journey</span>
            <h2 className="text-3xl md:text-5xl font-bold grad-text">Key Milestones</h2>
          </motion.div>

          <div className="relative">
            <div className="absolute left-4 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, var(--accent), var(--accent-warm), transparent)" }} />
            {milestones.map((m, i) => (
              <motion.div key={m.year} initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className={`relative flex mb-12 last:mb-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}>
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-bg border-2 border-accent z-10" style={{ boxShadow: "0 0 8px var(--glow-color)" }} />
                <div className={`ml-12 md:ml-0 md:w-[calc(50%-2rem)] ${i % 2 === 0 ? "md:pr-0" : "md:pl-0"}`}>
                  <div className="card p-5 gradient-border">
                    <span className="text-xs text-accent font-mono font-bold">{m.year}</span>
                    <h3 className="text-base font-bold t-primary mt-1 mb-1">{m.title}</h3>
                    <p className="t-secondary text-sm">{m.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
