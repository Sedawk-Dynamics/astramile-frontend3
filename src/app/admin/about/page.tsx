"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import PageHeader from "../components/PageHeader";
import ImagePicker from "../components/ImagePicker";

type About = {
  headline: string;
  body: string;
  mission: string | null;
  vision: string | null;
  heroImage: string | null;
};

const EMPTY: About = {
  headline: "",
  body: "",
  mission: "",
  vision: "",
  heroImage: null,
};

export default function AboutPage() {
  const [data, setData] = useState<About | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    api
      .get<About>("/api/about")
      .then((d) => setData({ ...EMPTY, ...d }))
      .catch((e) => setErr(e instanceof Error ? e.message : String(e)));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    setErr(null);
    setOk(false);
    try {
      await api.put("/api/about", {
        headline: data.headline,
        body: data.body,
        mission: data.mission || null,
        vision: data.vision || null,
        heroImage: data.heroImage || null,
      });
      setOk(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (!data && !err) return <div className="admin-loading">Loading…</div>;
  if (!data) return <div className="admin-alert error">{err}</div>;

  return (
    <form onSubmit={save}>
      <PageHeader title="About page" breadcrumb="Site" />
      {err && <div className="admin-alert error">{err}</div>}
      {ok && <div className="admin-alert ok">Saved.</div>}

      <div className="admin-card">
        <div className="admin-form">
          <div className="admin-field">
            <label>Headline *</label>
            <input
              type="text"
              value={data.headline}
              onChange={(e) => setData({ ...data, headline: e.target.value })}
              required
            />
          </div>
          <div className="admin-field">
            <label>Body *</label>
            <textarea
              value={data.body}
              onChange={(e) => setData({ ...data, body: e.target.value })}
              required
            />
          </div>
          <div className="admin-field">
            <label>Mission</label>
            <textarea
              value={data.mission ?? ""}
              onChange={(e) => setData({ ...data, mission: e.target.value })}
            />
          </div>
          <div className="admin-field">
            <label>Vision</label>
            <textarea
              value={data.vision ?? ""}
              onChange={(e) => setData({ ...data, vision: e.target.value })}
            />
          </div>
          <ImagePicker
            label="Hero image"
            value={data.heroImage}
            onChange={(url) => setData({ ...data, heroImage: url })}
          />
        </div>
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn primary" disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </form>
  );
}
