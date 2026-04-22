"use client";

import { useEffect, useState } from "react";
import { api } from "../lib/api";
import PageHeader from "../components/PageHeader";

type Submission = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export default function ContactInboxPage() {
  const [rows, setRows] = useState<Submission[] | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [open, setOpen] = useState<Submission | null>(null);

  async function load() {
    try {
      const data = await api.get<Submission[]>("/api/contact");
      setRows(data);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  }

  useEffect(() => { load(); }, []);

  async function markRead(row: Submission, isRead: boolean) {
    try {
      await api.patch(`/api/contact/${row.id}`, { isRead });
      setRows((r) => r?.map((x) => (x.id === row.id ? { ...x, isRead } : x)) ?? null);
      if (open?.id === row.id) setOpen({ ...row, isRead });
    } catch (e) {
      alert(e instanceof Error ? e.message : "Update failed");
    }
  }

  async function remove(row: Submission) {
    if (!confirm(`Delete message from ${row.name}?`)) return;
    try {
      await api.delete(`/api/contact/${row.id}`);
      setRows((r) => r?.filter((x) => x.id !== row.id) ?? null);
      if (open?.id === row.id) setOpen(null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div>
      <PageHeader title="Contact inbox" breadcrumb="Site" />
      {err && <div className="admin-alert error">{err}</div>}
      {!rows && !err && <div className="admin-loading">Loading…</div>}
      {rows && rows.length === 0 && (
        <div className="admin-empty">No messages yet.</div>
      )}
      {rows && rows.length > 0 && (
        <div className="admin-card flush">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: 24 }}></th>
                <th>From</th>
                <th>Subject</th>
                <th>Received</th>
                <th style={{ width: 180, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} style={{ cursor: "pointer" }} onClick={() => setOpen(r)}>
                  <td>
                    {!r.isRead && (
                      <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: "var(--a-accent)" }} />
                    )}
                  </td>
                  <td>
                    <div style={{ fontWeight: r.isRead ? 400 : 600 }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: "var(--a-text-faint)" }}>{r.email}</div>
                  </td>
                  <td>{r.subject ?? <span style={{ color: "var(--a-text-faint)" }}>(no subject)</span>}</td>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }} onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="admin-btn small"
                      style={{ marginRight: 8 }}
                      onClick={() => markRead(r, !r.isRead)}
                    >
                      {r.isRead ? "Mark unread" : "Mark read"}
                    </button>
                    <button type="button" className="admin-btn small danger" onClick={() => remove(r)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {open && (
        <div
          role="dialog"
          className="admin-modal-backdrop"
          onClick={() => setOpen(null)}
        >
          <div
            className="admin-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>{open.name}</div>
                <div style={{ fontSize: 12, color: "var(--a-text-faint)" }}>{open.email}</div>
              </div>
              <div style={{ fontSize: 11, color: "var(--a-text-faint)" }}>
                {new Date(open.createdAt).toLocaleString()}
              </div>
            </div>
            {open.subject && <div style={{ fontWeight: 600, marginBottom: 8 }}>{open.subject}</div>}
            <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6, fontSize: 14 }}>{open.message}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 18, justifyContent: "flex-end" }}>
              <a className="admin-btn" href={`mailto:${open.email}?subject=Re: ${encodeURIComponent(open.subject ?? "your message")}`}>
                Reply by email
              </a>
              <button className="admin-btn" onClick={() => markRead(open, !open.isRead)}>
                {open.isRead ? "Mark unread" : "Mark read"}
              </button>
              <button className="admin-btn" onClick={() => setOpen(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
