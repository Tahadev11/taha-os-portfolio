"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  adminProjectService,
  type AdminProject,
} from "@/services/adminProjectService";

export default function AdminProjectsClient() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    try {
      setError("");
      const data = await adminProjectService.getAll();
      setProjects(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load projects."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  async function toggleStatus(project: AdminProject) {
    const newStatus =
      project.status === "published" ? "draft" : "published";

    try {
      setActionId(project._id);
      setError("");

      await adminProjectService.update(project._id, {
        status: newStatus,
      });

      await loadProjects();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update project."
      );
    } finally {
      setActionId(null);
    }
  }

  async function deleteProject(project: AdminProject) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${project.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setActionId(project._id);
      setError("");

      await adminProjectService.delete(project._id);

      await loadProjects();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete project."
      );
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="admin-projects-page">
      <div className="admin-projects-heading">
        <div>
          <span className="admin-eyebrow">
            CONTENT MANAGEMENT / PROJECTS
          </span>

          <h1>Projects</h1>

          <p>
            Create, organize, and manage the projects displayed
            on your public portfolio.
          </p>
        </div>

        <Link href="/admin/projects/new" className="admin-button">
          + Add Project
        </Link>
      </div>

      <div className="admin-project-summary">
        <div className="admin-card">
          <span>Total Projects</span>
          <strong>{projects.length}</strong>
        </div>

        <div className="admin-card">
          <span>Published</span>
          <strong>
            {projects.filter((project) => project.status === "published").length}
          </strong>
        </div>

        <div className="admin-card">
          <span>Drafts</span>
          <strong>
            {projects.filter((project) => project.status === "draft").length}
          </strong>
        </div>

        <div className="admin-card">
          <span>Featured</span>
          <strong>
            {projects.filter((project) => project.isFeatured).length}
          </strong>
        </div>
      </div>

      {error && (
        <div className="admin-project-error" role="alert">
          {error}
        </div>
      )}

      <section className="admin-card admin-project-list">
        <div className="admin-project-list-heading">
          <div>
            <h2>All Projects</h2>
            <p>Your portfolio project collection</p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={() => void loadProjects()}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <div className="admin-project-empty">
            Loading projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="admin-project-empty">
            <h3>No projects found</h3>
            <p>Add your first project to get started.</p>
          </div>
        ) : (
          <div className="admin-project-table-wrapper">
            <table className="admin-project-table">
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Technologies</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {projects.map((project) => (
                  <tr key={project._id}>
                    <td>
                      <div className="admin-project-name">
                        {project.thumbnail ? (
                          <img
                            src={project.thumbnail}
                            alt=""
                            className="admin-project-thumbnail"
                          />
                        ) : (
                          <div className="admin-project-thumbnail-placeholder">
                            {project.title.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div>
                          <strong>{project.title}</strong>
                          <span>/{project.slug}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="admin-project-tech">
                        {project.techStack?.length
                          ? project.techStack.slice(0, 3).join(", ")
                          : "Not specified"}
                        {project.techStack?.length > 3 &&
                          ` +${project.techStack.length - 3}`}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`admin-project-status ${project.status}`}
                      >
                        {project.status}
                      </span>
                    </td>

                    <td>
                      {project.isFeatured ? "Yes" : "No"}
                    </td>

                    <td>
                      <div className="admin-project-actions">
                        <Link
                          href={`/admin/projects/${project._id}/edit`}
                          className="admin-project-action"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          className="admin-project-action"
                          onClick={() => void toggleStatus(project)}
                          disabled={actionId === project._id}
                        >
                          {actionId === project._id
                            ? "Please wait..."
                            : project.status === "published"
                              ? "Unpublish"
                              : "Publish"}
                        </button>

                        <button
                          type="button"
                          className="admin-project-action danger"
                          onClick={() => void deleteProject(project)}
                          disabled={actionId === project._id}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}