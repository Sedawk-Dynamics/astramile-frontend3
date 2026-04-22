"use client";

import { useState } from "react";
import { useAuth } from "../lib/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      await login(email, password);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-login">
      <form className="card" onSubmit={onSubmit}>
        <h2>AstraMile Admin</h2>
        <p className="sub">Sign in to manage site content.</p>
        {err && <div className="admin-alert error">{err}</div>}
        <div className="admin-form">
          <div className="admin-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="admin-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <button type="submit" className="admin-btn primary" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}
