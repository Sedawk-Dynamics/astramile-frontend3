"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, PlayCircle, User } from "lucide-react";
import PageHero from "@/components/PageHero";
import { LoadingBlock, EmptyBlock, ErrorBlock } from "@/components/DataState";
import { ApiBlog, resolveImage, toEmbedUrl, usePublicList } from "@/lib/publicApi";

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function BlogPage() {
  const { data: posts, loading, error } = usePublicList<ApiBlog>("/api/blog");

  return (
    <div className="page-enter">
      <PageHero
        title="Blog"
        subtitle="Deep dives, behind-the-scenes video, and field notes from our engineers and crew."
        image="https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=1400&q=80"
        label="Stories & Videos"
      />

      <section className="py-28 px-5">
        <div className="max-w-[1400px] mx-auto">
          {loading && <LoadingBlock label="Loading blog…" />}
          {!loading && error && <ErrorBlock error={error} />}
          {!loading && !error && posts.length === 0 && (
            <EmptyBlock title="No blog posts yet" hint="Publish posts from the admin panel to see them here." />
          )}

          {posts.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((p, i) => {
                const embed = toEmbedUrl(p.videoUrl);
                const cover = resolveImage(p.coverImage);
                return (
                  <Link key={p.id} href={`/blog/${p.slug}`} className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 rounded-sm">
                    <motion.article
                      initial={{ opacity: 0, y: 45, filter: "blur(4px)" }}
                      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      whileHover={{ y: -6 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="card overflow-hidden gradient-border flex flex-col h-full cursor-pointer">

                      <div className={`relative aspect-video overflow-hidden img-zoom ${!cover ? "bg-black" : ""}`}>
                        {cover ? (
                          <Image src={cover} alt={p.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-card)] to-black" />
                        )}

                        {embed && (
                          <div className={`absolute inset-0 flex items-center justify-center ${cover ? "bg-black/40" : ""} transition-all duration-300 group-hover:bg-black/30`}>
                            <PlayCircle className="w-16 h-16 text-white/90 drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)] group-hover:scale-110 group-hover:text-accent-light transition-all duration-300" strokeWidth={1.2} />
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent pointer-events-none" />
                      </div>

                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-center gap-2 flex-wrap mb-3">
                          {p.category && (
                            <span className="tag text-[10px] uppercase tracking-wider flex items-center gap-1">
                              {embed && <PlayCircle className="w-3 h-3" />}
                              {p.category}
                            </span>
                          )}
                          <span className="text-[10px] t-faint flex items-center gap-1">
                            <Calendar className="w-2.5 h-2.5" /> {fmtDate(p.publishedAt)}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold t-primary mb-2 group-hover:text-accent-light transition-colors line-clamp-2">
                          {p.title}
                        </h3>
                        <p className="t-muted text-sm leading-relaxed line-clamp-3 flex-1">{p.excerpt}</p>

                        <div className="mt-5 pt-4 border-t border-[var(--border)] flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            {p.author && (
                              <span className="flex items-center gap-1.5 text-[11px] t-muted">
                                <User className="w-3 h-3 text-accent/50" /> {p.author}
                              </span>
                            )}
                            {p.tags.length > 0 && (
                              <div className="flex gap-1 flex-wrap">
                                {p.tags.slice(0, 2).map((t) => (
                                  <span key={t} className="text-[9px] t-faint font-mono">#{t}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <span className="text-[10px] t-muted group-hover:text-accent transition-colors uppercase tracking-[0.18em] inline-flex items-center gap-1.5 whitespace-nowrap">
                            Read <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </motion.article>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
