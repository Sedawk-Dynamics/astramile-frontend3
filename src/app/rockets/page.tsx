"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Ruler, Weight, Target, ArrowUpRight, CheckCircle } from "lucide-react";
import TextReveal from "@/components/TextReveal";
import PageHero from "@/components/PageHero";

const rockets = [
  {
    name: "Falcon Heavy", height: "70 m", weight: "1,420,788 kg", payload: "63,800 kg", success: 100, launches: 12,
    desc: "The world's most powerful operational rocket by a factor of two. Capable of lifting the equivalent of a fully loaded 737 jetliner to orbit.",
    features: ["27 Merlin engines", "Reusable side boosters", "Payload fairing recovery", "Cross-feed fueling"],
    image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=700&q=80",
  },
  {
    name: "Starship", height: "120 m", weight: "5,000,000 kg", payload: "150,000 kg", success: 85, launches: 6,
    desc: "Fully reusable transportation system designed for crew and cargo to Earth orbit, the Moon, Mars, and beyond.",
    features: ["33 Raptor engines", "Full reusability", "Orbital refueling", "Mars colonization capable"],
    image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=700&q=80",
  },
  {
    name: "Atlas V", height: "58.3 m", weight: "590,000 kg", payload: "18,850 kg", success: 99, launches: 99,
    desc: "America's most reliable expendable launch vehicle delivering critical national security and science payloads.",
    features: ["RD-180 main engine", "Centaur upper stage", "100+ configurations", "98.9% success rate"],
    image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=700&q=80",
  },
  {
    name: "Ariane 5", height: "52 m", weight: "780,000 kg", payload: "21,000 kg", success: 96, launches: 117,
    desc: "Europe's flagship heavy-lift launcher. Deployed the James Webb Space Telescope on its historic mission.",
    features: ["Vulcain 2 engine", "Solid rocket boosters", "Dual-payload adapter", "GTO specialist"],
    image: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=700&q=80",
  },
  {
    name: "PSLV", height: "44 m", weight: "320,000 kg", payload: "3,800 kg", success: 94, launches: 59,
    desc: "India's workhorse rocket. Holds the world record for deploying 104 satellites in a single mission.",
    features: ["4 stage design", "Solid + liquid stages", "Record 104 satellites", "Cost-effective platform"],
    image: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=700&q=80",
  },
  {
    name: "GSLV Mk III", height: "43.4 m", weight: "640,000 kg", payload: "10,000 kg", success: 100, launches: 7,
    desc: "India's heavy-lift vehicle with indigenous cryogenic upper stage. Launched Chandrayaan missions.",
    features: ["S200 solid boosters", "CE-20 cryo engine", "4-ton GTO capacity", "Human-rated variant"],
    image: "https://images.unsplash.com/photo-1457364559154-aa2644600ebb?w=700&q=80",
  },
];

export default function RocketsPage() {
  return (
    <div className="page-enter">
      <PageHero
        title="Our Rockets"
        subtitle="A fleet of proven launch vehicles engineered for every orbit."
        image="https://images.unsplash.com/photo-1517976487492-5750f3195933?w=1400&q=80"
        label="Fleet Overview"
      />

      <section className="py-28 px-5">
        <div className="max-w-[1400px] mx-auto space-y-8">
          {rockets.map((r, i) => (
            <motion.div key={r.name} initial={{ opacity: 0, y: 45, filter: "blur(4px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}
              className="card overflow-hidden group tilt-hover">
              <div className={`grid lg:grid-cols-2 ${i % 2 !== 0 ? "lg:direction-rtl" : ""}`}>
                {/* Image */}
                <div className={`relative h-72 lg:h-auto overflow-hidden img-zoom ${i % 2 !== 0 ? "lg:order-2" : ""}`}>
                  <Image src={r.image} alt={r.name} fill className="object-cover" sizes="50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent lg:bg-none" />
                  <div className={`absolute inset-0 hidden lg:block ${i % 2 !== 0
                    ? "bg-gradient-to-l from-bg via-transparent to-transparent"
                    : "bg-gradient-to-r from-bg via-transparent to-transparent"
                  }`} />
                  <div className="absolute top-4 left-4 tag-ice">{r.success}% success</div>
                </div>

                {/* Content */}
                <div className={`p-8 lg:p-10 flex flex-col justify-center ${i % 2 !== 0 ? "lg:order-1" : ""}`}>
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl md:text-3xl font-bold t-primary group-hover:text-accent-light transition-colors">{r.name}</h3>
                    <ArrowUpRight className="w-5 h-5 t-faint group-hover:text-accent-light transition-colors mt-1" />
                  </div>
                  <p className="t-secondary leading-relaxed mb-6">{r.desc}</p>

                  {/* Specs */}
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {[
                      { icon: Ruler, label: "Height", val: r.height },
                      { icon: Weight, label: "Weight", val: r.weight },
                      { icon: Target, label: "Payload", val: r.payload },
                      { icon: CheckCircle, label: "Launches", val: String(r.launches) },
                    ].map((s) => (
                      <div key={s.label} className="text-center p-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border)]">
                        <s.icon className="w-3.5 h-3.5 text-accent/50 mx-auto mb-1" />
                        <p className="text-[10px] t-muted uppercase tracking-wider">{s.label}</p>
                        <p className="text-xs font-semibold t-secondary mt-0.5">{s.val}</p>
                      </div>
                    ))}
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {r.features.map((f) => (
                      <span key={f} className="tag text-[10px]">{f}</span>
                    ))}
                  </div>

                  {/* Success bar */}
                  <div className="mt-6 pt-4 border-t border-[var(--border)]">
                    <div className="flex justify-between text-[10px] t-muted mb-1 uppercase tracking-wider">
                      <span>Success Rate</span>
                      <span className="text-accent">{r.success}%</span>
                    </div>
                    <div className="w-full h-1 rounded-full bg-[var(--surface)]">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${r.success}%` }}
                        viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.3 }}
                        className="h-full rounded-full" style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-warm))" }} />
                    </div>
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
