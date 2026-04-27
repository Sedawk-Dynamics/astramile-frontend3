"use client";

import { useEffect, useState } from "react";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") ?? "http://localhost:4000";

/** Resolve a stored image URL. Absolute http(s) URLs are returned as-is; `/uploads/...` is prefixed with the API base. */
export function resolveImage(pathOrUrl: string | null | undefined): string | null {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  if (pathOrUrl.startsWith("/uploads/")) return `${API_BASE}${pathOrUrl}`;
  return pathOrUrl || null;
}

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return (await res.json()) as T;
}

/** Hook that fetches a list from the public API. Returns `[]` until the first response. */
export function usePublicList<T>(path: string): {
  data: T[];
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchJson<T[]>(path)
      .then((rows) => {
        if (!alive) return;
        setData(Array.isArray(rows) ? rows : []);
        setError(null);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e instanceof Error ? e.message : String(e));
        setData([]);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => { alive = false; };
  }, [path]);

  return { data, loading, error };
}

/** Hook that fetches a single object from the public API. */
export function usePublicSingle<T>(path: string): {
  data: T | null;
  loading: boolean;
  error: string | null;
} {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    fetchJson<T>(path)
      .then((row) => {
        if (!alive) return;
        setData(row ?? null);
        setError(null);
      })
      .catch((e) => {
        if (!alive) return;
        setError(e instanceof Error ? e.message : String(e));
        setData(null);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => { alive = false; };
  }, [path]);

  return { data, loading, error };
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let detail: unknown = undefined;
    try { detail = await res.json(); } catch { /* ignore */ }
    throw new Error(
      (detail && typeof detail === "object" && "error" in (detail as object) && String((detail as { error: unknown }).error))
      || `Request failed (${res.status})`,
    );
  }
  return (await res.json()) as T;
}

// ── Shared types ───────────────────────────────────────────────────────────

export type ApiRocket = {
  id: string; slug: string; name: string; tagline: string | null; description: string;
  heightM: number | null; weightKg: number | null; payloadKg: number | null;
  successRate: number | null; launches: number; features: string[]; image: string | null;
  order: number; isPublished: boolean;
};

export type ApiMission = {
  id: string; slug: string; name: string; summary: string; description: string;
  destination: string | null; status: "PLANNED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  startDate: string | null; endDate: string | null; image: string | null;
  order: number; isPublished: boolean;
  launches?: ApiLaunch[];
};

export type ApiCrew = {
  id: string; slug: string; name: string; role: string; bio: string;
  nationality: string | null; photo: string | null; order: number; isPublished: boolean;
};

export type ApiLaunch = {
  id: string; slug: string; name: string; description: string | null;
  scheduledAt: string; launchSite: string | null;
  status: "UPCOMING" | "LIVE" | "SUCCESS" | "FAILURE" | "SCRUBBED";
  streamUrl: string | null; image: string | null;
  rocketId: string | null; missionId: string | null;
  rocket?: ApiRocket | null; mission?: ApiMission | null;
  order: number; isPublished: boolean;
};

export type ApiNews = {
  id: string; slug: string; title: string; category: string; excerpt: string; body: string;
  coverImage: string | null; publishedAt: string; isPublished: boolean;
};

export type ApiBlog = {
  id: string; slug: string; title: string; category: string | null;
  excerpt: string; body: string;
  coverImage: string | null; videoUrl: string | null;
  author: string | null; tags: string[];
  publishedAt: string; isPublished: boolean;
};

/** Convert YouTube/Vimeo/direct video URLs to an embeddable form. Returns `null` if the URL isn't recognised as an embeddable video. */
export function toEmbedUrl(url: string | null | undefined): { kind: "iframe" | "video"; src: string } | null {
  if (!url) return null;
  // YouTube — handles watch?v=, youtu.be/, shorts/, embed/
  const yt = url.match(
    /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i,
  );
  if (yt) return { kind: "iframe", src: `https://www.youtube.com/embed/${yt[1]}` };
  // Vimeo
  const vimeo = url.match(/^(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/i);
  if (vimeo) return { kind: "iframe", src: `https://player.vimeo.com/video/${vimeo[1]}` };
  // Direct video file
  if (/\.(mp4|webm|ogg|mov)(\?|$)/i.test(url)) return { kind: "video", src: url };
  // Generic iframe for anything else that looks like a URL
  if (/^https?:\/\//i.test(url)) return { kind: "iframe", src: url };
  return null;
}

export type ApiGallery = {
  id: string; title: string; caption: string | null; image: string;
  category: string | null; order: number; isPublished: boolean;
};

export type ApiTech = {
  id: string; slug: string; title: string; description: string;
  icon: string | null; metric: string | null; metricLabel: string | null;
  image: string | null; order: number; isPublished: boolean;
};

export type ApiAbout = {
  headline: string; body: string; mission: string | null; vision: string | null;
  heroImage: string | null;
};
