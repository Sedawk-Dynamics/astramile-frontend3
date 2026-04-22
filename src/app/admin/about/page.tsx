"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import PageHeader from "../components/PageHeader";
import ImagePicker from "../components/ImagePicker";

type Stat = { label: string; value: string };

type About = {
  headline: string;
  body: string;
  mission: string | null;
  vision: string | null;
  heroImage: string | null;
  stats: Stat[];
};

const EMPTY: About = {
  headline: "",
  body: "",
  mission: "",
  vision: "",
  heroImage: null,
  stats: [],
};

export default function AboutPage() {
  const [data, setData] = useState<About | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    api
      .get<About>("/api/about")
      .then((d) => setData({ ...EMPTY, ...d, stats: Array.isArray(d.stats) ? d.stats : [] }))
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
        stats: data.stats,
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

  function updateStat(i: number, k: keyof Stat, v: string) {
    setData((d) => {
      if (!d) return d;
      const stats = [...d.stats];
      stats[i] = { ...stats[i], [k]: v };
      return { ...d, stats };
    });
  }

  function addStat() {
    setData((d) => (d ? { ...d, stats: [...d.stats, { label: "", value: "" }] } : d));
  }

  function removeStat(i: number) {
    setData((d) => (d ? { ...d, stats: d.stats.filter((_, idx) => idx !== i) } : d));
  }

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

          <div className="admin-field">
            <label>Stats</label>
            {data.stats.length === 0 && (
              <div className="hint" style={{ marginBottom: 10 }}>No stats yet.</div>
            )}
            {data.stats.map((s, i) => (
              <div key={i} className="admin-repeater-row">
                <input
                  type="text"
                  placeholder="Label"
                  value={s.label}
                  onChange={(e) => updateStat(i, "label", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={s.value}
                  onChange={(e) => updateStat(i, "value", e.target.value)}
                />
                <button type="button" className="admin-btn small danger" onClick={() => removeStat(i)}>Remove</button>
              </div>
            ))}
            <button type="button" className="admin-btn" onClick={addStat}>+ Add stat</button>
          </div>
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
