"use client";

import { useEffect, useRef } from "react";

export default function CursorFollower() {
  const rocketRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const el = rocketRef.current;
    if (!el) return;

    const move = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };

    const hide = () => { if (el) el.style.opacity = "0"; };
    const show = () => { if (el) el.style.opacity = "1"; };

    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.15;
      pos.current.y += (target.current.y - pos.current.y) * 0.15;
      if (el) {
        el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      raf.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", hide);
    document.addEventListener("mouseenter", show);
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", hide);
      document.removeEventListener("mouseenter", show);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
    return null;
  }

  return (
    <div
      ref={rocketRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{ opacity: 0, willChange: "transform" }}
    >
      {/* Rocket tilted like a cursor arrow — nose points top-left */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 32 36"
        fill="none"
        style={{
          transform: "rotate(-45deg)",
          filter: "drop-shadow(0 0 5px rgba(125,180,224,0.5))",
        }}
      >
        {/* Rocket body */}
        <path
          d="M16 2 C16 2 10 10 10 20 L13 22 L16 24 L19 22 L22 20 C22 10 16 2 16 2Z"
          fill="rgba(220,220,230,0.9)"
          stroke="rgba(125,180,224,0.6)"
          strokeWidth="0.5"
        />
        {/* Nose cone */}
        <path
          d="M16 2 C14 6 13 10 12.5 13 L16 4 L19.5 13 C19 10 18 6 16 2Z"
          fill="rgba(125,180,224,0.7)"
        />
        {/* Window */}
        <circle cx="16" cy="13" r="1.8" fill="rgba(125,180,224,0.4)" stroke="rgba(125,180,224,0.7)" strokeWidth="0.5" />
        {/* Left fin */}
        <path d="M10 20 L6 26 L10 23Z" fill="rgba(196,154,108,0.8)" />
        {/* Right fin */}
        <path d="M22 20 L26 26 L22 23Z" fill="rgba(196,154,108,0.8)" />
        {/* Flame outer glow */}
        <ellipse cx="16" cy="27" rx="3" ry="4" fill="#c49a6c" opacity="0.35">
          <animate attributeName="ry" values="4;5;4" dur="0.3s" repeatCount="indefinite" />
        </ellipse>
        {/* Flame outer */}
        <path d="M13 24 L16 31 L19 24Z" fill="#c49a6c">
          <animate attributeName="d" values="M13 24 L16 31 L19 24Z;M13 24 L16 32 L19 24Z;M13 24 L16 31 L19 24Z" dur="0.3s" repeatCount="indefinite" />
        </path>
        {/* Flame inner */}
        <path d="M14.5 24 L16 29 L17.5 24Z" fill="#7db4e0">
          <animate attributeName="d" values="M14.5 24 L16 29 L17.5 24Z;M14.5 24 L16 30 L17.5 24Z;M14.5 24 L16 29 L17.5 24Z" dur="0.2s" repeatCount="indefinite" />
        </path>
      </svg>
    </div>
  );
}
