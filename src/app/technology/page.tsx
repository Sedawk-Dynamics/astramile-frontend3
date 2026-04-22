"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import * as LucideIcons from "lucide-react";
import PageHero from "@/components/PageHero";
import { LoadingBlock, EmptyBlock, ErrorBlock } from "@/components/DataState";
import { ApiTech, resolveImage, usePublicList } from "@/lib/publicApi";

const COLORS = ["#f97316", "#7db4e0", "#a855f7", "#ef4444", "#c49a6c", "#22c55e", "#06b6d4", "#8b5cf6", "#f59e0b"];

type LucideComponent = React.ComponentType<{ className?: string; style?: React.CSSProperties }>;

function resolveIcon(name: string | null): LucideComponent {
  const lib = LucideIcons as unknown as Record<string, LucideComponent>;
  if (name && lib[name]) return lib[name];
  return lib.Rocket;
}

export default function TechnologyPage() {
  const { data: techs, loading, error } = usePublicList<ApiTech>("/api/technology");

  return (
    <div className="page-enter">
      <PageHero title="Rocket Technologies" subtitle="Cutting-edge systems powering the next era of space exploration."
        image="https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=1400&q=80" label="Innovation" />

      <section className="py-28 px-5">
        <div className="max-w-[1400px] mx-auto">
          {loading && <LoadingBlock label="Loading technologies…" />}
          {!loading && error && <ErrorBlock error={error} />}
          {!loading && !error && techs.length === 0 && (
            <EmptyBlock title="No technologies yet" hint="Add entries in the admin panel to showcase them here." />
          )}

          {techs.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {techs.map((t, i) => {
                const Icon = resolveIcon(t.icon);
                const color = COLORS[i % COLORS.length];
                const img = resolveImage(t.image);
                const progress = 85 + (i * 3) % 15;
                return (
                  <motion.div key={t.id} initial={{ opacity: 0, y: 45, filter: "blur(4px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="card overflow-hidden group tilt-hover gradient-border">
                    <div className={`relative h-36 overflow-hidden img-zoom ${!img ? "bg-[var(--surface)]" : ""}`}>
                      {img && <Image src={img} alt={t.title} fill className="object-cover" sizes="33vw" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center"
                          style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
                          <Icon className="w-4 h-4" style={{ color }} />
                        </div>
                        {t.metric && (
                          <div className="text-right">
                            <p className="text-lg font-bold t-primary font-mono">{t.metric}</p>
                            {t.metricLabel && <p className="text-[9px] t-faint uppercase tracking-wider">{t.metricLabel}</p>}
                          </div>
                        )}
                      </div>

                      <h3 className="text-base font-bold t-primary mb-2 group-hover:text-accent-light transition-colors">{t.title}</h3>
                      <p className="t-muted text-sm leading-relaxed mb-4">{t.description}</p>

                      <div>
                        <div className="flex justify-between text-[9px] t-faint mb-1 uppercase tracking-wider">
                          <span>Readiness</span>
                          <span style={{ color }}>{progress}%</span>
                        </div>
                        <div className="w-full h-1 rounded-full bg-[var(--surface)]">
                          <motion.div initial={{ width: 0 }} whileInView={{ width: `${progress}%` }}
                            viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.3 }}
                            className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${color}80, ${color})` }} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
