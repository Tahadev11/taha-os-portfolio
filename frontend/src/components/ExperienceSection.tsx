
import type { Experience } from "@/types/portfolio";

interface ExperienceSectionProps {
  experiences: Experience[];
  loading: boolean;
}

function formatDate(date?: string | null): string {
  if (!date) return "Present";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

const experienceLabels: Record<Experience["type"], string> = {
  employment: "Employment",
  internship: "Internship",
  training: "Training",
  freelance: "Freelance",
};

export default function ExperienceSection({
  experiences,
  loading,
}: ExperienceSectionProps) {
  if (loading) {
    return (
      <section className="quick-access">
        <p className="hero-description">
          Loading experience records...
        </p>
      </section>
    );
  }

  const sortedExperiences = [...experiences].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  return (
    <section className="quick-access">
      <div className="quick-access-heading">
        <div>
          <span className="terminal-language">
            CAREER HISTORY
          </span>

          <h2 className="project-card-title">
            Experience
          </h2>
        </div>

        <span className="terminal-language">
          {sortedExperiences.length} RECORDS
        </span>
      </div>

      {sortedExperiences.length === 0 ? (
        <div className="project-card">
          <h3 className="project-card-title">
            No experience available yet.
          </h3>

          <p className="hero-description">
            Professional experience, internships and training
            will appear here.
          </p>
        </div>
      ) : (
        <div className="quick-grid">
          {sortedExperiences.map((experience) => (
            <article
              className="project-card"
              key={experience._id}
            >
              <div className="project-card-header">
                <span className="terminal-language">
                  {experienceLabels[experience.type] ??
                    experience.type}
                </span>

                <span className="terminal-language">
                  {experience.isCurrent
                    ? "CURRENT"
                    : "COMPLETED"}
                </span>
              </div>

              <h3 className="project-card-title">
                {experience.position}
              </h3>

              <p className="hero-description">
                {experience.organization}
                {experience.location
                  ? ` · ${experience.location}`
                  : ""}
              </p>

              <p className="hero-description">
                {formatDate(experience.startDate)} —{" "}
                {experience.isCurrent
                  ? "Present"
                  : formatDate(experience.endDate)}
              </p>

              {experience.description && (
                <p className="hero-description">
                  {experience.description}
                </p>
              )}

              {experience.responsibilities?.length > 0 && (
                <ul>
                  {experience.responsibilities.map(
                    (responsibility, index) => (
                      <li
                        key={`${experience._id}-responsibility-${index}`}
                      >
                        {responsibility}
                      </li>
                    )
                  )}
                </ul>
              )}

              {experience.techStack?.length > 0 && (
                <div className="project-tech-stack">
                  {experience.techStack.map((technology) => (
                    <span key={technology}>
                      {technology}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
