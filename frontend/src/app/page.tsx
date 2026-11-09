
"use client";

import { useEffect, useState } from "react";

import { portfolioService } from "@/services/portfolioService";

import type {
  Profile,
  Project,
  Experience,
  Education,
} from "@/types/portfolio";

import type { Certificate } from "@/components/CertficatesSection";
import type { Skill } from "@/types/skills";
import type { Resume } from "@/types/resume";
import type { Settings } from "@/types/settings";

import {
  defaultContent,
  navigation,
  type Section,
} from "@/types/sections";

import Terminal from "@/components/Terminal";
import ProjectsSection from "@/components/ProjectsSection";
import ResumeSection from "@/components/ResumeSection";
import CertificatesSection from "@/components/CertficatesSection";
import SkillsSection from "@/components/SkillsSection";
import ExperienceSection from "@/components/ExperienceSection";
import EducationSection from "@/components/EducationSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
const [activeSection, setActiveSection] =
  useState<Section>("home");

const [isReady, setIsReady] = useState(false);

    // Restore the selected section from the URL
useEffect(() => {
  function syncSectionFromUrl() {
    const hash = window.location.hash.replace("#", "");

    const matchedSection = navigation.find(
      (item) => item.section === hash
    );

    setActiveSection(matchedSection?.section ?? "home");
  }

  // Restore the correct section before showing the page.
  syncSectionFromUrl();

  // Show the portfolio after the correct section is selected.
  setIsReady(true);

  // Support browser Back and Forward.
  window.addEventListener("popstate", syncSectionFromUrl);
  window.addEventListener("hashchange", syncSectionFromUrl);

  return () => {
    window.removeEventListener("popstate", syncSectionFromUrl);
    window.removeEventListener("hashchange", syncSectionFromUrl);
  };
}, []);

  // Portfolio data
  const [profile, setProfile] = useState<Profile | null>(null);
const [settings, setSettings] = useState<Settings | null>(null);
const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("dark");
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [resume, setResume] = useState<Resume | null>(null);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [certificatesLoading, setCertificatesLoading] = useState(true);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [experiencesLoading, setExperiencesLoading] = useState(true);
  const [educationLoading, setEducationLoading] = useState(true);
  const [resumeLoading, setResumeLoading] = useState(true);

  const [apiError, setApiError] = useState("");

// Load public website settings
useEffect(() => {
  async function loadSettings() {
    try {
      const settingsData = await portfolioService.getSettings();
      setSettings(settingsData);
    } catch (error) {
      console.error("Settings API error:", error);
    }
  }

  void loadSettings();
}, []);

// Apply the selected website theme
useEffect(() => {
  const selectedTheme = settings?.theme ?? "dark";

  if (selectedTheme !== "system") {
    setResolvedTheme(selectedTheme);
    return;
  }

  const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");

  function updateSystemTheme() {
    setResolvedTheme(mediaQuery.matches ? "light" : "dark");
  }

  updateSystemTheme();

  mediaQuery.addEventListener("change", updateSystemTheme);

  return () => {
    mediaQuery.removeEventListener("change", updateSystemTheme);
  };
}, [settings?.theme]);

  // Fetch portfolio data
  useEffect(() => {
    async function loadPortfolio() {
      // Profile and projects
      try {
        setLoading(true);
        setApiError("");

        const [profileResult, projectsResult] =
          await Promise.all([
            portfolioService.getProfile(),
            portfolioService.getProjects(),
          ]);

        setProfile(profileResult);

        setProjects(
          [...projectsResult].sort(
            (a, b) => a.sortOrder - b.sortOrder
          )
        );
      } catch (error) {
        console.error("Portfolio API error:", error);

        setApiError(
          error instanceof Error
            ? error.message
            : "Unable to load portfolio data."
        );
      } finally {
        setLoading(false);
      }

      // Resume
      try {
        const resumeData = await portfolioService.getResume();
        setResume(resumeData);
      } catch (error) {
        // No active resume is not a critical portfolio error.
        console.info("No active resume available:", error);
        setResume(null);
      } finally {
        setResumeLoading(false);
      }

      // Certificates
      try {
        const certificateData =
          await portfolioService.getCertificates();

        setCertificates(certificateData);
      } catch (error) {
        console.error("Certificates API error:", error);
      } finally {
        setCertificatesLoading(false);
      }

      // Skills
      try {
        const skillsData =
          await portfolioService.getSkills();

        setSkills(skillsData);
      } catch (error) {
        console.error("Skills API error:", error);
      } finally {
        setSkillsLoading(false);
      }

      // Experiences
      try {
        const experiencesData =
          await portfolioService.getExperiences();

        setExperiences(experiencesData);
      } catch (error) {
        console.error("Experience API error:", error);
      } finally {
        setExperiencesLoading(false);
      }

      // Education
      try {
        const educationData =
          await portfolioService.getEducation();

        setEducation(educationData);
      } catch (error) {
        console.error("Education API error:", error);
      } finally {
        setEducationLoading(false);
      }
    }

    void loadPortfolio();
  }, []);

  // Navigation
