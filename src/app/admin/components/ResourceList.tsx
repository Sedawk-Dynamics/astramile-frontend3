"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { api, assetUrl } from "../lib/api";
import { ResourceConfig } from "./ResourceConfig";
import PageHeader from "./PageHeader";
import { useToast } from "./Toast";
import { useConfirm } from "./ConfirmDialog";

export default function ResourceList({ config }: { config: ResourceConfig }) {
  const [rows, setRows] = useState<Record<string, unknown>[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const toast = useToast();
  const confirm = useConfirm();

  const reload = useCallback(async () => {
    try {
      const data = await api.get<Record<string, unknown>[]>(`${config.apiPath}?all=true`);
      setRows(data);
      setLoadError(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setLoadError(msg);
      toast.error(msg, "Failed to load");
    }
  }, [config.apiPath, toast]);

  useEffect(() => {
    reload();
  }, [reload]);

  async function remove(id: string, label: string) {
    const ok = await confirm({
      title: `Delete ${config.singular.toLowerCase()}?`,
      message: `“${label}” will be permanently removed. This cannot be undone.`,
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    try {
      await api.delete(`${config.apiPath}/${id}`);
      setRows((r) => r?.filter((row) => row.id !== id) ?? null);
      toast.success(`${config.singular} deleted.`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Delete failed", "Delete failed");
    }
  }

  return (
    <div>
      <PageHeader
        title={config.plural}
        breadcrumb="Content"
        action={{ href: `/admin/${config.slug}/new`, label: `+ New ${config.singular.toLowerCase()}` }}
      />
      {!rows && !loadError && <div className="admin-loading">Loading…</div>}
      {loadError && !rows && (
        <div className="admin-empty">
          Couldn’t load {config.plural.toLowerCase()}. {loadError}
        </div>
      )}
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
              {rows.map((row) => {
                const label = String(row[config.titleField] ?? config.singular);
                return (
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
                        onClick={() => remove(row.id as string, label)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
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
      // eslint-disable-next-line @next/next/no-img-element
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
