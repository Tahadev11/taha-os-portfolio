
import type { Education } from "@/types/portfolio";

interface EducationSectionProps {
  education: Education[];
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

export default function EducationSection({
  education,
  loading,
}: EducationSectionProps) {
  if (loading) {
    return (
      <section className="quick-access">
        <p className="hero-description">
          Loading education records...
        </p>
      </section>
    );
  }

  const sortedEducation = [...education].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  return (
    <section className="quick-access">
      <div className="quick-access-heading">
        <div>
          <span className="terminal-language">
            ACADEMIC BACKGROUND
          </span>

          <h2 className="project-card-title">
            Education
          </h2>
        </div>

        <span className="terminal-language">
          {sortedEducation.length} RECORDS
        </span>
      </div>

      {sortedEducation.length === 0 ? (
        <div className="project-card">
          <h3 className="project-card-title">
            No education records available yet.
          </h3>

          <p className="hero-description">
            Your academic qualifications will appear here.
          </p>
        </div>
      ) : (
        <div className="quick-grid">
          {sortedEducation.map((item) => (
            <article
              className="project-card"
              key={item._id}
            >
              <div className="project-card-header">
                <span className="terminal-language">
                  {item.isCurrent
                    ? "IN PROGRESS"
                    : "COMPLETED"}
                </span>

                {item.grade && (
                  <span className="terminal-language">
                    {item.grade}
                  </span>
                )}
              </div>

              <h3 className="project-card-title">
                {item.degree}
              </h3>

              <p className="hero-description">
                {item.institution}
              </p>

              {item.fieldOfStudy && (
                <p className="hero-description">
                  Field: {item.fieldOfStudy}
                </p>
              )}

              {item.location && (
                <p className="hero-description">
                  {item.location}
                </p>
              )}

              <p className="hero-description">
                {formatDate(item.startDate)} —{" "}
                {item.isCurrent
                  ? "Present"
                  : formatDate(item.endDate)}
              </p>

              {item.description && (
                <p className="hero-description">
                  {item.description}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
