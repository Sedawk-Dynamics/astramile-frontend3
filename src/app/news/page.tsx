"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, ArrowUpRight } from "lucide-react";
import PageHero from "@/components/PageHero";

const articles = [
  { title: "Starship Completes First Orbital Flight", desc: "SpaceX's Starship successfully completed its first full orbital flight, marking a milestone in reusable heavy-lift rocket development. The vehicle reached orbit after a flawless ascent and performed a controlled deorbit burn.", date: "Mar 15, 2026", cat: "Milestone", image: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=800&q=80", featured: true },
  { title: "NASA Announces Mars Sample Return Timeline", desc: "NASA finalized plans for bringing Martian soil samples to Earth by 2033, representing the first round-trip mission to another planet.", date: "Mar 10, 2026", cat: "Mars", image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=500&q=80", featured: false },
  { title: "Lunar Gateway Module Launched Successfully", desc: "The latest habitation module for the Lunar Gateway was launched, expanding capacity for long-duration cislunar operations.", date: "Feb 28, 2026", cat: "Moon", image: "https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=500&q=80", featured: false },
  { title: "Breakthrough in Ion Propulsion Efficiency", desc: "Researchers achieve record thrust efficiency with new ion drive design, potentially halving travel time to Mars.", date: "Feb 20, 2026", cat: "Technology", image: "https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=500&q=80", featured: false },
  { title: "Private Spacewalk Sets Altitude Record", desc: "A commercial crew performed the first private EVA at 700 km, setting a new record for civilian space activity.", date: "Feb 15, 2026", cat: "Commercial", image: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=500&q=80", featured: false },
  { title: "Asteroid Mining Probe Reaches Target", desc: "Prospector-1 arrived at asteroid 2024-QR7, beginning spectroscopic analysis of platinum-group deposits.", date: "Feb 5, 2026", cat: "Mining", image: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=500&q=80", featured: false },
  { title: "New Space Telescope Reveals Hidden Galaxies", desc: "The Horizon telescope captured unprecedented images of galaxies hidden behind dust clouds in deep space.", date: "Jan 28, 2026", cat: "Discovery", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80", featured: false },
  { title: "SpaceX Raptor 3 Engine Achieves Full Thrust", desc: "The next-generation Raptor 3 engine completed its full-duration test firing, generating 280 tons of thrust.", date: "Jan 20, 2026", cat: "Technology", image: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=500&q=80", featured: false },
  { title: "India's Gaganyaan Crew Selection Complete", desc: "ISRO announced the final crew of four astronauts for India's first crewed space mission, launching in 2027.", date: "Jan 12, 2026", cat: "Crewed", image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&q=80", featured: false },
];

export default function NewsPage() {
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="page-enter">
      <PageHero title="Space News" subtitle="Latest developments in space exploration and technology."
        image="https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=1400&q=80" label="Updates" />

      <section className="py-28 px-5">
        <div className="max-w-[1400px] mx-auto">
          {/* Featured */}
          <motion.article initial={{ opacity: 0, y: 35, filter: "blur(4px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }}
            className="card overflow-hidden mb-10 group cursor-pointer gradient-border">
            <div className="grid md:grid-cols-2">
              <div className="relative h-64 md:h-auto min-h-[300px] overflow-hidden img-zoom">
                <Image src={featured.image} alt={featured.title} fill className="object-cover" sizes="50vw" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-bg/80 hidden md:block" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent md:hidden" />
              </div>
              <div className="p-8 md:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="tag">{featured.cat}</span>
                  <span className="text-xs t-muted flex items-center gap-1"><Calendar className="w-3 h-3" /> {featured.date}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold t-primary mb-3 group-hover:text-accent-light transition-colors">{featured.title}</h2>
                <p className="t-secondary leading-relaxed mb-6">{featured.desc}</p>
                <span className="inline-flex items-center gap-2 text-accent text-sm font-medium group-hover:gap-3 transition-all">
                  Read Article <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </motion.article>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {rest.map((a, i) => (
              <motion.article key={a.title} initial={{ opacity: 0, y: 35, filter: "blur(4px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="card overflow-hidden group cursor-pointer tilt-hover gradient-border">
                <div className="relative h-40 overflow-hidden img-zoom">
                  <Image src={a.image} alt={a.title} fill className="object-cover" sizes="25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
                  <span className="absolute top-3 left-3 tag text-[9px]">{a.cat}</span>
                </div>
                <div className="p-4">
                  <p className="text-[10px] t-faint flex items-center gap-1 mb-2"><Calendar className="w-2.5 h-2.5" /> {a.date}</p>
                  <h3 className="text-sm font-bold t-primary group-hover:text-accent-light transition-colors line-clamp-2 mb-2">{a.title}</h3>
                  <p className="t-muted text-xs line-clamp-2 mb-3">{a.desc}</p>
                  <span className="flex items-center gap-1 text-[11px] text-accent/60 group-hover:text-accent-light transition-colors">
                    Read More <ArrowUpRight className="w-3 h-3" />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
