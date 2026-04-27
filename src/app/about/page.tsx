"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import PageHero from "@/components/PageHero";
import { LoadingBlock, EmptyBlock, ErrorBlock } from "@/components/DataState";
import { ApiAbout, resolveImage, usePublicSingle } from "@/lib/publicApi";

export default function AboutPage() {
  const { data: about, loading: loadingAbout, error: errorAbout } = usePublicSingle<ApiAbout>("/api/about");
  const heroImage = resolveImage(about?.heroImage);

  return (
    <div className="page-enter">
      <PageHero
        title="About AstraMile"
        subtitle="Pioneering the next frontier of human exploration."
        image={heroImage ?? "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1400&q=80"}
        label="Our Story"
      />

      {loadingAbout && <LoadingBlock label="Loading content…" />}
      {!loadingAbout && errorAbout && <ErrorBlock error={errorAbout} />}
      {!loadingAbout && !errorAbout && !about?.headline && !about?.body && (
        <EmptyBlock
          title="No About content yet"
          hint="Open the admin panel ▸ About page to write the headline, body, mission, and vision."
        />
      )}

      {about && (about.headline || about.body) && (
        <section className="py-28 px-5 section-line">
          <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="tag mb-4 inline-block">Our Mission</span>
              {about.headline && (
                <h2 className="text-3xl md:text-4xl font-bold t-primary mb-5 leading-snug">{about.headline}</h2>
              )}
              {about.body && <p className="t-secondary leading-relaxed mb-4">{about.body}</p>}
              {about.mission && <p className="t-muted leading-relaxed mb-4">{about.mission}</p>}
              {about.vision && <p className="t-muted leading-relaxed">{about.vision}</p>}
            </motion.div>

            {heroImage && (
              <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden gradient-border">
                <Image src={heroImage} alt="Hero" fill className="object-cover" sizes="50vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/50 to-transparent" />
              </motion.div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
