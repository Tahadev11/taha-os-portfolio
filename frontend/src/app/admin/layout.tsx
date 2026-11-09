
"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import AdminSidebar from "@/components/AdminSidebar";

import {
  getAdminToken,
  logoutAdmin,
  verifyAdmin,
  type AdminUser,
} from "@/lib/auth";

import "./admin.css";

function AdminLayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === "/admin/login";

  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;

    async function checkAuthentication() {
      if (isLoginPage) {
        setChecking(false);
        return;
      }

      setChecking(true);

      const token = getAdminToken();

      if (!token) {
        router.replace("/admin/login");
        return;
      }

      try {
        const currentAdmin = await verifyAdmin(token);

        if (active) {
          setAdmin(currentAdmin);
          setChecking(false);
        }
      } catch (error) {
        console.error("Admin authentication failed:", error);

        logoutAdmin();

        if (active) {
          setAdmin(null);
          router.replace("/admin/login");
        }
      }
    }

    void checkAuthentication();

    return () => {
      active = false;
    };
  }, [isLoginPage, pathname, router]);

  // Login page does not require authentication.
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checking || !admin) {
    return (
      <main className="admin-loading-screen">
        <div className="admin-loading-content">
          <div className="admin-loading-spinner" />
          <p>VERIFYING ADMIN SESSION...</p>
        </div>
      </main>
    );
  }

  return (
    <div className="admin-shell">
      <AdminSidebar admin={admin} />

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="admin-topbar-label">
              TAHA OS / ADMINISTRATION
            </span>

            <h2>Control Panel</h2>
          </div>

          <div className="admin-topbar-status">
            <span />
            SYSTEM ONLINE
          </div>
        </header>

        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}

function AdminLayoutFallback() {
  return (
    <main className="admin-loading-screen">
      <div className="admin-loading-content">
        <div className="admin-loading-spinner" />
        <p>LOADING ADMIN PANEL...</p>
      </div>
    </main>
  );
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<AdminLayoutFallback />}>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </Suspense>
  );
}
