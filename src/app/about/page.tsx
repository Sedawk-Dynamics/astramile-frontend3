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

      <section className="relative py-24 sm:py-28 md:py-32 px-4 sm:px-5 overflow-hidden section-line">
        <div className="aurora-bg opacity-20" />
        <div className="relative z-10 max-w-[1100px] mx-auto">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="section-num block mb-4"
          >
            Who We Are
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-display text-3xl sm:text-4xl md:text-5xl mb-10 leading-tight"
          >
            India&apos;s First Full-Stack Private Orbital Launch Company
          </motion.h2>

          <div className="space-y-7 t-secondary text-base md:text-lg leading-relaxed">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8 }}
            >
              Astramile Aerospace Private Limited is India&apos;s first full-stack private orbital launch company, building a complete ecosystem of liquid propellant rockets and satellites from a 100-acre integrated campus in Hyderabad. Founded in December 2025 by a team of ex-ISRO/DRDO veterans and defence professionals, Astramile is developing the Rudra series of all-liquid LOX/RP-1 rockets — from small satellite launchers to heavy-lift and lunar mission vehicles — powered by a single scalable 10-ton engine platform. Our mission: to make India a global leader in affordable, reliable, and reusable orbital access.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              Born from decades of collective experience at the Indian Space Research Organisation (ISRO), the Defence Research and Development Organisation (DRDO), and India&apos;s premier defence and missile programmes, Astramile combines institutional aerospace pedigree with the speed and ambition of a new-space company. Our founding team has shipped, tested, and qualified propulsion, avionics, and structural systems on flight-grade vehicles — and we are channelling that experience into a vertically integrated organisation where rockets, satellites, ground systems, and launch operations are designed, built, and qualified under one roof.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              The Rudra family — RUDRA, RUDRAX, and MAHARUDRA — is engineered around a single scalable 10-tonne-class LOX/RP-1 engine platform. By clustering and optimising this common engine across vehicle classes, we drastically reduce development cost, qualification time, and supply-chain complexity, enabling responsive launches for small satellites today and heavy-lift, lunar, and reusable missions tomorrow. Every stage is designed with reusability in mind from day one, because driving down the cost-per-kilogram to orbit is non-negotiable for the next orbital economy.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Our 100-acre integrated campus in Hyderabad houses propulsion test stands, vehicle assembly bays, satellite cleanrooms, mission control, and R&amp;D laboratories — all interconnected to compress the design–build–test cycle that typically slows aerospace development. Astramile exists for one reason: to make affordable, reliable, and reusable orbital access an Indian capability — democratising space for commercial, scientific, and strategic missions, and putting India at the forefront of the next era of human exploration.
            </motion.p>
          </div>
        </div>
      </section>

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
