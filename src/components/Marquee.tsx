"use client";

export default function Marquee({
  items,
  speed = 30,
  className = "",
}: {
  items: string[];
  speed?: number;
  className?: string;
}) {
  const content = items.join(" \u00B7 ") + " \u00B7 ";

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="inline-flex animate-marquee py-4" style={{ animationDuration: `${speed}s` }}>
        <span className="font-display text-[2.5rem] md:text-[4rem] opacity-[0.06] uppercase tracking-wider select-none">
          {content}
        </span>
        <span className="font-display text-[2.5rem] md:text-[4rem] opacity-[0.06] uppercase tracking-wider select-none">
          {content}
        </span>
      </div>
    </div>
  );
}
