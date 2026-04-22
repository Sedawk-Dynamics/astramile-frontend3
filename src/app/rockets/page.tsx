"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Ruler, Weight, Target, ArrowUpRight, CheckCircle } from "lucide-react";
import PageHero from "@/components/PageHero";
import { LoadingBlock, EmptyBlock, ErrorBlock } from "@/components/DataState";
import { ApiRocket, resolveImage, usePublicList } from "@/lib/publicApi";

function formatMeters(n: number | null): string { return n === null ? "—" : `${n} m`; }
function formatKg(n: number | null): string {
  if (n === null) return "—";
  return `${n.toLocaleString()} kg`;
}

export default function RocketsPage() {
  const { data: rockets, loading, error } = usePublicList<ApiRocket>("/api/rockets");

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
          {loading && <LoadingBlock label="Loading rockets…" />}
          {!loading && error && <ErrorBlock error={error} />}
          {!loading && !error && rockets.length === 0 && (
            <EmptyBlock title="No rockets yet" hint="Add rockets from the admin panel to populate this page." />
          )}

          {rockets.map((r, i) => {
            const img = resolveImage(r.image);
            const success = r.successRate ?? 0;
            return (
              <motion.div key={r.id} initial={{ opacity: 0, y: 45, filter: "blur(4px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }} transition={{ duration: 0.7 }}
                className="card overflow-hidden group tilt-hover">
                <div className={`grid lg:grid-cols-2 ${i % 2 !== 0 ? "lg:direction-rtl" : ""}`}>
                  <div className={`relative h-72 lg:h-auto overflow-hidden img-zoom ${i % 2 !== 0 ? "lg:order-2" : ""} ${!img ? "bg-[var(--surface)]" : ""}`}>
                    {img && (
                      <Image src={img} alt={r.name} fill className="object-cover" sizes="50vw" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent lg:bg-none" />
                    <div className={`absolute inset-0 hidden lg:block ${i % 2 !== 0
                      ? "bg-gradient-to-l from-bg via-transparent to-transparent"
                      : "bg-gradient-to-r from-bg via-transparent to-transparent"
                    }`} />
                    {r.successRate !== null && <div className="absolute top-4 left-4 tag-ice">{success}% success</div>}
                  </div>

                  <div className={`p-8 lg:p-10 flex flex-col justify-center ${i % 2 !== 0 ? "lg:order-1" : ""}`}>
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl md:text-3xl font-bold t-primary group-hover:text-accent-light transition-colors">{r.name}</h3>
                      <ArrowUpRight className="w-5 h-5 t-faint group-hover:text-accent-light transition-colors mt-1" />
                    </div>
                    {r.tagline && <p className="text-accent text-xs uppercase tracking-wider mb-3">{r.tagline}</p>}
                    <p className="t-secondary leading-relaxed mb-6">{r.description}</p>

                    <div className="grid grid-cols-4 gap-3 mb-6">
                      {[
                        { icon: Ruler, label: "Height", val: formatMeters(r.heightM) },
                        { icon: Weight, label: "Weight", val: formatKg(r.weightKg) },
                        { icon: Target, label: "Payload", val: formatKg(r.payloadKg) },
                        { icon: CheckCircle, label: "Launches", val: String(r.launches) },
                      ].map((s) => (
                        <div key={s.label} className="text-center p-3 rounded-xl bg-[var(--input-bg)] border border-[var(--border)]">
                          <s.icon className="w-3.5 h-3.5 text-accent/50 mx-auto mb-1" />
                          <p className="text-[10px] t-muted uppercase tracking-wider">{s.label}</p>
                          <p className="text-xs font-semibold t-secondary mt-0.5">{s.val}</p>
                        </div>
                      ))}
                    </div>

                    {r.features.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {r.features.map((f) => (
                          <span key={f} className="tag text-[10px]">{f}</span>
                        ))}
                      </div>
                    )}

                    {r.successRate !== null && (
                      <div className="mt-6 pt-4 border-t border-[var(--border)]">
                        <div className="flex justify-between text-[10px] t-muted mb-1 uppercase tracking-wider">
                          <span>Success Rate</span>
                          <span className="text-accent">{success}%</span>
                        </div>
                        <div className="w-full h-1 rounded-full bg-[var(--surface)]">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${success}%` }}
                            viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.3 }}
                            className="h-full rounded-full" style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-warm))" }} />
                        </div>
                      </div>
                    )}
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
