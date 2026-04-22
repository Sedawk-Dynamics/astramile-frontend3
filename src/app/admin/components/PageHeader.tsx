"use client";

import Link from "next/link";

export default function PageHeader({
  title,
  breadcrumb,
  action,
}: {
  title: string;
  breadcrumb?: string;
  action?: { href?: string; label: string; onClick?: () => void };
}) {
  return (
    <div className="admin-topbar">
      <div>
        {breadcrumb && <div className="breadcrumb">{breadcrumb}</div>}
        <h1>{title}</h1>
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
