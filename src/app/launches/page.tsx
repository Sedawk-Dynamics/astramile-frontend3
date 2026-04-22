"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MapPin, Target, Clock, AlertCircle, Play, RotateCcw } from "lucide-react";
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

type Phase = "idle" | "countdown" | "ignition" | "liftoff" | "flight";

function LaunchSim() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [count, setCount] = useState(10);

  useEffect(() => {
    if (phase !== "countdown") return;
    if (count <= 0) {
      setPhase("ignition");
      const t1 = setTimeout(() => setPhase("liftoff"), 1500);
      const t2 = setTimeout(() => setPhase("flight"), 3500);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    const i = setInterval(() => setCount((c) => c - 1), 1000);
    return () => clearInterval(i);
  }, [phase, count]);

  return (
    <div className="card p-8 text-center gradient-border">
      <h3 className="text-xl font-bold grad-text mb-6">Launch Simulation</h3>
      <div className="relative h-64 rounded-xl overflow-hidden mb-6" style={{ background: "linear-gradient(to bottom, var(--bg-alt), var(--bg))" }}>
        {(phase === "liftoff" || phase === "flight") && Array.from({ length: 30 }).map((_, i) => (
          <div key={i} className="absolute w-0.5 h-0.5 rounded-full animate-twinkle" style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 60}%`, animationDelay: `${Math.random() * 2}s`, background: "var(--accent)" }} />
        ))}
        <motion.div animate={phase === "flight" ? { y: -300, scale: 0.3 } : phase === "liftoff" ? { y: -150 } : phase === "ignition" ? { y: [0, 2, -2, 0] } : { y: 0 }}
          transition={phase === "flight" ? { duration: 3 } : phase === "ignition" ? { duration: 0.3, repeat: Infinity } : { duration: 2 }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 text-5xl select-none">
          🚀
          {(phase === "ignition" || phase === "liftoff" || phase === "flight") && (
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-4 h-10 rounded-b-full animate-pulse" style={{ background: "linear-gradient(to bottom, var(--accent-warm), var(--accent), transparent)" }} />
          )}
        </motion.div>
        {phase === "countdown" && <div className="absolute inset-0 flex items-center justify-center text-7xl font-bold font-mono" style={{ color: "var(--accent)", opacity: 0.8 }}>{count}</div>}
        {phase === "flight" && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center text-xl font-bold grad-text">LAUNCH SUCCESSFUL</motion.p>}
      </div>
      {phase === "idle" && <button onClick={() => { setPhase("countdown"); setCount(10); }} className="btn btn-accent"><Play className="w-4 h-4" /> Initiate Launch</button>}
      {phase === "flight" && <button onClick={() => { setPhase("idle"); setCount(10); }} className="btn btn-ice"><RotateCcw className="w-4 h-4" /> Reset</button>}
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
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

          <LaunchSim />
        </div>
      </section>
    </div>
  );
}
