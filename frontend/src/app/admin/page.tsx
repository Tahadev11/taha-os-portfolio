
import Link from "next/link";

export const instant = false;

const dashboardModules = [
  {
    title: "Projects",
    description: "Create, edit, publish, and organize your portfolio projects.",
    href: "/admin/projects",
    icon: "▣",
  },
  {
    title: "Messages",
    description: "Read contact form submissions and manage their status.",
    href: "/admin/messages",
    icon: "✉",
  },
  {
    title: "Skills",
    description: "Manage your technical skills and proficiency levels.",
    href: "/admin/skills",
    icon: "⌘",
  },
  {
    title: "Experience",
    description: "Update your employment, internships, and training.",
    href: "/admin/experience",
    icon: "▤",
  },
  {
    title: "Education",
    description: "Manage your academic background and qualifications.",
    href: "/admin/education",
    icon: "⌑",
  },
  {
    title: "Certificates",
    description: "Upload and manage your professional certificates.",
    href: "/admin/certificates",
    icon: "◇",
  },
  {
    title: "Resume",
    description: "Manage your downloadable resume.",
    href: "/admin/resume",
    icon: "▧",
  },
  {
    title: "Profile & Settings",
    description: "Update your public profile and website configuration.",
    href: "/admin/profile",
    icon: "⚙",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="admin-dashboard">
      <section className="admin-welcome">
        <div>
          <span className="admin-eyebrow">
            OVERVIEW / DASHBOARD
          </span>

          <h1>Welcome to your workspace.</h1>

          <p>
            Manage your portfolio content, messages, and website
            configuration from one place.
          </p>
        </div>

        <div className="admin-welcome-icon">
          &lt;/&gt;
        </div>
      </section>

      <section className="admin-section-heading">
        <div>
          <span className="admin-eyebrow">
            CONTENT MANAGEMENT
          </span>

          <h2>Workspace modules</h2>
        </div>

        <span className="admin-module-count">
          {String(dashboardModules.length).padStart(2, "0")} MODULES
        </span>
      </section>

      <section className="admin-module-grid">
        {dashboardModules.map((module) => (
          <Link
            href={module.href}
            className="admin-module-card"
            key={module.href}
          >
            <div className="admin-module-card-top">
              <span className="admin-module-icon">
                {module.icon}
              </span>

              <span className="admin-module-arrow">↗</span>
            </div>

            <h3>{module.title}</h3>

            <p>{module.description}</p>

            <span className="admin-module-action">
              OPEN MODULE →
            </span>
          </Link>
        ))}
      </section>

      <section className="admin-dashboard-note">
        <span className="admin-note-icon">i</span>

        <p>
          Your portfolio content is managed through your NestJS
          backend. Choose a module above to start managing it.
        </p>
      </section>
    </div>
  );
}
