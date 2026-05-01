"use client";

import { use } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, PlayCircle, User } from "lucide-react";
import { LoadingBlock, ErrorBlock, EmptyBlock } from "@/components/DataState";
import { ApiBlog, resolveImage, toEmbedUrl, usePublicList } from "@/lib/publicApi";

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

function VideoEmbed({ url, title }: { url: string; title: string }) {
  const embed = toEmbedUrl(url);
  if (!embed) return null;
  if (embed.kind === "video") {
    return (
      <video
        src={embed.src}
        controls
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover"
      />
    );
  }
  return (
    <iframe
      src={embed.src}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="absolute inset-0 w-full h-full"
      style={{ border: 0 }}
    />
  );
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: posts, loading, error } = usePublicList<ApiBlog>("/api/blog");
  const post = posts.find((p) => p.slug === slug);

  if (loading) {
    return <div className="page-enter py-28 px-5"><LoadingBlock label="Loading post…" /></div>;
  }
  if (error) {
    return <div className="page-enter py-28 px-5"><ErrorBlock error={error} /></div>;
  }
  if (!post) {
    return (
      <div className="page-enter py-28 px-5">
        <div className="max-w-2xl mx-auto">
          <EmptyBlock title="Post not found" hint="This blog post may have been unpublished or removed." />
          <div className="text-center mt-6">
            <Link href="/blog" className="btn btn-ice"><ArrowLeft className="w-3 h-3" /> Back to Blog</Link>
          </div>
        </div>
      </div>
    );
  }

  const cover = resolveImage(post.coverImage);
  const embed = toEmbedUrl(post.videoUrl);

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[420px] flex items-end overflow-hidden">
        {cover ? (
          <Image src={cover} alt={post.title} fill priority className="object-cover" sizes="100vw" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-card)] to-black" />
        )}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to top, var(--bg), color-mix(in srgb, var(--bg) 40%, transparent), color-mix(in srgb, var(--bg) 10%, transparent))",
        }} />
        <div className="aurora-bg absolute inset-0 opacity-40" />

        <div className="relative z-10 max-w-[1000px] mx-auto w-full px-5 md:px-8 pb-14">
          <Link href="/blog" className="inline-flex items-center gap-2 text-xs t-muted hover:t-primary uppercase tracking-[0.15em] font-mono mb-6 transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Blog
          </Link>
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            {post.category && (
              <span className="tag flex items-center gap-1">
                {embed && <PlayCircle className="w-3 h-3" />}
                {post.category}
              </span>
            )}
            <span className="text-xs t-muted flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {fmtDate(post.publishedAt)}
            </span>
            {post.author && (
              <span className="text-xs t-muted flex items-center gap-1">
                <User className="w-3 h-3" /> {post.author}
              </span>
            )}
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7 }}
            className="font-display text-3xl md:text-5xl tracking-tight">
            {post.title}
          </motion.h1>
          {post.excerpt && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="t-secondary text-lg md:text-xl max-w-2xl mt-4">
              {post.excerpt}
            </motion.p>
          )}
        </div>
      </section>

      {/* Body */}
      <section className="py-20 px-5">
        <div className="max-w-[760px] mx-auto">
          {embed && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative aspect-video mb-10 overflow-hidden rounded-sm gradient-border bg-black">
              <VideoEmbed url={post.videoUrl!} title={post.title} />
            </motion.div>
          )}

          {post.body ? (
            <article className="text-base md:text-[17px]">
              {renderBody(post.body)}
            </article>
          ) : (
            !embed && (
              <p className="t-muted text-sm font-mono text-center py-10">
                No additional content for this post yet.
              </p>
            )
          )}

          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-[var(--border)]">
              <p className="t-muted text-xs font-mono uppercase tracking-[0.2em] mb-3">Tags</p>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span key={t} className="tag text-[10px]">#{t}</span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16 text-center">
            <Link href="/blog" className="text-xs t-muted hover:t-primary uppercase tracking-[0.2em] font-mono inline-flex items-center gap-2 transition-colors">
              <ArrowLeft className="w-3 h-3" /> All posts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
