import type { Project } from "@/types/portfolio";
import ProjectCard from "./ProjectCard";

interface ProjectsSectionProps {
  projects: Project[];
  loading: boolean;
}

export default function ProjectsSection({
  projects,
  loading,
}: ProjectsSectionProps) {
  return (
    <section className="quick-access">
      <div className="quick-access-heading">
        <span>MY PROJECTS</span>

        <span>
          {projects.length} PROJECT
          {projects.length === 1 ? "" : "S"}
        </span>
      </div>

      {loading ? (
        <p className="hero-description">
          Loading projects...
        </p>
      ) : projects.length > 0 ? (
        <div className="quick-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
            />
          ))}
        </div>
      ) : (
        <p className="hero-description">
          No published projects available.
        </p>
      )}
    </section>
  );
}