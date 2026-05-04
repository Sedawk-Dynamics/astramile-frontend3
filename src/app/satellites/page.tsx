"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Cpu,
  Radio,
  Zap,
  Shield,
  Wrench,
  Layers,
  ArrowRight,
  ArrowUpRight,
} from "lucide-react";
import PageHero from "@/components/PageHero";
import MagneticWrap from "@/components/MagneticWrap";

type Spec = { label: string; value: string };
type Platform = {
  cls: string;
  range: string;
  title: string;
  tagline: string;
  description: string;
  image: string;
  accent: string;
  specs: Spec[];
  applications: string[];
};

const PLATFORMS: Platform[] = [
  {
    cls: "Nano",
    range: "10 – 50 kg",
    title: "Nano Satellites",
    tagline: "Constellation-ready small platforms",
    description:
      "Compact CubeSat-class buses optimised for IoT, Earth-observation demonstrators, and rapid technology validation. Ideal for low-cost constellations and rideshare missions.",
    image:
      "https://images.unsplash.com/photo-1460186136353-977e9d6085a1?w=1200&q=80",
    accent: "var(--accent)",
    specs: [
      { label: "Mass class", value: "10 – 50 kg" },
      { label: "Bus form", value: "3U / 6U / 12U" },
      { label: "Power (EOL)", value: "Up to 80 W" },
      { label: "Design life", value: "3 – 5 years" },
    ],
    applications: [
      "IoT & M2M connectivity",
      "Earth observation demonstrators",
      "Technology & payload validation",
      "Educational & research missions",
    ],
  },
  {
    cls: "Micro",
    range: "100 – 500 kg",
    title: "Micro Satellites",
    tagline: "Mid-class buses for mission-grade payloads",
    description:
      "Mid-class platforms supporting high-resolution Earth observation, communications, and scientific payloads with chemical or electric propulsion options for orbit raising and station-keeping.",
    image:
      "https://images.unsplash.com/photo-1457364887197-9150188c107b?w=1200&q=80",
    accent: "var(--accent-warm)",
    specs: [
      { label: "Mass class", value: "100 – 500 kg" },
      { label: "Bus form", value: "Custom structural" },
      { label: "Power (EOL)", value: "Up to 1.2 kW" },
      { label: "Design life", value: "5 – 7 years" },
    ],
    applications: [
      "High-resolution optical & SAR imaging",
      "Communications & data relay",
      "Scientific & atmospheric research",
      "Defence & strategic missions",
    ],
  },
];

const CAPABILITIES = [
  {
    icon: Cpu,
    title: "Avionics & On-Board Computing",
    desc: "Radiation-tolerant flight computers, FDIR logic, and autonomous mission management.",
  },
  {
    icon: Radio,
    title: "Communications",
    desc: "S, X and Ka-band TT&C, high-rate downlink, inter-satellite link design.",
  },
  {
    icon: Zap,
    title: "Power Systems",
    desc: "Body-mounted & deployable solar arrays, Li-ion batteries, regulated PCDU.",
  },
  {
    icon: Layers,
    title: "Structures & Thermal",
    desc: "CFRP / aluminium honeycomb panels, passive & active thermal control.",
  },
  {
    icon: Wrench,
    title: "Propulsion Integration",
    desc: "Cold-gas, monopropellant and electric propulsion options for orbit control.",
  },
  {
    icon: Shield,
    title: "AIT & Qualification",
    desc: "Vibration, thermal-vacuum, EMI/EMC and end-to-end functional testing.",
  },
];

const PROCESS = [
  { step: "01", title: "Mission scoping", desc: "Payload, orbit, link budget and lifecycle requirements." },
  { step: "02", title: "Bus selection", desc: "Choose nano or micro platform and tailor sub-systems." },
  { step: "03", title: "Build & integrate", desc: "In-house manufacturing, harness, and payload integration." },
  { step: "04", title: "Test & deliver", desc: "AIT, environmental qualification and launch readiness." },
];

