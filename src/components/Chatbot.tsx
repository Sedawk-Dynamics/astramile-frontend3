"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, X, Send, Loader2 } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const INITIAL_GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi! I'm AstraBot 🚀 — your guide to AstraMile. Ask me about our rockets, technology, team, or how to get in touch. How can I help you today?",
};

const SUGGESTIONS = [
  "What does AstraMile do?",
  "Tell me about the Rudra rockets",
  "Where is AstraMile located?",
  "How do I contact you?",
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_GREETING]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, busy]);

  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => inputRef.current?.focus(), 350);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;

    const next: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error(detail?.error || `Request failed (${res.status})`);
      }
      const data = (await res.json()) as { reply?: string };
      const reply = (data.reply ?? "").trim();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: reply || "Sorry, I couldn't generate a response. Please try again.",
        },
      ]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong.";
      setError(msg);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm having trouble reaching mission control right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      {/* Floating Rocket Button */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="chatbot-fab"
            type="button"
            aria-label="Open AstraMile chatbot"
            onClick={() => setOpen(true)}
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -8, 0],
            }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            transition={{
              opacity: { duration: 0.4 },
              scale: { duration: 0.4, type: "spring", stiffness: 220, damping: 18 },
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-[60] w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center group"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--accent) 90%, transparent), color-mix(in srgb, var(--accent-warm) 80%, transparent))",
              border: "1px solid color-mix(in srgb, var(--accent) 50%, transparent)",
              boxShadow:
                "0 12px 36px -8px color-mix(in srgb, var(--accent) 55%, transparent), 0 0 0 1px rgba(255,255,255,0.04) inset",
            }}
          >
            {/* Pulse rings */}
            <span
              aria-hidden
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: "color-mix(in srgb, var(--accent) 25%, transparent)", animationDuration: "2.4s" }}
            />
            <span
              aria-hidden
              className="absolute -inset-1 rounded-full opacity-60 blur-md"
              style={{ background: "color-mix(in srgb, var(--accent) 35%, transparent)" }}
            />

            {/* Trail */}
            <motion.span
              aria-hidden
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 rounded-full"
              animate={{ height: [6, 14, 6], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              style={{
                background:
                  "linear-gradient(to bottom, color-mix(in srgb, var(--accent-warm) 90%, transparent), transparent)",
              }}
            />

            <Rocket
              className="w-6 h-6 sm:w-7 sm:h-7 text-white relative z-10 -rotate-45 drop-shadow"
              strokeWidth={2}
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chatbot-panel"
            initial={{ opacity: 0, y: 30, scale: 0.85, transformOrigin: "bottom right" }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.85 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] w-[calc(100vw-2rem)] sm:w-[400px] max-w-[400px] h-[min(620px,calc(100vh-2rem))] rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(28px) saturate(160%)",
              WebkitBackdropFilter: "blur(28px) saturate(160%)",
              border: "1px solid var(--border-hover)",
              boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03) inset",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{
                borderColor: "var(--border)",
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--accent) 14%, transparent), color-mix(in srgb, var(--accent-warm) 8%, transparent))",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), var(--accent-warm))",
                  }}
                >
                  <Rocket className="w-4 h-4 text-white -rotate-45" strokeWidth={2.2} />
                </div>
                <div>
                  <p className="text-sm font-semibold t-primary leading-tight">AstraBot</p>
                  <p className="text-[10px] t-faint uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Mission Control · Online
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close chatbot"
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-[var(--surface-hover)]"
              >
                <X className="w-4 h-4 t-secondary" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
              style={{ scrollbarWidth: "thin" }}
            >
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === "user" ? "rounded-br-md" : "rounded-bl-md"
                    }`}
                    style={
                      m.role === "user"
                        ? {
                            background:
                              "linear-gradient(135deg, color-mix(in srgb, var(--accent) 80%, transparent), color-mix(in srgb, var(--accent-warm) 70%, transparent))",
                            color: "#fff",
                          }
                        : {
                            background: "var(--surface)",
                            border: "1px solid var(--border)",
                            color: "var(--text-secondary)",
                          }
                    }
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}

              {busy && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div
                    className="rounded-2xl rounded-bl-md px-3.5 py-2.5 flex items-center gap-2"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <span className="flex gap-1">
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-accent"
                        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: 0 }}
                      />
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-accent"
                        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: 0.15 }}
                      />
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full bg-accent"
                        animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: 0.3 }}
                      />
                    </span>
                  </div>
                </motion.div>
              )}

              {!busy && messages.length === 1 && (
                <div className="pt-2">
                  <p className="text-[10px] uppercase tracking-wider t-faint mb-2 px-1">
                    Suggested
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => send(s)}
                        className="text-xs rounded-full px-3 py-1.5 transition-colors"
                        style={{
                          background: "var(--surface)",
                          border: "1px solid var(--border)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <p className="text-[11px] text-red-400 px-1">{error}</p>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={onSubmit}
              className="px-3 pt-2 pb-2 border-t"
              style={{ borderColor: "var(--border)" }}
            >
              <div
                className="flex items-center gap-2 rounded-full pl-4 pr-1.5 py-1.5"
                style={{
                  background: "var(--input-bg)",
                  border: "1px solid var(--border)",
                }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about AstraMile…"
                  disabled={busy}
                  className="flex-1 bg-transparent text-sm t-primary placeholder-[color:var(--text-faint)] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={busy || !input.trim()}
                  aria-label="Send"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent), var(--accent-warm))",
                  }}
                >
                  {busy ? (
                    <Loader2 className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 text-white" />
                  )}
                </button>
              </div>
            </form>

            {/* Social */}
            <div
              className="px-4 py-3 flex items-center justify-between border-t"
              style={{
                borderColor: "var(--border)",
                background: "color-mix(in srgb, var(--bg-alt) 60%, transparent)",
              }}
            >
              <p className="text-[10px] uppercase tracking-wider t-faint">Follow us</p>
              <div className="flex items-center gap-2">
                <a
                  href="https://www.instagram.com/astramile"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/astramile"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.99 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.99 22 12z" />
                  </svg>
                </a>
                <a
                  href="https://x.com/astramile"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X (Twitter)"
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="w-3.5 h-3.5"
                    fill="currentColor"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
