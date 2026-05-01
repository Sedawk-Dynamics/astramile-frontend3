"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Briefcase, Globe, Award } from "lucide-react";
import PageHero from "@/components/PageHero";
import TextReveal from "@/components/TextReveal";
import { LoadingBlock, EmptyBlock, ErrorBlock } from "@/components/DataState";
import { ApiCrew, resolveImage, usePublicList } from "@/lib/publicApi";

function TeamCard({ person, idx, badge }: { person: ApiCrew; idx: number; badge: string }) {
  const [flipped, setFlipped] = useState(false);
  const img = resolveImage(person.photo);

  return (
    <motion.div
      initial={{ opacity: 0, y: 45, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      whileHover={{ y: -6 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.08, duration: 0.6 }}
      className="h-[540px] md:h-[600px] cursor-pointer [perspective:1400px] group"
      onClick={() => setFlipped(!flipped)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFlipped(!flipped); } }}
      aria-pressed={flipped}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full h-full [transform-style:preserve-3d] [will-change:transform]"
      >
        {/* FRONT — styles inlined (not .card) so :hover translateY can't fight rotateY */}
        <div className="absolute inset-0 [backface-visibility:hidden] bg-[var(--bg-card)] border border-[var(--border)] overflow-hidden gradient-border transition-[border-color,box-shadow] duration-500 group-hover:border-[var(--border-hover)] group-hover:shadow-[0_20px_60px_-15px_rgba(255,255,255,0.08)]">
          <div className={`relative h-[340px] md:h-[380px] overflow-hidden img-zoom ${!img ? "bg-[var(--surface)]" : ""}`}>
            {img && (
              <Image
                src={img}
                alt={person.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority={idx < 3}
              />
            )}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-bg via-bg/40 to-transparent pointer-events-none" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity overflow-hidden pointer-events-none">
              <div className="absolute left-0 right-0 h-px" style={{ background: "var(--accent)", opacity: 0.3, animation: "scan 3s linear infinite" }} />
            </div>
          </div>
          <div className="p-6 text-center">
            <h3 className="text-xl font-bold t-primary mb-1">{person.name}</h3>
            <p className="text-accent text-sm mb-4">{person.role}</p>
            <div className="flex justify-center gap-6 text-sm t-muted">
              <span className="flex items-center gap-1.5"><Briefcase className="w-3.5 h-3.5 text-accent/50" />{badge}</span>
              {person.nationality && (
                <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5 text-teal/50" />{person.nationality}</span>
              )}
            </div>
            <p className="text-[10px] t-faint mt-5 tracking-[0.2em] uppercase">Click to read bio</p>
          </div>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[var(--bg-card)] border border-[var(--border)] p-6 flex flex-col items-center justify-center text-center">
          {img && (
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-accent/30 flex-shrink-0">
              <Image src={img} alt={person.name} width={96} height={96} className="object-cover object-top w-full h-full" />
            </div>
          )}
          <h3 className="text-xl font-bold grad-text mb-1">{person.name}</h3>
          <p className="text-accent text-xs mb-4">{person.role}</p>
          <p className="t-secondary text-sm leading-relaxed mb-4 max-h-56 overflow-y-auto px-2">{person.bio}</p>
          <div className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-accent/40" />
            <Award className="w-3.5 h-3.5 text-accent/40" />
            <Award className="w-3.5 h-3.5 text-accent/40" />
          </div>
          <p className="text-[10px] t-faint mt-4 tracking-[0.2em] uppercase">Click to flip back</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

function TeamSection({
  num,
  eyebrow,
  title,
  subtitle,
  badge,
  people,
}: {
  num: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  badge: string;
  people: ApiCrew[];
}) {
  if (people.length === 0) return null;
  return (
    <section className="py-16 md:py-24 px-5">
      <div className="max-w-[1400px] mx-auto">
        <div className="mb-12 md:mb-16">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="section-num block mb-4">
            {num} &mdash; {eyebrow}
          </motion.span>
          <h2 className="font-display text-3xl md:text-5xl mb-4">
            <TextReveal>{title}</TextReveal>
          </h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="t-muted text-sm max-w-md font-mono">
            {subtitle}
          </motion.p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {people.map((p, i) => <TeamCard key={p.id} person={p} idx={i} badge={badge} />)}
        </div>
      </div>
    </section>
  );
}

export default function TeamPage() {
  const { data: team, loading, error } = usePublicList<ApiCrew>("/api/crew");

  const { promoters, members } = useMemo(() => {
    const promoters: ApiCrew[] = [];
    const members: ApiCrew[] = [];
    for (const p of team) {
      if (p.category === "PROMOTER") promoters.push(p);
      else members.push(p);
    }
    return { promoters, members };
  }, [team]);

  return (
    <div className="page-enter">
      <PageHero title="Our Team" subtitle="Meet the people pushing humanity's boundaries."
        image="https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=1400&q=80" label="The People Behind The Missions" />

      {loading && <div className="py-28 px-5"><LoadingBlock label="Loading team…" /></div>}
      {!loading && error && <div className="py-28 px-5"><ErrorBlock error={error} /></div>}
      {!loading && !error && team.length === 0 && (
        <div className="py-28 px-5">
          <EmptyBlock title="No team members yet" hint="Add promoters and team members from the admin panel to populate this page." />
        </div>
      )}

      <TeamSection
        num="01"
        eyebrow="Leadership"
        title="Promoters"
        subtitle="The founders and visionaries steering the mission forward."
        badge="Promoter"
        people={promoters}
      />

      <TeamSection
        num="02"
        eyebrow="The Crew"
        title="Our Team"
        subtitle="The engineers, scientists, and operators who make every launch possible."
        badge="Team"
        people={members}
      />
    </div>
  );
}
