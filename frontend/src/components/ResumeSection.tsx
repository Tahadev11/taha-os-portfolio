
import type { Resume } from "@/types/resume";

interface ResumeSectionProps {
  resume: Resume | null;
  loading: boolean;
}

export default function ResumeSection({
  resume,
  loading,
}: ResumeSectionProps) {
  return (
    <section className="quick-access">
      <div className="quick-access-heading">
        <span>MY RESUME</span>
        <span>DOCUMENT</span>
      </div>

      <div className="project-card">
        {loading ? (
          <>
            <h3 className="project-card-title">
              Loading Resume...
            </h3>
            <p className="hero-description">
              Fetching the latest resume document.
            </p>
          </>
        ) : resume ? (
          <>
            <div className="resume-document-label">
              <span className="resume-document-icon">PDF</span>
              <span>AVAILABLE DOCUMENT</span>
              <span className="resume-active-indicator">
                ACTIVE
              </span>
            </div>

            <h3 className="project-card-title">
              {resume.title}
            </h3>

            <p className="hero-description">
              {resume.description ||
                "Explore my education, technical skills, projects, and professional background."}
            </p>

            {resume.fileName && (
              <p className="resume-file-name">
                FILE: {resume.fileName}
              </p>
            )}

            <div className="project-card-actions">
              <a
                href="/resume/view"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Resume
              </a>

              <a
                href={resume.fileUrl}
                download="Taha-Siddique-Resume.pdf"
              >
                Download Resume
              </a>
            </div>
          </>
        ) : (
          <>
            <h3 className="project-card-title">
              Resume Unavailable
            </h3>

            <p className="hero-description">
              My resume is currently unavailable. Please check
              back later.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
