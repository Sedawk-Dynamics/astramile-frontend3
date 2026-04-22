"use client";

export function LoadingBlock({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="py-24 px-5 text-center">
      <div className="inline-flex items-center gap-3 t-muted text-sm font-mono">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ background: "var(--accent)", animation: "pulse 1.4s ease-in-out infinite" }}
        />
        {label}
      </div>
    </div>
  );
}

export function EmptyBlock({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="py-24 px-5 text-center">
      <p className="t-primary text-base font-semibold mb-2">{title}</p>
      {hint && <p className="t-muted text-sm font-mono max-w-md mx-auto">{hint}</p>}
    </div>
  );
}

export function ErrorBlock({ error }: { error: string }) {
  return (
    <div className="py-10 px-5">
      <div className="max-w-md mx-auto card p-5 text-center">
        <p className="t-primary font-semibold mb-1 text-sm">Could not load content</p>
        <p className="t-muted text-xs font-mono break-words">{error}</p>
      </div>
    </div>
  );
}
