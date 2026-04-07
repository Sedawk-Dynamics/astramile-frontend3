"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import PageHero from "@/components/PageHero";

const categories = ["All", "Rockets", "Planets", "Astronauts", "Stations", "Deep Space"];

const images = [
  { src: "https://images.unsplash.com/photo-1457364559154-aa2644600ebb?w=800&q=80", title: "Rocket Launch at Sunset", cat: "Rockets", span: "md:col-span-2 md:row-span-2" },
  { src: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=600&q=80", title: "International Space Station", cat: "Stations", span: "" },
  { src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80", title: "Earth from Orbit", cat: "Planets", span: "" },
  { src: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?w=600&q=80", title: "Astronaut in Deep Space", cat: "Astronauts", span: "" },
  { src: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=600&q=80", title: "Mars Surface Panorama", cat: "Planets", span: "" },
  { src: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=600&q=80", title: "Satellite Deployment", cat: "Stations", span: "" },
  { src: "https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=800&q=80", title: "Nebula Deep Field", cat: "Deep Space", span: "md:col-span-2" },
  { src: "https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?w=600&q=80", title: "Lunar Surface", cat: "Planets", span: "" },
  { src: "https://images.unsplash.com/photo-1517976487492-5750f3195933?w=600&q=80", title: "Rocket Engine Test Fire", cat: "Rockets", span: "" },
  { src: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?w=600&q=80", title: "Starship on Pad", cat: "Rockets", span: "" },
  { src: "https://images.unsplash.com/photo-1506443432602-ac2fcd6f54e0?w=600&q=80", title: "Solar Corona", cat: "Deep Space", span: "" },
  { src: "https://images.unsplash.com/photo-1559548331-f9cb98001426?w=600&q=80", title: "Spacewalk EVA", cat: "Astronauts", span: "md:col-span-2" },
  { src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&q=80", title: "Mission Commander Portrait", cat: "Astronauts", span: "" },
  { src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=600&q=80", title: "Payload Specialist", cat: "Astronauts", span: "" },
];

export default function GalleryPage() {
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<number | null>(null);
  const filtered = filter === "All" ? images : images.filter((img) => img.cat === filter);

  const nav = (dir: 1 | -1) => {
    if (selected === null) return;
    const currentFiltered = filtered;
    const currentItem = images[selected];
    const currentFilteredIndex = currentFiltered.indexOf(currentItem);
    const nextFilteredIndex = (currentFilteredIndex + dir + currentFiltered.length) % currentFiltered.length;
    setSelected(images.indexOf(currentFiltered[nextFilteredIndex]));
  };

  return (
    <div className="page-enter">
      <PageHero title="Space Gallery" subtitle="Breathtaking imagery from missions and deep space observations."
        image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&q=80" label="Visual Archive" />

      <section className="py-28 px-5">
        <div className="max-w-[1400px] mx-auto">
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-10">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  filter === cat
                    ? "text-black font-semibold"
                    : "bg-[var(--surface)] border border-[var(--border)] t-secondary hover:t-primary hover:border-[var(--border-hover)]"
                }`}
                style={filter === cat ? { background: "linear-gradient(135deg, var(--accent), var(--accent-warm))" } : {}}>
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <motion.div layout className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[180px] md:auto-rows-[240px]">
            <AnimatePresence>
              {filtered.map((img) => (
                <motion.div key={img.src} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }}
                  onClick={() => setSelected(images.indexOf(img))}
                  className={`relative rounded-xl overflow-hidden cursor-pointer group img-zoom ${img.span}`}>
                  <Image src={img.src} alt={img.title} fill className="object-cover" sizes="25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute inset-0 flex flex-col justify-end p-3">
                    <p className="text-xs font-semibold t-primary transform translate-y-1 group-hover:translate-y-0 transition-transform">{img.title}</p>
                    <p className="text-[10px] t-secondary">{img.cat}</p>
                  </div>
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all">
                    <ZoomIn className="w-3.5 h-3.5 t-primary" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
            onClick={() => setSelected(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
              <div className="relative aspect-video rounded-2xl overflow-hidden">
                <Image src={images[selected].src} alt={images[selected].title} fill className="object-cover" sizes="90vw" />
              </div>
              <div className="mt-4 text-center">
                <h3 className="text-lg font-bold t-primary">{images[selected].title}</h3>
                <p className="text-xs t-secondary">{images[selected].cat}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); nav(-1); }} className="absolute left-0 top-1/3 -translate-x-12 w-9 h-9 rounded-full glass flex items-center justify-center t-primary hover:text-accent-light"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={(e) => { e.stopPropagation(); nav(1); }} className="absolute right-0 top-1/3 translate-x-12 w-9 h-9 rounded-full glass flex items-center justify-center t-primary hover:text-accent-light"><ChevronRight className="w-4 h-4" /></button>
              <button onClick={() => setSelected(null)} className="absolute -top-10 right-0 w-9 h-9 rounded-full glass flex items-center justify-center t-primary hover:text-accent-light"><X className="w-4 h-4" /></button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
