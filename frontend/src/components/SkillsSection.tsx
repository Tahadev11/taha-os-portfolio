
import type { Skill } from "@/types/skills";

interface SkillsSectionProps {
  skills: Skill[];
  loading: boolean;
}

export default function SkillsSection({
  skills,
  loading,
}: SkillsSectionProps) {
  const sortedSkills = [...skills].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  const categories = Array.from(
    new Set(sortedSkills.map((skill) => skill.category || "Other"))
  );

  return (
    <section className="quick-access">
      <div className="quick-access-heading">
        <span>MY TECHNICAL SKILLS</span>
        <span>{skills.length} SKILLS</span>
      </div>

      {loading ? (
        <p className="hero-description">Loading skills...</p>
      ) : skills.length > 0 ? (
        categories.map((category) => (
          <div key={category}>
            <div className="quick-access-heading">
              <span>{category.toUpperCase()}</span>
            </div>

            <div className="quick-grid">
              {sortedSkills
                .filter(
                  (skill) =>
                    (skill.category || "Other") === category
                )
                .map((skill) => (
                  <article className="project-card" key={skill._id}>
                    <div className="project-card-header">
                      <span className="quick-card-icon">
                        {skill.icon || "⌘"}
                      </span>

                      <span className="terminal-language">
                        {skill.proficiency}%
                      </span>
                    </div>

                    <h3 className="project-card-title">
                      {skill.name}
                    </h3>

                    <div
                      style={{
                        height: "5px",
                        background: "#242938",
                        borderRadius: "10px",
                        overflow: "hidden",
                        marginTop: "12px",
                      }}
                    >
                      <div
                        style={{
                          width: `${skill.proficiency}%`,
                          height: "100%",
                          background: "#4F8CFF",
                          borderRadius: "10px",
                        }}
                      />
                    </div>
                  </article>
                ))}
            </div>
          </div>
        ))
      ) : (
        <p className="hero-description">
          No skills have been added yet.
        </p>
      )}
    </section>
  );
}
