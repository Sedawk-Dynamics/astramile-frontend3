"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Fuel, Navigation, Brain, ShieldCheck, RotateCcw, ArrowDownToLine, Cpu, Wifi, BatteryCharging } from "lucide-react";
import PageHero from "@/components/PageHero";

const techs = [
  { icon: Fuel, title: "Methane Propulsion", metric: "40%", metricLabel: "Efficiency Gain", progress: 92, color: "#f97316", desc: "Advanced liquid methane/oxygen engines producing cleaner burns with higher specific impulse than traditional RP-1 kerosene systems.", image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=400&q=80" },
  { icon: Navigation, title: "Star-Tracker Nav", metric: "0.01m", metricLabel: "Precision", progress: 97, color: "#7db4e0", desc: "Celestial navigation systems cross-referencing star catalogs for centimeter-level orbital insertion accuracy.", image: "https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=400&q=80" },
  { icon: Brain, title: "AI Flight Computer", metric: "200ms", metricLabel: "Response", progress: 88, color: "#a855f7", desc: "Machine learning flight computers performing real-time trajectory optimization and autonomous hazard avoidance.", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80" },
  { icon: ShieldCheck, title: "Thermal Protection", metric: "3000\u00b0F", metricLabel: "Max Temp", progress: 95, color: "#ef4444", desc: "Ablative ceramic composite tiles with embedded cooling channels for hypersonic atmospheric re-entry.", image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400&q=80" },
  { icon: RotateCcw, title: "Booster Recovery", metric: "70%", metricLabel: "Cost Saving", progress: 85, color: "#c49a6c", desc: "Propulsive landing with grid fin guidance enabling autonomous drone-ship and pad recovery in 8+ sea states.", image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=400&q=80" },
  { icon: ArrowDownToLine, title: "Precision Landing", metric: "<1m", metricLabel: "Accuracy", progress: 90, color: "#22c55e", desc: "Throttleable engines and cold-gas thrusters achieving sub-meter landing precision on moving platforms.", image: "https://images.unsplash.com/photo-1457364559154-aa2644600ebb?w=400&q=80" },
  { icon: Cpu, title: "Radiation-Hard Electronics", metric: "50krad", metricLabel: "Tolerance", progress: 93, color: "#06b6d4", desc: "Custom silicon designed to withstand deep-space radiation environments without performance degradation.", image: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=400&q=80" },
  { icon: Wifi, title: "Laser Comms", metric: "10Gbps", metricLabel: "Bandwidth", progress: 78, color: "#8b5cf6", desc: "Free-space optical communication links providing 100x bandwidth improvement over traditional radio frequency systems.", image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&q=80" },
  { icon: BatteryCharging, title: "Solar Electric", metric: "300kW", metricLabel: "Power Output", progress: 82, color: "#f59e0b", desc: "Next-generation solar arrays with concentrator optics powering high-thrust ion propulsion systems.", image: "https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?w=400&q=80" },
];

export default function TechnologyPage() {
  return (
    <div className="page-enter">
      <PageHero title="Rocket Technologies" subtitle="Cutting-edge systems powering the next era of space exploration."
        image="https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1400&q=80" label="Innovation" />

      <section className="py-28 px-5">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {techs.map((t, i) => (
            <motion.div key={t.title} initial={{ opacity: 0, y: 45, filter: "blur(4px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="card overflow-hidden group tilt-hover gradient-border">
              <div className="relative h-36 overflow-hidden img-zoom">
                <Image src={t.image} alt={t.title} fill className="object-cover" sizes="33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: `${t.color}10`, border: `1px solid ${t.color}20` }}>
                    <t.icon className="w-4 h-4" style={{ color: t.color }} />
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold t-primary font-mono">{t.metric}</p>
                    <p className="text-[9px] t-faint uppercase tracking-wider">{t.metricLabel}</p>
                  </div>
                </div>

                <h3 className="text-base font-bold t-primary mb-2 group-hover:text-accent-light transition-colors">{t.title}</h3>
                <p className="t-muted text-sm leading-relaxed mb-4">{t.desc}</p>

                <div>
                  <div className="flex justify-between text-[9px] t-faint mb-1 uppercase tracking-wider">
                    <span>Readiness</span>
                    <span style={{ color: t.color }}>{t.progress}%</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-[var(--surface)]">
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${t.progress}%` }}
                      viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.3 }}
                      className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${t.color}80, ${t.color})` }} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
