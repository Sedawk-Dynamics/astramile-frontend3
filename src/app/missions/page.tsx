"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Rocket as RocketIcon, MapPin } from "lucide-react";
import PageHero from "@/components/PageHero";
import { LoadingBlock, EmptyBlock, ErrorBlock } from "@/components/DataState";
import { ApiMission, resolveImage, usePublicList } from "@/lib/publicApi";

const statusLabel: Record<ApiMission["status"], string> = {
  PLANNED: "Planned",
  ACTIVE: "In Progress",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};
const statusColor: Record<ApiMission["status"], string> = {
  COMPLETED: "t-secondary border-[var(--border)]/20 bg-[var(--surface)]/5",
  ACTIVE: "text-accent border-accent/20 bg-accent/5",
  PLANNED: "text-teal border-teal/20 bg-teal/5",
  CANCELLED: "t-secondary border-gray-400/20 bg-gray-400/5",
};

function formatDate(d: string | null): string {
  if (!d) return "TBD";
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

export default function MissionsPage() {
  const { data: missions, loading, error } = usePublicList<ApiMission>("/api/missions");

  return (
    <div className="page-enter">
      <PageHero
        title="Mission Timeline"
        subtitle="From lunar landings to Mars colonization - our journey across the solar system."
        image="https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=1400&q=80"
        label="Mission Log"
      />

      <section className="py-28 px-5">
        {loading && <LoadingBlock label="Loading missions…" />}
        {!loading && error && <ErrorBlock error={error} />}
        {!loading && !error && missions.length === 0 && (
          <EmptyBlock title="No missions scheduled" hint="Create missions in the admin panel to build the timeline." />
        )}

        {missions.length > 0 && (
          <div className="max-w-5xl mx-auto relative">
            <div className="absolute left-5 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, var(--accent), var(--accent-warm), transparent)" }} />

            {missions.map((m, i) => {
              const isLeft = i % 2 === 0;
              const img = resolveImage(m.image);
              const rocket = m.launches?.[0]?.rocket?.name;
              return (
                <motion.div key={m.id} initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                  className={`relative flex mb-14 last:mb-0 ${isLeft ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}>

                  <div className="absolute left-5 md:left-1/2 -translate-x-1/2 z-10">
                    <div className="w-3.5 h-3.5 rounded-full bg-bg border-2 border-accent" style={{ boxShadow: "0 0 8px var(--glow-color)" }}>
                      <div className="w-1 h-1 rounded-full bg-accent mx-auto mt-[3px]" />
                    </div>
                  </div>

                  <div className="ml-14 md:ml-0 md:w-[calc(50%-2.5rem)]">
                    <div className="card overflow-hidden group tilt-hover gradient-border">
                      <div className={`relative h-44 overflow-hidden img-zoom ${!img ? "bg-[var(--surface)]" : ""}`}>
                        {img && <Image src={img} alt={m.name} fill className="object-cover" sizes="50vw" />}
                        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
                        <div className="absolute top-3 right-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusColor[m.status]}`}>
                            {statusLabel[m.status]}
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        {m.startDate && (
                          <div className="flex items-center gap-2 text-xs text-accent mb-2">
                            <Calendar className="w-3 h-3" /> {formatDate(m.startDate)}
                          </div>
                        )}
                        <h3 className="text-lg font-bold t-primary mb-2 group-hover:text-accent-light transition-colors">{m.name}</h3>
                        <div className="flex flex-wrap gap-3 text-[11px] t-muted mb-3">
                          {rocket && (
                            <span className="flex items-center gap-1"><RocketIcon className="w-3 h-3 text-teal/40" />{rocket}</span>
                          )}
                          {m.destination && (
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-accent/40" />{m.destination}</span>
                          )}
                        </div>
                        <p className="t-secondary text-sm leading-relaxed">{m.summary || m.description}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
