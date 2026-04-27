"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Target, Clock, AlertCircle } from "lucide-react";
import PageHero from "@/components/PageHero";
import { LoadingBlock, EmptyBlock, ErrorBlock } from "@/components/DataState";
import { ApiLaunch, resolveImage, usePublicList } from "@/lib/publicApi";

const statusLabel: Record<ApiLaunch["status"], string> = {
  UPCOMING: "On Schedule",
  LIVE: "Live Now",
  SUCCESS: "Successful",
  FAILURE: "Failure",
  SCRUBBED: "Scrubbed",
};

function Countdown({ target }: { target: Date }) {
  const [t, setT] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) return setT({ d: 0, h: 0, m: 0, s: 0 });
      setT({ d: Math.floor(diff / 864e5), h: Math.floor((diff / 36e5) % 24), m: Math.floor((diff / 6e4) % 60), s: Math.floor((diff / 1e3) % 60) });
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [target]);
  return (
    <div className="grid grid-cols-4 gap-1.5">
      {Object.entries(t).map(([k, v]) => (
        <div key={k} className="text-center">
          <div className="rounded-lg bg-[var(--surface)] border border-[var(--border)] p-2 font-mono text-lg font-bold t-primary tabular-nums">{String(v).padStart(2, "0")}</div>
          <p className="text-[9px] t-faint mt-1 uppercase">{k === "d" ? "days" : k === "h" ? "hrs" : k === "m" ? "min" : "sec"}</p>
        </div>
      ))}
    </div>
  );
}

export default function LaunchesPage() {
  const { data: launches, loading, error } = usePublicList<ApiLaunch>("/api/launches");

  return (
    <div className="page-enter">
      <PageHero title="Upcoming Launches" subtitle="Real-time countdowns to humanity's next giant leaps."
        image="https://images.unsplash.com/photo-1457364559154-aa2644600ebb?w=1400&q=80" label="Countdown" />

      <section className="py-28 px-5">
        <div className="max-w-[1400px] mx-auto">
          {loading && <LoadingBlock label="Loading launches…" />}
          {!loading && error && <ErrorBlock error={error} />}
          {!loading && !error && launches.length === 0 && (
            <EmptyBlock title="No launches scheduled" hint="Schedule launches in the admin panel to show countdowns here." />
          )}

          {launches.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {launches.map((l, i) => {
                const img = resolveImage(l.image);
                const target = new Date(l.scheduledAt);
                return (
                  <motion.div key={l.id} initial={{ opacity: 0, y: 35, filter: "blur(4px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="card overflow-hidden group tilt-hover gradient-border">
                    <div className={`relative h-40 overflow-hidden img-zoom ${!img ? "bg-[var(--surface)]" : ""}`}>
                      {img && <Image src={img} alt={l.name} fill className="object-cover" sizes="33vw" />}
                      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />
                      <div className="absolute top-3 left-3 glass rounded-full px-2.5 py-0.5 flex items-center gap-1">
                        <AlertCircle className="w-2.5 h-2.5 t-secondary" />
                        <span className="text-[10px] t-secondary font-medium">{statusLabel[l.status]}</span>
                      </div>
                      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                        <h3 className="text-base font-bold t-primary">{l.name}</h3>
                        {l.rocket?.name && <span className="tag text-[9px]">{l.rocket.name}</span>}
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <Countdown target={target} />
                      <div className="space-y-1.5 pt-1">
                        {l.launchSite && (
                          <p className="flex items-center gap-2 text-xs t-muted"><MapPin className="w-3 h-3 text-accent/40" />{l.launchSite}</p>
                        )}
                        {l.description && (
                          <p className="flex items-center gap-2 text-xs t-muted"><Target className="w-3 h-3 text-teal/40" />{l.description}</p>
                        )}
                        <p className="flex items-center gap-2 text-xs t-muted"><Clock className="w-3 h-3 text-accent2/40" />{target.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
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
