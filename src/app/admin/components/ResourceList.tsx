"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api, assetUrl } from "../lib/api";
import { ResourceConfig } from "./ResourceConfig";
import PageHeader from "./PageHeader";

export default function ResourceList({ config }: { config: ResourceConfig }) {
  const [rows, setRows] = useState<Record<string, unknown>[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      const data = await api.get<Record<string, unknown>[]>(`${config.apiPath}?all=true`);
      setRows(data);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    }
  }, [config.apiPath]);

  useEffect(() => {
    reload();
  }, [reload]);

  async function remove(id: string) {
    if (!confirm(`Delete this ${config.singular.toLowerCase()}?`)) return;
    try {
      await api.delete(`${config.apiPath}/${id}`);
      setRows((r) => r?.filter((row) => row.id !== id) ?? null);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div>
      <PageHeader
        title={config.plural}
        breadcrumb="Content"
        action={{ href: `/admin/${config.slug}/new`, label: `+ New ${config.singular.toLowerCase()}` }}
      />
      {err && <div className="admin-alert error">{err}</div>}
      {!rows && !err && <div className="admin-loading">Loading…</div>}
      {rows && rows.length === 0 && (
        <div className="admin-empty">
          No {config.plural.toLowerCase()} yet. Create the first one.
        </div>
      )}
      {rows && rows.length > 0 && (
        <div className="admin-card flush">
          <table className="admin-table">
            <thead>
              <tr>
                {config.listColumns.map((c) => (
                  <th key={c.key}>{c.label}</th>
                ))}
                <th style={{ width: 140, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id as string}>
                  {config.listColumns.map((c) => (
                    <td key={c.key}>{renderCell(row[c.key], c.render)}</td>
                  ))}
                  <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                    <Link href={`/admin/${config.slug}/${row.id}`} className="admin-btn small" style={{ marginRight: 8 }}>
                      Edit
                    </Link>
                    <button
                      type="button"
                      className="admin-btn small danger"
                      onClick={() => remove(row.id as string)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function renderCell(value: unknown, render?: "image" | "bool" | "date" | "text" | "tag") {
  if (value === null || value === undefined || value === "") {
    if (render === "bool") return <span className="admin-tag off">—</span>;
    return <span style={{ color: "var(--a-text-faint)" }}>—</span>;
  }
  switch (render) {
    case "image":
      return <img className="thumb" src={assetUrl(String(value))} alt="" />;
    case "bool":
      return value
        ? <span className="admin-tag ok">Live</span>
        : <span className="admin-tag off">Draft</span>;
    case "date":
      return new Date(String(value)).toLocaleString();
    case "tag":
      return <span className="admin-tag">{String(value)}</span>;
    default:
      return String(value);
  }
}
