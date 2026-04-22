"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Briefcase, Globe, Award } from "lucide-react";
import PageHero from "@/components/PageHero";
import { LoadingBlock, EmptyBlock, ErrorBlock } from "@/components/DataState";
import { ApiCrew, resolveImage, usePublicList } from "@/lib/publicApi";

function TeamCard({ person, idx }: { person: ApiCrew; idx: number }) {
  const [flipped, setFlipped] = useState(false);
  const img = resolveImage(person.photo);

  return (
    <motion.div initial={{ opacity: 0, y: 45, filter: "blur(4px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }} transition={{ delay: idx * 0.08, duration: 0.6 }}
      className="h-[460px] cursor-pointer [perspective:1200px] group" onClick={() => setFlipped(!flipped)}>
      <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full h-full [transform-style:preserve-3d]">

        <div className="absolute inset-0 [backface-visibility:hidden] card overflow-hidden gradient-border">
          <div className={`relative h-64 overflow-hidden img-zoom ${!img ? "bg-[var(--surface)]" : ""}`}>
            {img && <Image src={img} alt={person.name} fill className="object-cover object-top" sizes="33vw" />}
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity overflow-hidden pointer-events-none">
              <div className="absolute left-0 right-0 h-px" style={{ background: "var(--accent)", opacity: 0.2, animation: "scan 3s linear infinite" }} />
            </div>
          </div>
          <div className="p-5 text-center">
            <h3 className="text-lg font-bold t-primary mb-0.5">{person.name}</h3>
            <p className="text-accent text-sm mb-4">{person.role}</p>
            <div className="flex justify-center gap-6 text-sm t-muted">
              <span className="flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-accent/40" />Team</span>
              {person.nationality && (
                <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5 text-teal/40" />{person.nationality}</span>
              )}
            </div>
            <p className="text-[10px] t-faint mt-4">Click to read bio</p>
          </div>
        </div>

        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] card p-6 flex flex-col items-center justify-center text-center">
          {img && (
            <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-accent/20">
              <Image src={img} alt={person.name} width={64} height={64} className="object-cover object-top w-full h-full" />
            </div>
          )}
          <h3 className="text-lg font-bold grad-text mb-1">{person.name}</h3>
          <p className="text-accent text-xs mb-4">{person.role}</p>
          <p className="t-secondary text-sm leading-relaxed mb-4">{person.bio}</p>
          <div className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-accent/30" />
            <Award className="w-3.5 h-3.5 text-accent/30" />
            <Award className="w-3.5 h-3.5 text-accent/30" />
          </div>
          <p className="text-[10px] t-faint mt-3">Click to flip back</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TeamPage() {
  const { data: team, loading, error } = usePublicList<ApiCrew>("/api/crew");

  return (
    <div className="page-enter">
      <PageHero title="Our Team" subtitle="Meet the people pushing humanity's boundaries."
        image="https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=1400&q=80" label="The People Behind The Missions" />

      <section className="py-28 px-5">
        {loading && <LoadingBlock label="Loading team…" />}
        {!loading && error && <ErrorBlock error={error} />}
        {!loading && !error && team.length === 0 && (
          <EmptyBlock title="No team members yet" hint="Add people from the admin panel to populate this page." />
        )}
        {team.length > 0 && (
          <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((p, i) => <TeamCard key={p.id} person={p} idx={i} />)}
          </div>
        )}
      </section>
    </div>
  );
}
