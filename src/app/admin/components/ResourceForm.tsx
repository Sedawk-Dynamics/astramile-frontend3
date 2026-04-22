"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "../lib/api";
import { Field, ResourceConfig } from "./ResourceConfig";
import PageHeader from "./PageHeader";
import ImagePicker from "./ImagePicker";

type Values = Record<string, unknown>;

function defaultFor(field: Field): unknown {
  if (field.defaultValue !== undefined) return field.defaultValue;
  switch (field.type) {
    case "boolean": return true;
    case "number": return "";
    case "tags": return [];
    case "date":
    case "datetime": return "";
    default: return "";
  }
}

function buildDefaults(config: ResourceConfig): Values {
  return Object.fromEntries(config.fields.map((f) => [f.name, defaultFor(f)]));
}

function toInputDate(v: unknown, includeTime: boolean): string {
  if (!v) return "";
  const d = new Date(String(v));
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  const base = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  if (!includeTime) return base;
  return `${base}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function cleanForSend(fields: Field[], values: Values): Values {
  const out: Values = {};
  for (const f of fields) {
    let v = values[f.name];
    if (f.type === "number") {
      if (v === "" || v === null || v === undefined) v = null;
      else v = Number(v);
    }
    if (f.type === "tags" && typeof v === "string") {
      v = (v as string).split(",").map((s) => s.trim()).filter(Boolean);
    }
    if ((f.type === "date" || f.type === "datetime") && typeof v === "string" && v !== "") {
      v = new Date(v).toISOString();
    }
    if (v === "") v = f.required ? "" : null;
    out[f.name] = v;
  }
  // Remove nulls for slug if empty (let the server auto-derive)
  if (out.slug === null || out.slug === "") delete out.slug;
  return out;
}

export default function ResourceForm({
  config,
  id,
}: {
  config: ResourceConfig;
  id?: string;
}) {
  const router = useRouter();
  const isNew = !id;
  const [values, setValues] = useState<Values>(() => buildDefaults(config));
  const [loading, setLoading] = useState(!isNew);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    if (isNew) return;
    api
      .get<Values>(`${config.apiPath}/${id}`)
      .then((data) => {
        const v: Values = { ...buildDefaults(config) };
        for (const f of config.fields) {
          const raw = data[f.name];
          if (f.type === "tags") {
            v[f.name] = Array.isArray(raw) ? (raw as string[]).join(", ") : "";
          } else if (f.type === "date") {
            v[f.name] = toInputDate(raw, false);
          } else if (f.type === "datetime") {
            v[f.name] = toInputDate(raw, true);
          } else if (f.type === "boolean") {
            v[f.name] = Boolean(raw);
          } else {
            v[f.name] = raw ?? "";
          }
        }
        setValues(v);
      })
      .catch((e) => setErr(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [id, isNew, config]);

  function set(name: string, v: unknown) {
    setValues((prev) => ({ ...prev, [name]: v }));
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErr(null);
    setOk(false);
    try {
      const payload = cleanForSend(config.fields, values);
      if (isNew) {
        const created = await api.post<{ id: string }>(config.apiPath, payload);
        router.replace(`/admin/${config.slug}/${created.id}`);
      } else {
        await api.patch(`${config.apiPath}/${id}`, payload);
        setOk(true);
      }
    } catch (e) {
      if (e instanceof ApiError) {
        setErr(
          e.details && typeof e.details === "object" && "issues" in (e.details as object)
            ? `Validation error: ${JSON.stringify((e.details as { issues: unknown }).issues)}`
            : e.message,
        );
      } else {
        setErr(e instanceof Error ? e.message : "Save failed");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="admin-loading">Loading…</div>;

  return (
    <form onSubmit={save}>
      <PageHeader
        title={isNew ? `New ${config.singular}` : String(values[config.titleField] ?? config.singular)}
        breadcrumb={`${config.plural} / ${isNew ? "New" : "Edit"}`}
      />
      {err && <div className="admin-alert error">{err}</div>}
      {ok && <div className="admin-alert ok">Saved.</div>}

      <div className="admin-card">
        <div className="admin-form">
          {config.fields.map((f) => (
            <FieldEditor key={f.name} field={f} value={values[f.name]} set={set} allValues={values} />
          ))}
        </div>
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn primary" disabled={saving}>
          {saving ? "Saving…" : isNew ? "Create" : "Save changes"}
        </button>
        <button
          type="button"
          className="admin-btn"
          onClick={() => router.push(`/admin/${config.slug}`)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function FieldEditor({
  field,
  value,
  set,
  allValues,
}: {
  field: Field;
  value: unknown;
  set: (name: string, v: unknown) => void;
  allValues: Values;
}) {
  const v = value as string | number | boolean | string[] | null | undefined;

  if (field.type === "image") {
    return (
      <ImagePicker
        label={field.label}
        value={typeof v === "string" ? v : null}
        onChange={(url) => set(field.name, url)}
        hint={field.hint}
      />
    );
  }

  if (field.type === "boolean") {
    return (
      <div className="admin-field inline-check">
        <input
          type="checkbox"
          id={`f-${field.name}`}
          checked={Boolean(v)}
          onChange={(e) => set(field.name, e.target.checked)}
        />
        <label htmlFor={`f-${field.name}`}>{field.label}</label>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="admin-field">
        <label>{field.label}{field.required && " *"}</label>
        <textarea
          value={(v as string) ?? ""}
          onChange={(e) => set(field.name, e.target.value)}
          required={field.required}
          placeholder={field.placeholder}
        />
        {field.hint && <div className="hint">{field.hint}</div>}
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="admin-field">
        <label>{field.label}{field.required && " *"}</label>
        <select
          value={(v as string) ?? ""}
          onChange={(e) => set(field.name, e.target.value)}
          required={field.required}
        >
          <option value="">— Select —</option>
          {field.options?.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {field.hint && <div className="hint">{field.hint}</div>}
      </div>
    );
  }

  if (field.type === "slug") {
    const derived = field.derivedFrom ? (allValues[field.derivedFrom] as string) : "";
    return (
      <div className="admin-field">
        <label>{field.label}</label>
        <input
          type="text"
          value={(v as string) ?? ""}
          placeholder={derived ? `(auto: ${slugify(derived)})` : field.placeholder}
          onChange={(e) => set(field.name, e.target.value)}
        />
        {field.hint && <div className="hint">{field.hint}</div>}
      </div>
    );
  }

  if (field.type === "tags") {
    return (
      <div className="admin-field">
        <label>{field.label}</label>
        <input
          type="text"
          value={Array.isArray(v) ? (v as string[]).join(", ") : (v as string) ?? ""}
          onChange={(e) => set(field.name, e.target.value)}
          placeholder="Comma-separated values"
        />
        {field.hint && <div className="hint">{field.hint}</div>}
      </div>
    );
  }

  const htmlType =
    field.type === "number" ? "number"
    : field.type === "date" ? "date"
    : field.type === "datetime" ? "datetime-local"
    : "text";

  return (
    <div className="admin-field">
      <label>{field.label}{field.required && " *"}</label>
      <input
        type={htmlType}
        value={(v as string | number) ?? ""}
        step={field.step}
        onChange={(e) => set(field.name, e.target.value)}
        required={field.required}
        placeholder={field.placeholder}
      />
      {field.hint && <div className="hint">{field.hint}</div>}
    </div>
  );
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