export default function SatellitesPage() {
  return (
    <div className="page-enter">
      <PageHero
        title="Our Satellites"
        subtitle="Indigenous nano and micro satellite platforms — engineered, integrated, and qualified in-house."
        image="https://images.unsplash.com/photo-1446776709462-d6b525c57bd3?w=1600&q=80"
        label="Satellite Manufacturing"
      />

      {/* Intro */}
      <section className="relative py-20 md:py-28 px-5 overflow-hidden">
        <div className="aurora-bg opacity-20" />
        <div className="relative z-10 max-w-[1100px] mx-auto text-center">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="section-num block mb-4">
            Platforms
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-3xl md:text-5xl mb-6">
            Two classes. One design philosophy.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="t-secondary text-base md:text-lg leading-relaxed max-w-3xl mx-auto">
            From 10&nbsp;kg CubeSats to 500&nbsp;kg mid-class buses, our satellite platforms share a common
            avionics core, modular sub-systems and rigorous in-house qualification — delivering reliable
            spacecraft for IoT, Earth observation, communications and scientific missions.
          </motion.p>
        </div>
      </section>

      {/* Platforms */}
      <section className="relative py-12 md:py-20 px-5 overflow-hidden">
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {PLATFORMS.map((sat, i) => {
              return (
                <motion.div
                  key={sat.cls}
                  initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className="group">
                  <div className="card overflow-hidden gradient-border h-full flex flex-col">
                    <div className="relative h-64 md:h-80 overflow-hidden img-zoom">
                      <Image
                        src={sat.image}
                        alt={sat.title}
                        fill
                        className="object-cover"
                        sizes="(min-width: 768px) 50vw, 100vw"
                      />
                      <div
                        className="absolute inset-0"
                        style={{ background: "linear-gradient(to top, var(--bg-card) 10%, transparent 55%)" }}
                      />
                      <div className="absolute top-4 left-4 glass rounded-lg px-3 py-1.5">
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] t-secondary">
                          {sat.cls} Class
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 glass rounded-lg px-3 py-1.5">
                        <span className="text-xs font-mono font-bold" style={{ color: sat.accent }}>
                          {sat.range}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 md:p-8 flex-1 flex flex-col">
                      <p className="text-accent text-[10px] uppercase tracking-[0.2em] font-mono mb-2">
                        {sat.tagline}
                      </p>
                      <h3 className="font-display text-2xl md:text-3xl mb-3 group-hover:text-accent-light transition-colors">
                        {sat.title}
                      </h3>
                      <p className="t-secondary text-sm leading-relaxed mb-6">{sat.description}</p>

                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {sat.specs.map((s) => (
                          <div
                            key={s.label}
                            className="p-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border)]">
                            <p className="text-[10px] t-muted uppercase tracking-wider">{s.label}</p>
                            <p className="text-xs font-semibold t-secondary mt-1">{s.value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="flex-1">
                        <p className="text-[10px] t-faint uppercase tracking-[0.2em] font-mono mb-3">
                          Applications
                        </p>
                        <ul className="space-y-2">
                          {sat.applications.map((a) => (
                            <li
                              key={a}
                              className="text-xs t-secondary font-mono flex items-start gap-2">
                              <span
                                className="mt-1.5 w-1 h-1 rounded-full flex-shrink-0"
                                style={{ background: sat.accent }}
                              />
                              <span>{a}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <motion.div
                        className="h-px mt-6 origin-left"
                        style={{ background: `linear-gradient(90deg, ${sat.accent}, transparent)` }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + i * 0.15, duration: 1 }}
                      />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Manufacturing Capabilities */}
      <section className="relative py-20 md:py-28 px-5 overflow-hidden">
        <div className="aurora-bg opacity-25" />
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <div className="watermark-top">Capabilities</div>
          <div className="mb-12 md:mb-16">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="section-num block mb-4">
              Manufacturing
            </motion.span>
            <h2 className="font-display text-3xl md:text-5xl mb-4">In-house capabilities</h2>
            <p className="t-muted text-sm md:text-base font-mono max-w-2xl">
              End-to-end satellite manufacturing — from sub-system design and assembly to full
              environmental qualification.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {CAPABILITIES.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6 }}
                  className="card p-6 group hover:border-accent transition-colors">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: "rgba(0,0,0,0.4)",
                      border: "1px solid var(--border)",
                    }}>
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="font-display text-base md:text-lg mb-2 group-hover:text-accent-light transition-colors">
                    {c.title}
                  </h3>
                  <p className="t-muted text-xs md:text-sm leading-relaxed">{c.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="relative py-20 md:py-28 px-5 overflow-hidden">
        <div className="relative z-10 max-w-[1400px] mx-auto">
          <div className="mb-12 md:mb-16 text-center">
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="section-num block mb-4">
              Workflow
            </motion.span>
            <h2 className="font-display text-3xl md:text-5xl mb-3">From mission to orbit</h2>
            <p className="t-muted text-sm md:text-base font-mono max-w-xl mx-auto">
              A streamlined four-step process built around your mission.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {PROCESS.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-6 relative overflow-hidden">
                <span className="absolute top-3 right-4 font-display text-5xl t-faint opacity-20">
                  {p.step}
                </span>
                <p className="text-accent text-[10px] uppercase tracking-[0.2em] font-mono mb-3">
                  Step {p.step}
                </p>
                <h3 className="font-display text-lg mb-2">{p.title}</h3>
                <p className="t-muted text-xs leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="relative py-20 md:py-28 px-5 overflow-hidden">
        <div className="aurora-bg opacity-30" />
        <div className="relative z-10 max-w-[1100px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="card p-8 md:p-12 gradient-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div>
                <p className="section-num block mb-3">Procurement &amp; Partnerships</p>
                <h3 className="font-display text-2xl md:text-4xl mb-3">
                  Need a satellite mission?
                </h3>
                <p className="t-secondary text-sm md:text-base font-mono max-w-xl leading-relaxed">
                  Tell us about your payload, orbit and timeline — our team will scope a tailored
                  mission proposal for your nano or micro satellite requirement.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row md:flex-col gap-3 flex-shrink-0">
                <MagneticWrap className="inline-block">
                  <Link
                    href="/contact?subject=Satellite%20Inquiry"
                    className="btn btn-accent text-xs whitespace-nowrap">
                    Contact Us <ArrowRight className="w-3 h-3" />
                  </Link>
                </MagneticWrap>
                <MagneticWrap className="inline-block">
                  <Link
                    href="/about"
                    className="btn btn-ice text-xs whitespace-nowrap"
                    style={{ borderColor: "rgba(255,255,255,0.2)" }}>
                    About Astramile <ArrowUpRight className="w-3 h-3" />
                  </Link>
                </MagneticWrap>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
