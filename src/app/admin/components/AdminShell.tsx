"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../lib/auth";

const NAV = [
  { group: "Overview", items: [{ href: "/admin", label: "Dashboard" }] },
  {
    group: "Content",
    items: [
      { href: "/admin/rockets", label: "Rockets" },
      { href: "/admin/missions", label: "Missions" },
      { href: "/admin/team", label: "Our Team" },
      { href: "/admin/launches", label: "Launches" },
      { href: "/admin/news", label: "News" },
      { href: "/admin/blog", label: "Blog" },
      { href: "/admin/gallery", label: "Gallery" },
      { href: "/admin/technology", label: "Technology" },
    ],
  },
  {
    group: "Site",
    items: [
      { href: "/admin/about", label: "About page" },
      { href: "/admin/contact", label: "Contact inbox" },
    ],
  },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const { user, loading, logout } = useAuth();
  const isLoginPage = pathname === "/admin/login";

  if (loading) {
    return (
      <div className="admin-root">
        <div className="admin-loading">Loading admin…</div>
      </div>
    );
  }

  if (isLoginPage || !user) {
    return <div className="admin-root">{children}</div>;
  }

  return (
    <div className="admin-root">
      <div className="admin-shell">
        <aside className="admin-sidebar">
          <div className="admin-brand">Astra<span>Mile</span> · Admin</div>
          <nav className="admin-nav">
            {NAV.map((g) => (
              <div key={g.group}>
                <div className="group-label">{g.group}</div>
                {g.items.map((i) => {
                  const active =
                    i.href === "/admin"
                      ? pathname === "/admin"
                      : pathname === i.href || pathname.startsWith(i.href + "/");
                  return (
                    <Link key={i.href} href={i.href} className={active ? "active" : ""}>
                      {i.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
          <div className="admin-user">
            <div className="name">{user.name}</div>
            <div className="email">{user.email}</div>
            <button type="button" onClick={logout}>Sign out</button>
          </div>
        </aside>
        <main className="admin-main">
          <div className="admin-main-inner">{children}</div>
        </main>
      </div>
    </div>
  );
}
