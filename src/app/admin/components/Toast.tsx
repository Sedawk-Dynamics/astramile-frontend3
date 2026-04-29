"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export type ToastKind = "success" | "error" | "info";

type ToastItem = {
  id: number;
  kind: ToastKind;
  title?: string;
  message: string;
};

type ToastContextValue = {
  push: (kind: ToastKind, message: string, title?: string) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const DEFAULT_DURATION = 4200;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (kind: ToastKind, message: string, title?: string) => {
      const id = ++idRef.current;
      setItems((prev) => [...prev, { id, kind, message, title }]);
      window.setTimeout(() => remove(id), DEFAULT_DURATION);
    },
    [remove],
  );

  const value: ToastContextValue = {
    push,
    success: (m, t) => push("success", m, t),
    error: (m, t) => push("error", m, t),
    info: (m, t) => push("info", m, t),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="admin-toast-stack" role="region" aria-live="polite" aria-label="Notifications">
        {items.map((t) => (
          <ToastCard key={t.id} item={t} onDismiss={() => remove(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const [entering, setEntering] = useState(true);
  useEffect(() => {
    const t = window.setTimeout(() => setEntering(false), 20);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <div
      className={`admin-toast ${item.kind} ${entering ? "enter" : "in"}`}
      role={item.kind === "error" ? "alert" : "status"}
    >
      <span className="admin-toast-icon" aria-hidden="true">
        {item.kind === "success" && "✓"}
        {item.kind === "error" && "!"}
        {item.kind === "info" && "i"}
      </span>
      <div className="admin-toast-body">
        {item.title && <div className="admin-toast-title">{item.title}</div>}
        <div className="admin-toast-msg">{item.message}</div>
      </div>
      <button
        type="button"
        className="admin-toast-close"
        onClick={onDismiss}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}
