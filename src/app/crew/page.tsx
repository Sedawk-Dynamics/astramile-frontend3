"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Rocket, Clock, Award } from "lucide-react";
import PageHero from "@/components/PageHero";

const crew = [
  { name: "Cmdr. Sarah Chen", role: "Mission Commander", missions: 5, exp: "15 years", bio: "Led three lunar missions. Holds the record for longest continuous station residency. Zero-gravity operations expert.", image: "https://images.unsplash.com/photo-1559548331-f9cb98001426?w=500&q=80" },
  { name: "Dr. Marcus Webb", role: "Flight Engineer", missions: 3, exp: "10 years", bio: "Propulsion specialist and orbital mechanics expert. Key contributor to next-gen rocket engine development.", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&q=80" },
  { name: "Lt. Aisha Patel", role: "Payload Specialist", missions: 4, exp: "12 years", bio: "Satellite deployment and station assembly expert. Over 200 hours of EVA across multiple mission profiles.", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=80" },
  { name: "Dr. James Kowalski", role: "Science Officer", missions: 2, exp: "8 years", bio: "Astrobiology researcher studying Mars habitability. Led breakthrough ISS experiments on microgravity biology.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80" },
  { name: "Capt. Elena Volkov", role: "Pilot", missions: 6, exp: "18 years", bio: "Veteran shuttle pilot. Orbital docking maneuver expert. Trained 50+ next-generation astronauts for deep space.", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&q=80" },
  { name: "Dr. Kenji Tanaka", role: "Medical Officer", missions: 3, exp: "11 years", bio: "Space medicine specialist for long-duration crew health. Pioneer in developing telemedicine protocols from orbit.", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&q=80" },
];

function CrewCard({ person, idx }: { person: typeof crew[0]; idx: number }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 45, filter: "blur(4px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true }} transition={{ delay: idx * 0.08, duration: 0.6 }}
      className="h-[460px] cursor-pointer [perspective:1200px] group" onClick={() => setFlipped(!flipped)}>
      <motion.div animate={{ rotateY: flipped ? 180 : 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full h-full [transform-style:preserve-3d]">

        {/* Front */}
        <div className="absolute inset-0 [backface-visibility:hidden] card overflow-hidden gradient-border">
          <div className="relative h-64 overflow-hidden img-zoom">
            <Image src={person.image} alt={person.name} fill className="object-cover object-top" sizes="33vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/20 to-transparent" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity overflow-hidden pointer-events-none">
              <div className="absolute left-0 right-0 h-px" style={{ background: "var(--accent)", opacity: 0.2, animation: "scan 3s linear infinite" }} />
            </div>
          </div>
          <div className="p-5 text-center">
            <h3 className="text-lg font-bold t-primary mb-0.5">{person.name}</h3>
            <p className="text-accent text-sm mb-4">{person.role}</p>
            <div className="flex justify-center gap-6 text-sm t-muted">
              <span className="flex items-center gap-1"><Rocket className="w-3.5 h-3.5 text-accent/40" />{person.missions} missions</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-teal/40" />{person.exp}</span>
            </div>
            <p className="text-[10px] t-faint mt-4">Click to read bio</p>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] card p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full overflow-hidden mb-4 border-2 border-accent/20">
            <Image src={person.image} alt={person.name} width={64} height={64} className="object-cover object-top w-full h-full" />
          </div>
          <h3 className="text-lg font-bold grad-text mb-1">{person.name}</h3>
          <p className="text-accent text-xs mb-4">{person.role}</p>
          <p className="t-secondary text-sm leading-relaxed mb-4">{person.bio}</p>
          <div className="flex items-center gap-1">
            {Array.from({ length: person.missions }).map((_, j) => (
              <Award key={j} className="w-3.5 h-3.5 text-accent/30" />
            ))}
          </div>
          <p className="text-[10px] t-faint mt-3">Click to flip back</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CrewPage() {
  return (
    <div className="page-enter">
      <PageHero title="Astronaut Crew" subtitle="Meet the brave explorers pushing humanity's boundaries."
        image="https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=1400&q=80" label="The Team" />

      <section className="py-28 px-5">
        <div className="max-w-[1400px] mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {crew.map((p, i) => <CrewCard key={p.name} person={p} idx={i} />)}
        </div>
      </section>
    </div>
  );
}
