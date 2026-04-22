"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "./lib/api";
import PageHeader from "./components/PageHeader";

type Summary = {
  counts: Record<string, number>;
  upcomingLaunches: Array<{
    id: string;
    name: string;
    scheduledAt: string;
    status: string;
    rocket?: { name: string } | null;
    mission?: { name: string } | null;
  }>;
};

const CARDS: { key: keyof Summary["counts"]; label: string; href: string }[] = [
  { key: "rockets", label: "Rockets", href: "/admin/rockets" },
  { key: "missions", label: "Missions", href: "/admin/missions" },
  { key: "team", label: "Our Team", href: "/admin/team" },
  { key: "launches", label: "Launches", href: "/admin/launches" },
  { key: "news", label: "News", href: "/admin/news" },
  { key: "blog", label: "Blog", href: "/admin/blog" },
  { key: "gallery", label: "Gallery", href: "/admin/gallery" },
  { key: "technology", label: "Technology", href: "/admin/technology" },
  { key: "unreadContacts", label: "Unread messages", href: "/admin/contact" },
];

export default function DashboardPage() {
  const [data, setData] = useState<Summary | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<Summary>("/api/dashboard/summary")
      .then(setData)
      .catch((e) => setErr(e instanceof Error ? e.message : String(e)));
  }, []);

  return (
    <div>
      <PageHeader title="Dashboard" breadcrumb="Overview" />
      {err && <div className="admin-alert error">{err}</div>}
      {!data && !err && <div className="admin-loading">Loading…</div>}

      {data && (
        <>
          <div className="admin-grid-stats" style={{ marginBottom: 28 }}>
            {CARDS.map((c) => (
              <Link key={c.key} href={c.href} className="admin-stat">
                <div className="label">{c.label}</div>
                <div className="value">{data.counts[c.key] ?? 0}</div>
              </Link>
            ))}
          </div>

          <div className="admin-card">
            <h3 className="admin-section-title">Upcoming launches</h3>
            {data.upcomingLaunches.length === 0 ? (
              <div className="admin-empty">No upcoming launches scheduled.</div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Rocket</th>
                    <th>Mission</th>
                    <th>When</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.upcomingLaunches.map((l) => (
                    <tr key={l.id}>
                      <td>{l.name}</td>
                      <td>{l.rocket?.name ?? "—"}</td>
                      <td>{l.mission?.name ?? "—"}</td>
                      <td>{new Date(l.scheduledAt).toLocaleString()}</td>
                      <td><span className="admin-tag">{l.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
