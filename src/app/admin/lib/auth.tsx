"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { api, getToken, setToken } from "./api";

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "SUPER_ADMIN" | "EDITOR";
};

type AuthCtx = {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname() ?? "";

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const u = await api.get<AdminUser>("/api/auth/me");
        if (!cancelled) setUser(u);
      } catch {
        setToken(null);
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    const isLoginPage = pathname === "/admin/login";
    if (!user && !isLoginPage) router.replace("/admin/login");
    if (user && isLoginPage) router.replace("/admin");
  }, [loading, user, pathname, router]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<{ token: string; user: AdminUser }>(
      "/api/auth/login",
      { email, password },
      {},
    );
    setToken(res.token);
    setUser(res.user);
    router.replace("/admin");
  }, [router]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    router.replace("/admin/login");
  }, [router]);

  return <Ctx.Provider value={{ user, loading, login, logout }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
