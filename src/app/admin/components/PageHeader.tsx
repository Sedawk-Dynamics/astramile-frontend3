"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type BackProp = boolean | string | { href?: string; label?: string };

export default function PageHeader({
  title,
  breadcrumb,
  action,
  back,
}: {
  title: string;
  breadcrumb?: string;
  action?: { href?: string; label: string; onClick?: () => void };
  /**
   * Show a back arrow before the title.
   * - `true` → router.back()
   * - string → navigate to that path
   * - object → custom href + label override
   */
  back?: BackProp;
}) {
  const router = useRouter();

  const backCfg = (() => {
    if (!back) return null;
    if (back === true) return { kind: "history" as const, label: "Back" };
    if (typeof back === "string") return { kind: "href" as const, href: back, label: "Back" };
    if (back.href) return { kind: "href" as const, href: back.href, label: back.label ?? "Back" };
    return { kind: "history" as const, label: back.label ?? "Back" };
  })();

  const backButton = backCfg
    ? backCfg.kind === "href"
      ? (
        <Link href={backCfg.href!} className="admin-back-btn" aria-label={backCfg.label}>
          <BackIcon />
          <span>{backCfg.label}</span>
        </Link>
      )
      : (
        <button
          type="button"
          className="admin-back-btn"
          onClick={() => router.back()}
          aria-label={backCfg.label}
        >
          <BackIcon />
          <span>{backCfg.label}</span>
        </button>
      )
    : null;

  return (
    <div className="admin-topbar">
      <div className="admin-topbar-lead">
        {backButton}
        <div>
          {breadcrumb && <div className="breadcrumb">{breadcrumb}</div>}
          <h1>{title}</h1>
        </div>
      </div>
      {action && (
        action.href ? (
          <Link href={action.href} className="admin-btn primary">{action.label}</Link>
        ) : (
          <button className="admin-btn primary" onClick={action.onClick}>{action.label}</button>
        )
      )}
    </div>
  );
}

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
