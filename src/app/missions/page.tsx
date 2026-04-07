"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Rocket, MapPin } from "lucide-react";
import TextReveal from "@/components/TextReveal";
import PageHero from "@/components/PageHero";

const missions = [
  { name: "Artemis III - Lunar Landing", date: "Nov 2024", rocket: "Starship HLS", dest: "Lunar South Pole", desc: "First crewed lunar landing in over 50 years. Astronauts will explore permanently shadowed craters searching for water ice deposits.", image: "https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=600&q=80", status: "Completed" },
  { name: "Mars Rover Deployment", date: "Jul 2025", rocket: "Atlas V 541", dest: "Jezero Crater, Mars", desc: "Next-gen rover with advanced AI autonomously searching for biosignatures of ancient microbial life in dried river deltas.", image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=600&q=80", status: "In Progress" },
  { name: "Starlink Mega-Constellation", date: "Mar 2026", rocket: "Falcon Heavy", dest: "Low Earth Orbit", desc: "Deploying 60 V2 communication satellites providing gigabit internet coverage to underserved regions worldwide.", image: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=600&q=80", status: "Upcoming" },
  { name: "ISS Resupply CRS-30", date: "Sep 2026", rocket: "PSLV C-58", dest: "International Space Station", desc: "Critical resupply delivering 3,600 kg of experiments, crew provisions, and station hardware upgrades.", image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80", status: "Upcoming" },
  { name: "Europa Clipper", date: "Jan 2027", rocket: "GSLV Mk III", dest: "Jupiter - Europa", desc: "Investigating subsurface ocean of Jupiter's moon through 50 close flybys, analyzing ice shell composition for habitability.", image: "https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=600&q=80", status: "Planning" },
  { name: "Solar Observatory II", date: "Jun 2027", rocket: "Ariane 5 ECA", dest: "Sun-Earth L1 Point", desc: "Advanced observatory studying coronal mass ejections with unprecedented resolution to improve space weather forecasting.", image: "https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?w=600&q=80", status: "Planning" },
  { name: "Titan Dragonfly", date: "Dec 2027", rocket: "Falcon Heavy", dest: "Saturn - Titan", desc: "Rotorcraft lander exploring Saturn's largest moon, sampling diverse surface environments and searching for prebiotic chemistry.", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80", status: "Planning" },
  { name: "Mars Cargo Delivery", date: "Mar 2028", rocket: "Starship", dest: "Arcadia Planitia, Mars", desc: "First uncrewed Starship cargo mission to Mars surface, pre-positioning habitat modules and supplies for crewed missions.", image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=600&q=80", status: "Conceptual" },
];

const statusColor: Record<string, string> = {
  Completed: "t-secondary border-[var(--border)]/20 bg-[var(--surface)]/5",
  "In Progress": "text-accent border-accent/20 bg-accent/5",
  Upcoming: "text-teal border-teal/20 bg-teal/5",
  Planning: "text-accent2 border-accent2/20 bg-accent2/5",
  Conceptual: "t-secondary border-gray-400/20 bg-gray-400/5",
};

export default function MissionsPage() {
  return (
    <div className="page-enter">
      <PageHero
        title="Mission Timeline"
        subtitle="From lunar landings to Mars colonization - our journey across the solar system."
        image="https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=1400&q=80"
        label="Mission Log"
      />

      <section className="py-28 px-5">
        <div className="max-w-5xl mx-auto relative">
          <div className="absolute left-5 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, var(--accent), var(--accent-warm), transparent)" }} />

          {missions.map((m, i) => {
            const isLeft = i % 2 === 0;
            return (
              <motion.div key={m.name} initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                className={`relative flex mb-14 last:mb-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}>

                <div className="absolute left-5 md:left-1/2 -translate-x-1/2 z-10">
                  <div className="w-3.5 h-3.5 rounded-full bg-bg border-2 border-accent" style={{ boxShadow: "0 0 8px var(--glow-color)" }}>
                    <div className="w-1 h-1 rounded-full bg-accent mx-auto mt-[3px]" />
                  </div>
                </div>

                <div className={`ml-14 md:ml-0 md:w-[calc(50%-2.5rem)] ${isLeft ? "" : ""}`}>
                  <div className="card overflow-hidden group tilt-hover gradient-border">
                    <div className="relative h-44 overflow-hidden img-zoom">
                      <Image src={m.image} alt={m.name} fill className="object-cover" sizes="50vw" />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
                      <div className="absolute top-3 right-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusColor[m.status] || ""}`}>
                          {m.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-accent mb-2">
                        <Calendar className="w-3 h-3" /> {m.date}
                      </div>
                      <h3 className="text-lg font-bold t-primary mb-2 group-hover:text-accent-light transition-colors">{m.name}</h3>
                      <div className="flex flex-wrap gap-3 text-[11px] t-muted mb-3">
                        <span className="flex items-center gap-1"><Rocket className="w-3 h-3 text-teal/40" />{m.rocket}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-accent/40" />{m.dest}</span>
                      </div>
                      <p className="t-secondary text-sm leading-relaxed">{m.desc}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
