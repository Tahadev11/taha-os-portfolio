
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { AdminUser } from "@/lib/auth";
import { logoutAdmin } from "@/lib/auth";

interface AdminSidebarProps {
  admin: AdminUser;
}

const adminNavigation = [
  { label: "Overview", href: "/admin", icon: "▦" },
  { label: "Projects", href: "/admin/projects", icon: "▣" },
  { label: "Messages", href: "/admin/messages", icon: "✉" },
  { label: "Skills", href: "/admin/skills", icon: "⌘" },
  { label: "Experience", href: "/admin/experience", icon: "▤" },
  { label: "Education", href: "/admin/education", icon: "⌑" },
  { label: "Certificates", href: "/admin/certificates", icon: "◇" },
  { label: "Resume", href: "/admin/resume", icon: "▧" },
  { label: "Profile", href: "/admin/profile", icon: "◉" },
  { label: "Settings", href: "/admin/settings", icon: "⚙" },
];

export default function AdminSidebar({ admin }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    logoutAdmin();
    router.replace("/admin/login");
  }

  return (
    <aside className="admin-sidebar">

      {/* Fixed Sidebar Header */}
      <div className="admin-sidebar-header">
        <Link href="/admin" className="admin-sidebar-brand">
          TAHA<span>.</span>OS
          <small>CONTROL PANEL</small>
        </Link>

        <div className="admin-sidebar-label">
          WORKSPACE
        </div>
      </div>

      {/* Independently Scrollable Navigation */}
      <nav className="admin-navigation">
        {adminNavigation.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`admin-nav-link ${
                isActive ? "active" : ""
              }`}
            >
              <span className="admin-nav-icon">
                {item.icon}
              </span>

              <span>{item.label}</span>

              {isActive && (
                <span className="admin-nav-indicator" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Fixed Sidebar Footer */}
      <div className="admin-sidebar-bottom">
        <div className="admin-user">
          <div className="admin-user-avatar">
            {admin.name?.charAt(0).toUpperCase() || "A"}
          </div>

          <div className="admin-user-details">
            <strong>{admin.name || "Admin"}</strong>
            <span>{admin.email}</span>
          </div>
        </div>

        <button
          type="button"
          className="admin-logout-button"
          onClick={handleLogout}
        >
          <span>↪</span>
          Sign out
        </button>

        <Link href="/" className="admin-public-link">
          ↗ View public portfolio
        </Link>
      </div>
    </aside>
  );
}
