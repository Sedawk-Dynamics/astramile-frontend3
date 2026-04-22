"use client";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") ?? "http://localhost:4000";

const TOKEN_KEY = "astramile.admin.token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  details: unknown;
  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

async function request<T>(
  path: string,
  options: RequestInit & { json?: unknown; skipAuth?: boolean } = {},
): Promise<T> {
  const { json, skipAuth, headers, ...init } = options;
  const h: Record<string, string> = { ...(headers as Record<string, string>) };
  if (json !== undefined) h["Content-Type"] = "application/json";
  if (!skipAuth) {
    const token = getToken();
    if (token) h["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: h,
    body: json !== undefined ? JSON.stringify(json) : init.body,
  });

  if (res.status === 204) return undefined as T;

  const contentType = res.headers.get("content-type") ?? "";
  const data = contentType.includes("application/json") ? await res.json() : await res.text();

  if (!res.ok) {
    const message =
      (typeof data === "object" && data && "error" in data && String((data as Record<string, unknown>).error)) ||
      `Request failed (${res.status})`;
    throw new ApiError(message, res.status, data);
  }
  return data as T;
}

export const api = {
  get: <T = unknown>(path: string, opts?: RequestInit) => request<T>(path, { ...opts, method: "GET" }),
  post: <T = unknown>(path: string, json?: unknown, opts?: RequestInit) =>
    request<T>(path, { ...opts, method: "POST", json }),
  patch: <T = unknown>(path: string, json?: unknown, opts?: RequestInit) =>
    request<T>(path, { ...opts, method: "PATCH", json }),
  put: <T = unknown>(path: string, json?: unknown, opts?: RequestInit) =>
    request<T>(path, { ...opts, method: "PUT", json }),
  delete: <T = unknown>(path: string, opts?: RequestInit) =>
    request<T>(path, { ...opts, method: "DELETE" }),
  upload: async <T = unknown>(path: string, file: File): Promise<T> => {
    const form = new FormData();
    form.append("file", file);
    const token = getToken();
    const res = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: form,
    });
    if (!res.ok) {
      let body: unknown = undefined;
      try {
        body = await res.json();
      } catch {
        /* ignore */
      }
      throw new ApiError(`Upload failed (${res.status})`, res.status, body);
    }
    return (await res.json()) as T;
  },
};

export function assetUrl(pathOrUrl: string | null | undefined): string {
  if (!pathOrUrl) return "";
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  if (pathOrUrl.startsWith("/uploads/")) return `${API_BASE}${pathOrUrl}`;
  return pathOrUrl;
}