function navigateTo(section: Section) {
  const newHash = `#${section}`;

  if (window.location.hash !== newHash) {
    window.history.pushState(null, "", newHash);
  }

  setActiveSection(section);
}
  const content = defaultContent[activeSection];

  return (
<main
  className="os-shell"
  data-theme={resolvedTheme}
  style={{
    visibility: isReady ? "visible" : "hidden",
  }}
>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      {/* TOPBAR */}
      <header className="topbar">
<a
  className="brand"
  href="#home"
  onClick={(event) => {
    event.preventDefault();
    navigateTo("home");
  }}
>
{(resolvedTheme === "light"
  ? settings?.lightLogoUrl || settings?.logoUrl
  : settings?.logoUrl) ? (
  <img
    src={
      resolvedTheme === "light"
        ? settings?.lightLogoUrl || settings?.logoUrl
        : settings?.logoUrl
    }
    alt={settings?.siteTitle || "Taha Siddique"}
    className="brand-logo"
  />
) : (
  <>
    TAHA<span>.</span>OS
  </>
)}
</a>

        <div className="system-status">
          <span className="status-dot" />
          SYSTEM ONLINE
          <span className="status-divider">/</span>
          V1.0.0
        </div>

        <a
          className="topbar-link"
          href={`mailto:${profile?.email || "your-email@example.com"}`}
        >
          LET&apos;S TALK <span>↗</span>
        </a>
      </header>

      <div className="workspace">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-heading">
            <span className="sidebar-icon">⌘</span>
            <span>WORKSPACE</span>
          </div>

          <div className="sidebar-group-label">
            ENVIRONMENT
          </div>

          <nav
            className="side-navigation"
            aria-label="Main navigation"
          >
            {navigation.map((item, index) => (
              <button
                key={item.section}
                className={`nav-item ${
                  activeSection === item.section ? "active" : ""
                }`}
                onClick={() => navigateTo(item.section)}
              >
                <span className="nav-index">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span>{item.label}</span>

                {activeSection === item.section && (
                  <span className="nav-indicator" />
                )}
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <div className="availability">
              <span className="status-dot" />

              {profile?.isAvailable
                ? "Available for opportunities"
                : "Portfolio workspace"}
            </div>
            {/* SOCIAL LINKS */}
<div className="sidebar-socials">
  {settings?.socialLinks?.github && (
    <a
      href={settings.socialLinks.github}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="GitHub"
    >
      GitHub <span>↗</span>
    </a>
  )}

  {settings?.socialLinks?.linkedin && (
    <a
      href={settings.socialLinks.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="LinkedIn"
    >
      LinkedIn <span>↗</span>
    </a>
  )}

  {settings?.socialLinks?.twitter && (
    <a
      href={settings.socialLinks.twitter}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Twitter"
    >
      Twitter <span>↗</span>
    </a>
  )}

  {settings?.socialLinks?.instagram && (
    <a
      href={settings.socialLinks.instagram}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram"
    >
      Instagram <span>↗</span>
    </a>
  )}
</div>

            <div className="sidebar-version">
              TAHA OS / BUILD 001
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="main-panel">
          {/* BREADCRUMB */}
          <div className="breadcrumb">
            <span>root</span>

            <span className="breadcrumb-separator">/</span>

            <span>{activeSection}</span>

            <span className="breadcrumb-right">
              PERSONAL PORTFOLIO
            </span>
          </div>

          {/* HERO SECTION */}
          <section className="hero-section">
            <div className="hero-copy">
              <div className="eyebrow">
                <span className="eyebrow-line" />

                {profile?.professionalTitle?.toUpperCase() ||
                  "SOFTWARE ENGINEER FROM PAKISTAN"}
              </div>

              <h1>
                {activeSection === "home" ? (
                  <>
                    Hello, I&apos;m
                    <br />

                    <span className="gradient-text">
                      {profile?.fullName || "Taha Siddique"}.
                    </span>
                  </>
                ) : (
                  content.title
                )}
              </h1>

              <p className="hero-subtitle">
                {activeSection === "home"
                  ? profile?.professionalTitle || content.subtitle
                  : content.subtitle}
              </p>

              <p className="hero-description">
                {activeSection === "home"
                  ? profile?.shortIntro || content.description
                  : activeSection === "about"
                    ? profile?.about || content.description
                    : content.description}
              </p>

              <div className="hero-actions">
                <button
                  className="primary-button"
                  onClick={() => navigateTo("projects")}
                >
                  Explore projects <span>↗</span>
                </button>

                <button
                  className="secondary-button"
                  onClick={() => navigateTo("contact")}
                >
                  Get in touch
                </button>
              </div>

              {loading && (
                <p className="hero-description">
                  Loading portfolio data...
                </p>
              )}
            </div>

            {/* HERO VISUAL */}
            <div className="hero-visual">
              <div className="visual-orbit orbit-one" />
              <div className="visual-orbit orbit-two" />

              <div className="visual-core">
                <span className="core-symbol">&lt;/&gt;</span>

                <span className="core-label">
                  BUILD · CREATE · REPEAT
                </span>
              </div>

              <div className="floating-tag tag-top">
                {"{ }"} TYPESCRIPT
              </div>

              <div className="floating-tag tag-bottom">
                NODE.JS / NESTJS
              </div>

              <div className="visual-cross cross-one">+</div>
              <div className="visual-cross cross-two">+</div>
            </div>
          </section>

          {/* API ERROR */}
          {apiError && (
            <div className="terminal-window">
              <div className="terminal-body">
                <p className="output-line">
                  Unable to load portfolio data: {apiError}
                </p>

                <p className="output-line">
                  Please check that the NestJS backend is running.
                </p>
              </div>
            </div>
          )}

          {/* TERMINAL */}
          <Terminal
            profile={profile}
            onNavigate={navigateTo}
          />

          {/* SECTION CONTENT */}
          {activeSection === "projects" ? (
            <ProjectsSection
              projects={projects}
              loading={loading}
            />
          ) : activeSection === "skills" ? (
            <SkillsSection
              skills={skills}
              loading={skillsLoading}
            />
          ) : activeSection === "resume" ? (
            <ResumeSection
              resume={resume}
              loading={resumeLoading}
            />
          ) : activeSection === "certificates" ? (
            <CertificatesSection
              certificates={certificates}
              loading={certificatesLoading}
            />
          ) : activeSection === "experience" ? (
            <ExperienceSection
              experiences={experiences}
              loading={experiencesLoading}
            />
          ) : activeSection === "education" ? (
            <EducationSection
              education={education}
              loading={educationLoading}
            />
          ) : activeSection === "contact" ? (
            <ContactSection />
          ) : (
            /* QUICK ACCESS */
            <section className="quick-access">
              <div className="quick-access-heading">
                <span>QUICK ACCESS</span>

                <span>
                  SELECT A DIRECTORY TO EXPLORE
                </span>
              </div>

              <div className="quick-grid">
                {navigation
                  .filter((item) => item.section !== "home")
                  .map((item) => (
                    <button
                      key={item.section}
                      className={`quick-card ${
                        activeSection === item.section
                          ? "quick-active"
                          : ""
                      }`}
                      onClick={() => navigateTo(item.section)}
                    >
                      <span className="quick-card-icon">
                        {item.section === "about" && "◉"}
                        {item.section === "projects" && "▣"}
                        {item.section === "skills" && "⌘"}
                        {item.section === "experience" && "▤"}
                        {item.section === "education" && "⌑"}
                        {item.section === "resume" && "▧"}
                        {item.section === "certificates" && "▤"}
                        {item.section === "contact" && "↗"}
                      </span>

                      <span className="quick-card-label">
                        {item.label}
                      </span>

                      <span className="quick-card-arrow">↗</span>
                    </button>
                  ))}
              </div>
            </section>
          )}

          {/* FOOTER */}
          <footer className="footer">
            <span>
              © 2026 {profile?.fullName || "TAHA SIDDIQUE"}
            </span>

            <span>
              DESIGNED & BUILT WITH PRECISION
            </span>

            <span className="footer-status">
              <span className="status-dot" />
              ALL SYSTEMS NORMAL
            </span>
          </footer>
        </section>
      </div>
    </main>
  );
}
