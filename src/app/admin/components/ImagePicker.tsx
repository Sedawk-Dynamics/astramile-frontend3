"use client";

import { useRef, useState } from "react";
import { api, assetUrl } from "../lib/api";

type Props = {
  value: string | null | undefined;
  onChange: (url: string | null) => void;
  label?: string;
  hint?: string;
};

export default function ImagePicker({ value, onChange, label = "Image", hint }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErr(null);
    try {
      const res = await api.upload<{ url: string }>("/api/upload/image", file);
      onChange(res.url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="admin-field">
      <label>{label}</label>
      <div className="admin-image-picker">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={assetUrl(value)} alt="" className="preview" />
        ) : (
          <div className="preview empty">No image</div>
        )}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
          <input
            type="text"
            placeholder="Paste image URL or upload"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              className="admin-btn"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Uploading…" : "Upload file"}
            </button>
            {value && (
              <button type="button" className="admin-btn danger" onClick={() => onChange(null)}>
                Clear
              </button>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFile}
          />
        </div>
      </div>
      {hint && <div className="hint">{hint}</div>}
      {err && <div className="hint" style={{ color: "var(--a-danger)" }}>{err}</div>}
    </div>
  );
}
