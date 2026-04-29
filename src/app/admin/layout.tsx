import type { Metadata } from "next";
import AdminShell from "./components/AdminShell";
import { AuthProvider } from "./lib/auth";
import { ToastProvider } from "./components/Toast";
import { ConfirmProvider } from "./components/ConfirmDialog";
import "./admin.css";

export const metadata: Metadata = {
  title: { default: "Admin · AstraMile", template: "%s · AstraMile Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <ConfirmProvider>
          <AdminShell>{children}</AdminShell>
        </ConfirmProvider>
      </ToastProvider>
    </AuthProvider>
  );
}
