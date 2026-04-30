"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowRight, ArrowUpRight, ExternalLink } from "lucide-react";
import PageHero from "@/components/PageHero";
import { LoadingBlock, EmptyBlock, ErrorBlock } from "@/components/DataState";
import { ApiNews, resolveImage, usePublicList } from "@/lib/publicApi";

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

type LinkProps = {
  href: string;
  external: boolean;
  className?: string;
  children: React.ReactNode;
};

function ArticleLink({ href, external, className, children }: LinkProps) {
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function articleHref(a: ApiNews): { href: string; external: boolean } {
  if (a.newsLink && a.newsLink.trim().length > 0) {
    return { href: a.newsLink, external: true };
  }
  return { href: `/news/${a.slug}`, external: false };
}

export default function NewsPage() {
  const { data: articles, loading, error } = usePublicList<ApiNews>("/api/news");
  const featured = articles[0];
  const rest = articles.slice(1);

  return (
    <div className="page-enter">
      <PageHero title="Space News" subtitle="Latest developments in space exploration and technology."
        image="https://images.unsplash.com/photo-1462332420958-a05d1e002413?w=1400&q=80" label="Updates" />

      <section className="py-28 px-5">
        <div className="max-w-[1400px] mx-auto">
          {loading && <LoadingBlock label="Loading articles…" />}
          {!loading && error && <ErrorBlock error={error} />}
          {!loading && !error && articles.length === 0 && (
            <EmptyBlock title="No articles yet" hint="Publish articles from the admin panel to see them here." />
          )}

          {featured && (() => {
            const cover = resolveImage(featured.coverImage);
            const { href, external } = articleHref(featured);
            return (
              <motion.div initial={{ opacity: 0, y: 35, filter: "blur(4px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }}>
                <ArticleLink href={href} external={external} className="block">
                  <article className="card overflow-hidden mb-10 group cursor-pointer gradient-border">
                    <div className="grid md:grid-cols-2">
                      <div className={`relative h-64 md:h-auto min-h-[300px] overflow-hidden img-zoom ${!cover ? "bg-[var(--surface)]" : ""}`}>
                        {cover && <Image src={cover} alt={featured.title} fill className="object-cover" sizes="50vw" />}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-bg/80 hidden md:block" />
                        <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent md:hidden" />
                      </div>
                      <div className="p-8 md:p-10 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="tag">{featured.category}</span>
                          <span className="text-xs t-muted flex items-center gap-1"><Calendar className="w-3 h-3" /> {fmtDate(featured.publishedAt)}</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold t-primary mb-3 group-hover:text-accent-light transition-colors">{featured.title}</h2>
                        {featured.excerpt && <p className="t-secondary leading-relaxed mb-6">{featured.excerpt}</p>}
                        <span className="inline-flex items-center gap-2 text-accent text-sm font-medium group-hover:gap-3 transition-all">
                          {external ? <>Read Original <ExternalLink className="w-4 h-4" /></> : <>Read Article <ArrowRight className="w-4 h-4" /></>}
                        </span>
                      </div>
                    </div>
                  </article>
                </ArticleLink>
              </motion.div>
            );
          })()}

          {rest.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {rest.map((a, i) => {
                const img = resolveImage(a.coverImage);
                const { href, external } = articleHref(a);
                return (
                  <motion.div key={a.id} initial={{ opacity: 0, y: 35, filter: "blur(4px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
                    <ArticleLink href={href} external={external} className="block h-full">
                      <article className="card overflow-hidden group cursor-pointer tilt-hover gradient-border h-full">
                        <div className={`relative h-40 overflow-hidden img-zoom ${!img ? "bg-[var(--surface)]" : ""}`}>
                          {img && <Image src={img} alt={a.title} fill className="object-cover" sizes="25vw" />}
                          <div className="absolute inset-0 bg-gradient-to-t from-bg to-transparent" />
                          <span className="absolute top-3 left-3 tag text-[9px]">{a.category}</span>
                        </div>
                        <div className="p-4">
                          <p className="text-[10px] t-faint flex items-center gap-1 mb-2"><Calendar className="w-2.5 h-2.5" /> {fmtDate(a.publishedAt)}</p>
                          <h3 className="text-sm font-bold t-primary group-hover:text-accent-light transition-colors line-clamp-2 mb-2">{a.title}</h3>
                          {a.excerpt && <p className="t-muted text-xs line-clamp-2 mb-3">{a.excerpt}</p>}
                          <span className="flex items-center gap-1 text-[11px] text-accent/60 group-hover:text-accent-light transition-colors">
                            {external ? <>Read Original <ExternalLink className="w-3 h-3" /></> : <>Read More <ArrowUpRight className="w-3 h-3" /></>}
                          </span>
                        </div>
                      </article>
                    </ArticleLink>
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
