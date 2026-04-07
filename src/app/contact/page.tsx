"use client";

import { useState, FormEvent } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, Mail, User, FileText, MessageSquare, MapPin, Phone, Clock } from "lucide-react";
import PageHero from "@/components/PageHero";

const info = [
  { icon: MapPin, label: "Headquarters", value: "Kennedy Space Center, FL 32899" },
  { icon: Phone, label: "Mission Control", value: "+1 (321) 867-5309" },
  { icon: Mail, label: "Email", value: "contact@astramile.space" },
  { icon: Clock, label: "Operations", value: "24/7 Mission Support" },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="page-enter">
      <PageHero title="Contact Us" subtitle="Reach out to Mission Control. We respond at lightspeed."
        image="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1400&q=80" label="Get In Touch" />

      <section className="py-28 px-5">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Info */}
            <div className="space-y-4">
              {info.map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="card p-4 flex items-center gap-4 gradient-border">
                  <div className="w-10 h-10 rounded-lg bg-accent/5 border border-accent/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-accent/60" />
                  </div>
                  <div>
                    <p className="text-[10px] t-faint uppercase tracking-wider">{item.label}</p>
                    <p className="text-sm t-primary">{item.value}</p>
                  </div>
                </motion.div>
              ))}

              {/* Map placeholder */}
              <motion.div initial={{ opacity: 0, y: 30, filter: "blur(4px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }}
                transition={{ delay: 0.4 }} className="relative h-48 rounded-xl overflow-hidden img-zoom">
                <Image src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80" alt="Earth from orbit" fill className="object-cover" sizes="33vw" />
                <div className="absolute inset-0 bg-bg/60 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="w-6 h-6 text-accent mx-auto mb-2" />
                    <p className="text-xs t-secondary">Cape Canaveral, FL</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, y: 35, filter: "blur(4px)" }} whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }} viewport={{ once: true }}
              className="lg:col-span-2 card p-6 md:p-8 gradient-border">
              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div key="ok" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="flex flex-col items-center py-20">
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
                      <CheckCircle className="w-16 h-16 text-accent mb-4" />
                    </motion.div>
                    <h3 className="text-2xl font-bold grad-text mb-2">Transmission Received</h3>
                    <p className="t-secondary text-sm">We&apos;ll respond within one orbit cycle.</p>
                  </motion.div>
                ) : (
                  <motion.form key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      {[
                        { id: "name", label: "Full Name", type: "text", Icon: User },
                        { id: "email", label: "Email Address", type: "email", Icon: Mail },
                      ].map((f) => (
                        <div key={f.id} className="relative">
                          <f.Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focused === f.id ? "text-accent" : "t-faint"}`} />
                          <input type={f.type} required placeholder={f.label}
                            onFocus={() => setFocused(f.id)} onBlur={() => setFocused(null)}
                            className="w-full pl-11 pr-4 py-3 bg-[var(--input-bg)] border border-[var(--border)] rounded-xl text-sm t-primary placeholder-[color:var(--text-faint)] focus:outline-none focus:border-accent/30 transition-all" />
                        </div>
                      ))}
                    </div>
                    <div className="relative">
                      <FileText className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${focused === "subj" ? "text-accent" : "t-faint"}`} />
                      <input type="text" required placeholder="Subject"
                        onFocus={() => setFocused("subj")} onBlur={() => setFocused(null)}
                        className="w-full pl-11 pr-4 py-3 bg-[var(--input-bg)] border border-[var(--border)] rounded-xl text-sm t-primary placeholder-[color:var(--text-faint)] focus:outline-none focus:border-accent/30 transition-all" />
                    </div>
                    <div className="relative">
                      <MessageSquare className={`absolute left-4 top-3.5 w-4 h-4 transition-colors ${focused === "msg" ? "text-accent" : "t-faint"}`} />
                      <textarea required rows={6} placeholder="Your message..."
                        onFocus={() => setFocused("msg")} onBlur={() => setFocused(null)}
                        className="w-full pl-11 pr-4 py-3 bg-[var(--input-bg)] border border-[var(--border)] rounded-xl text-sm t-primary placeholder-[color:var(--text-faint)] focus:outline-none focus:border-accent/30 transition-all resize-none" />
                    </div>
                    <button type="submit" className="btn btn-accent w-full justify-center !py-3.5">
                      <Send className="w-4 h-4" /> Transmit Message
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
