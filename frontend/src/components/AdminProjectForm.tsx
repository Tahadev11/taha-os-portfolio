
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  adminProjectService,
  type CreateProjectData,
} from "@/services/adminProjectService";
import ProjectImageUploader from "@/components/ProjectImageUploader";

function createSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function AdminProjectForm() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [techStack, setTechStack] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [sortOrder, setSortOrder] = useState("0");
  const [status, setStatus] = useState<"draft" | "published">("draft");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleTitleChange(value: string) {
    setTitle(value);

    if (!slugEdited) {
      setSlug(createSlug(value));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (
      !title.trim() ||
      !slug.trim() ||
      !shortDescription.trim() ||
      !description.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    const order = Number(sortOrder);

    if (!Number.isInteger(order) || order < 0) {
      setError("Display order must be a non-negative whole number.");
      return;
    }

    const projectData: CreateProjectData = {
      title: title.trim(),
      slug: createSlug(slug),
      shortDescription: shortDescription.trim(),
      description: description.trim(),

      techStack: techStack
        .split(/[,\n]/)
        .map((item) => item.trim())
        .filter(Boolean),

      thumbnail: thumbnail.trim(),
      gallery,

      githubUrl: githubUrl.trim(),
      liveUrl: liveUrl.trim(),
      isFeatured,
      sortOrder: order,
      status,
    };

    try {
      setLoading(true);

      await adminProjectService.create(projectData);

      router.push("/admin/projects");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to create project. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-project-form-page">
      <div className="admin-project-form-heading">
        <div>
          <span className="admin-eyebrow">
            CONTENT MANAGEMENT / PROJECTS / NEW
          </span>
          <h1>Add New Project</h1>
          <p>Enter the details of your project below.</p>
        </div>

        <Link href="/admin/projects" className="admin-back-link">
          ← Back to Projects
        </Link>
      </div>

      {error && (
        <div className="admin-project-error" role="alert">
          {error}
        </div>
      )}

      <form className="admin-project-form" onSubmit={handleSubmit}>
        {/* Basic Information */}
        <section className="admin-card admin-form-section">
          <div className="admin-form-section-heading">
            <h2>Basic Information</h2>
            <p>Project name and public descriptions</p>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label htmlFor="project-title">Project Title *</label>
              <input
                id="project-title"
                value={title}
                onChange={(event) => handleTitleChange(event.target.value)}
                placeholder="e.g. SkillsConnect"
                required
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="project-slug">Project Slug *</label>
              <input
                id="project-slug"
                value={slug}
                onChange={(event) => {
                  setSlug(event.target.value);
                  setSlugEdited(true);
                }}
                placeholder="skillsconnect"
                required
              />
              <small>
                URL-friendly identifier. Generated from the title by default.
              </small>
            </div>

            <div className="admin-form-field full-width">
              <label htmlFor="project-short-description">
                Short Description *
              </label>
              <textarea
                id="project-short-description"
                value={shortDescription}
                onChange={(event) => setShortDescription(event.target.value)}
                placeholder="A short summary displayed on project cards..."
                rows={3}
                required
              />
            </div>

            <div className="admin-form-field full-width">
              <label htmlFor="project-description">
                Full Description *
              </label>
              <textarea
                id="project-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the project, its features, purpose, and implementation..."
                rows={7}
                required
              />
            </div>
          </div>
        </section>

        {/* Technologies and Images */}
        <section className="admin-card admin-form-section">
          <div className="admin-form-section-heading">
            <h2>Technologies & Media</h2>
            <p>Technology stack and project images</p>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-field full-width">
              <label htmlFor="project-tech-stack">Technology Stack</label>
              <textarea
                id="project-tech-stack"
                value={techStack}
                onChange={(event) => setTechStack(event.target.value)}
                placeholder="Next.js, TypeScript, NestJS, MongoDB"
                rows={3}
              />
              <small>Separate technologies with commas or new lines.</small>
            </div>

            <div className="admin-form-field full-width">
              <ProjectImageUploader
                thumbnail={thumbnail}
                gallery={gallery}
                onThumbnailChange={setThumbnail}
                onGalleryChange={setGallery}
              />
            </div>
          </div>
        </section>

        {/* Project Links */}
        <section className="admin-card admin-form-section">
          <div className="admin-form-section-heading">
            <h2>Project Links</h2>
            <p>External links to your project</p>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label htmlFor="project-github">GitHub URL</label>
              <input
                id="project-github"
                type="url"
                value={githubUrl}
                onChange={(event) => setGithubUrl(event.target.value)}
                placeholder="https://github.com/username/project"
              />
            </div>

            <div className="admin-form-field">
              <label htmlFor="project-live">Live Demo URL</label>
              <input
                id="project-live"
                type="url"
                value={liveUrl}
                onChange={(event) => setLiveUrl(event.target.value)}
                placeholder="https://your-project.com"
              />
            </div>
          </div>
        </section>

        {/* Publishing and Organization */}
        <section className="admin-card admin-form-section">
          <div className="admin-form-section-heading">
            <h2>Publishing & Organization</h2>
            <p>Control visibility and project ordering</p>
          </div>

          <div className="admin-form-grid">
            <div className="admin-form-field">
              <label htmlFor="project-status">Publication Status</label>
              <select
                id="project-status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as "draft" | "published")
                }
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="admin-form-field">
              <label htmlFor="project-sort-order">Display Order</label>
              <input
                id="project-sort-order"
                type="number"
                min="0"
                step="1"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value)}
              />
              <small>Lower numbers appear first.</small>
            </div>

            <div className="admin-form-field full-width">
              <label className="admin-featured-checkbox">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(event) => setIsFeatured(event.target.checked)}
                />
                <span>
                  <strong>Featured Project</strong>
                  <small>
                    Highlight this project in your portfolio.
                  </small>
                </span>
              </label>
            </div>
          </div>
        </section>

        {/* Form Actions */}
        <div className="admin-form-actions">
          <Link href="/admin/projects" className="admin-cancel-button">
            Cancel
          </Link>

          <button
            type="submit"
            className="admin-button"
            disabled={loading}
          >
            {loading ? "Creating Project..." : "Create Project →"}
          </button>
        </div>
      </form>
    </div>
  );
}
