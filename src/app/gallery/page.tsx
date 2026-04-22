"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";
import PageHero from "@/components/PageHero";
import { LoadingBlock, EmptyBlock, ErrorBlock } from "@/components/DataState";
import { ApiGallery, resolveImage, usePublicList } from "@/lib/publicApi";

const SPANS = ["", "md:col-span-2 md:row-span-2", "", "", "md:col-span-2", "", "", "md:col-span-2"];

export default function GalleryPage() {
  const { data: images, loading, error } = usePublicList<ApiGallery>("/api/gallery");

  const categories = useMemo(() => {
    const set = new Set<string>();
    images.forEach((i) => { if (i.category) set.add(i.category); });
    return ["All", ...Array.from(set)];
  }, [images]);

  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<number | null>(null);

  const filtered = filter === "All" ? images : images.filter((img) => img.category === filter);

  const nav = (dir: 1 | -1) => {
    if (selected === null) return;
    const currentItem = images[selected];
    const currentFilteredIndex = filtered.indexOf(currentItem);
    if (currentFilteredIndex === -1) return;
    const nextFilteredIndex = (currentFilteredIndex + dir + filtered.length) % filtered.length;
    setSelected(images.indexOf(filtered[nextFilteredIndex]));
  };

  return (
    <div className="page-enter">
      <PageHero title="Space Gallery" subtitle="Breathtaking imagery from missions and deep space observations."
        image="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&q=80" label="Visual Archive" />

      <section className="py-28 px-5">
        <div className="max-w-[1400px] mx-auto">
          {loading && <LoadingBlock label="Loading gallery…" />}
          {!loading && error && <ErrorBlock error={error} />}
          {!loading && !error && images.length === 0 && (
            <EmptyBlock title="No images yet" hint="Upload imagery in the admin panel to build the gallery." />
          )}

          {images.length > 0 && (
            <>
              {categories.length > 1 && (
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
              )}

              <motion.div layout className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[180px] md:auto-rows-[240px]">
                <AnimatePresence>
                  {filtered.map((img, i) => {
                    const span = SPANS[i % SPANS.length];
                    const src = resolveImage(img.image);
                    if (!src) return null;
                    return (
                      <motion.div key={img.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.4 }}
                        onClick={() => setSelected(images.indexOf(img))}
                        className={`relative rounded-xl overflow-hidden cursor-pointer group img-zoom ${span}`}>
                        <Image src={src} alt={img.title} fill className="object-cover" sizes="25vw" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity" />
                        <div className="absolute inset-0 flex flex-col justify-end p-3">
                          <p className="text-xs font-semibold t-primary transform translate-y-1 group-hover:translate-y-0 transition-transform">{img.title}</p>
                          {img.category && <p className="text-[10px] t-secondary">{img.category}</p>}
                        </div>
                        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all">
                          <ZoomIn className="w-3.5 h-3.5 t-primary" />
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selected !== null && images[selected] && (() => {
          const src = resolveImage(images[selected].image);
          if (!src) return null;
          return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
              onClick={() => setSelected(null)}>
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                className="relative max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
                <div className="relative aspect-video rounded-2xl overflow-hidden">
                  <Image src={src} alt={images[selected].title} fill className="object-cover" sizes="90vw" />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-bold t-primary">{images[selected].title}</h3>
                  {images[selected].category && <p className="text-xs t-secondary">{images[selected].category}</p>}
                  {images[selected].caption && <p className="text-sm t-muted mt-2">{images[selected].caption}</p>}
                </div>
                <button onClick={(e) => { e.stopPropagation(); nav(-1); }} className="absolute left-0 top-1/3 -translate-x-12 w-9 h-9 rounded-full glass flex items-center justify-center t-primary hover:text-accent-light"><ChevronLeft className="w-4 h-4" /></button>
                <button onClick={(e) => { e.stopPropagation(); nav(1); }} className="absolute right-0 top-1/3 translate-x-12 w-9 h-9 rounded-full glass flex items-center justify-center t-primary hover:text-accent-light"><ChevronRight className="w-4 h-4" /></button>
                <button onClick={() => setSelected(null)} className="absolute -top-10 right-0 w-9 h-9 rounded-full glass flex items-center justify-center t-primary hover:text-accent-light"><X className="w-4 h-4" /></button>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}
