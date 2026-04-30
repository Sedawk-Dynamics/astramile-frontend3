"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, ArrowLeft, ExternalLink } from "lucide-react";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "@/components/DataState";
import { ApiNews, resolveImage, usePublicList } from "@/lib/publicApi";

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function renderBody(body: string) {
  return body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0)
    .map((p, i) => (
      <p key={i} className="t-secondary leading-relaxed mb-5 whitespace-pre-line">
        {p}
      </p>
    ));
}

export default function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: articles, loading, error } = usePublicList<ApiNews>("/api/news");
  const article = articles.find((a) => a.slug === slug);

  if (loading) {
    return <div className="page-enter"><LoadingBlock label="Loading article…" /></div>;
  }
  if (error) {
    return <div className="page-enter"><ErrorBlock error={error} /></div>;
  }
  if (!article) {
    return (
      <div className="page-enter py-28 px-5">
        <div className="max-w-2xl mx-auto">
          <EmptyBlock title="Article not found" hint="The article you're looking for may have been unpublished or removed." />
          <div className="text-center mt-6">
            <Link href="/news" className="btn btn-ice"><ArrowLeft className="w-3 h-3" /> Back to News</Link>
          </div>
        </div>
      </div>
    );
  }

  const cover = resolveImage(article.coverImage);
  const inline = resolveImage(article.articleImage);
  const hasExternal = !!article.newsLink && article.newsLink.trim().length > 0;

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] flex items-end overflow-hidden">
        {cover ? (
          <Image src={cover} alt={article.title} fill priority className="object-cover" sizes="100vw" />
        ) : (
          <div className="absolute inset-0 bg-[var(--surface)]" />
        )}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to top, var(--bg), color-mix(in srgb, var(--bg) 40%, transparent), color-mix(in srgb, var(--bg) 10%, transparent))",
        }} />
        <div className="aurora-bg absolute inset-0 opacity-40" />

        <div className="relative z-10 max-w-[1000px] mx-auto w-full px-5 md:px-8 pb-14">
          <Link href="/news" className="inline-flex items-center gap-2 text-xs t-muted hover:t-primary uppercase tracking-[0.15em] font-mono mb-6 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to News
          </Link>
          <div className="flex items-center gap-3 mb-5">
            <span className="tag">{article.category}</span>
            <span className="text-xs t-muted flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {fmtDate(article.publishedAt)}
            </span>
          </div>
          <motion.h1 initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7 }}
            className="font-display text-3xl md:text-5xl tracking-tight">
            {article.title}
          </motion.h1>
          {article.excerpt && (
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="t-secondary text-lg md:text-xl max-w-2xl mt-4">
              {article.excerpt}
            </motion.p>
          )}
        </div>
      </section>

      {/* Body */}
      <section className="py-20 px-5">
        <div className="max-w-[760px] mx-auto">
          {inline && (
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="relative aspect-[16/9] mb-10 overflow-hidden rounded-lg gradient-border">
              <Image src={inline} alt={article.title} fill className="object-cover" sizes="(max-width: 760px) 100vw, 760px" />
            </motion.div>
          )}

          {article.body ? (
            <article className="text-base md:text-[17px]">
              {renderBody(article.body)}
            </article>
          ) : (
            !inline && !hasExternal && (
              <p className="t-muted text-sm font-mono text-center py-10">
                No additional content for this article yet.
              </p>
            )
          )}

          {hasExternal && (
            <div className="mt-12 pt-8 border-t border-[var(--border)] text-center">
              <p className="t-muted text-xs font-mono uppercase tracking-[0.15em] mb-4">Source</p>
              <a href={article.newsLink!} target="_blank" rel="noopener noreferrer"
                className="btn btn-accent">
                Read original article <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          <div className="mt-16 text-center">
            <Link href="/news" className="text-xs t-muted hover:t-primary uppercase tracking-[0.15em] font-mono inline-flex items-center gap-2 transition-colors">
              <ArrowLeft className="w-3 h-3" /> All news
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
