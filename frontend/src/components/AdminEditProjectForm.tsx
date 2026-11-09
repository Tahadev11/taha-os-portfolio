
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    adminProjectService,
    type AdminProject,
} from "@/services/adminProjectService";

import ProjectImageUploader from "@/components/ProjectImageUploader";

interface AdminEditProjectFormProps {
    projectId: string;
}

function createSlug(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export default function AdminEditProjectForm({
    projectId,
}: AdminEditProjectFormProps) {
    const router = useRouter();

    const [project, setProject] = useState<AdminProject | null>(null);

    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
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

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const loadProject = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            // The admin API returns all projects, including drafts.
            const projects = await adminProjectService.getAll();

            const foundProject = projects.find(
                (item) => item._id === projectId
            );

            if (!foundProject) {
                throw new Error("Project not found.");
            }

            setProject(foundProject);
            setTitle(foundProject.title);
            setSlug(foundProject.slug);
            setShortDescription(foundProject.shortDescription);
            setDescription(foundProject.description);
            setTechStack(foundProject.techStack?.join(", ") || "");
            setThumbnail(foundProject.thumbnail || "");
            setGallery(foundProject.gallery || []);
            setGithubUrl(foundProject.githubUrl || "");
            setLiveUrl(foundProject.liveUrl || "");
            setIsFeatured(foundProject.isFeatured);
            setSortOrder(String(foundProject.sortOrder ?? 0));
            setStatus(foundProject.status);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load project."
            );
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        void loadProject();
    }, [loadProject]);

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>
    ) {
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

try {
    setSaving(true);

    await adminProjectService.update(projectId, {
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
    });

    router.push("/admin/projects");
    router.refresh();
} catch (err) {
    setError(
        err instanceof Error
            ? err.message
            : "Unable to update project. Please try again."
    );
} finally {
    setSaving(false);
}
    }

    if (loading) {
        return (
            <div className="admin-project-empty">
                Loading project information...
            </div>
        );
    }

    if (!project) {
        return (
            <div className="admin-project-form-page">
                <div className="admin-project-error" role="alert">
                    {error || "Project not found."}
                </div>

                <Link href="/admin/projects" className="admin-back-link">
                    ← Back to Projects
                </Link>
            </div>
        );
    }

    return (
        <div className="admin-project-form-page">
            <div className="admin-project-form-heading">
                <div>
                    <span className="admin-eyebrow">
                        CONTENT MANAGEMENT / PROJECTS / EDIT
                    </span>

                    <h1>Edit Project</h1>

                    <p>
                        Update the information for {project.title}.
                    </p>
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
                {/* BASIC INFORMATION */}
                <section className="admin-card admin-form-section">
                    <div className="admin-form-section-heading">
                        <h2>Basic Information</h2>
                        <p>Project name and public descriptions</p>
                    </div>

                    <div className="admin-form-grid">
                        <div className="admin-form-field">
                            <label htmlFor="edit-project-title">
                                Project Title *
                            </label>

                            <input
                                id="edit-project-title"
                                value={title}
                                onChange={(event) => setTitle(event.target.value)}
                                required
                            />
                        </div>

                        <div className="admin-form-field">
                            <label htmlFor="edit-project-slug">
                                Project Slug *
                            </label>

                            <input
                                id="edit-project-slug"
                                value={slug}
                                onChange={(event) => setSlug(event.target.value)}
                                required
                            />

                            <small>
                                URL-friendly identifier. Changing it may change the
                                project's public URL.
                            </small>
                        </div>

                        <div className="admin-form-field full-width">
                            <label htmlFor="edit-project-short">
                                Short Description *
                            </label>

                            <textarea
                                id="edit-project-short"
                                value={shortDescription}
                                onChange={(event) =>
                                    setShortDescription(event.target.value)
                                }
                                rows={3}
                                required
                            />
                        </div>

                        <div className="admin-form-field full-width">
                            <label htmlFor="edit-project-description">
                                Full Description *
                            </label>

                            <textarea
                                id="edit-project-description"
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                rows={7}
                                required
                            />
                        </div>
                    </div>
                </section>

                {/* TECHNOLOGIES AND MEDIA */}
                <section className="admin-card admin-form-section">
                    <div className="admin-form-section-heading">
                        <h2>Technologies & Media</h2>
                        <p>Technology stack and project images</p>
                    </div>

                    <div className="admin-form-grid">
                        <div className="admin-form-field full-width">
                            <label htmlFor="edit-project-tech">
                                Technology Stack
                            </label>

                            <textarea
                                id="edit-project-tech"
                                value={techStack}
                                onChange={(event) =>
                                    setTechStack(event.target.value)
                                }
                                rows={3}
                            />

                            <small>
                                Separate technologies with commas or new lines.
                            </small>
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

                {/* PROJECT LINKS */}
                <section className="admin-card admin-form-section">
                    <div className="admin-form-section-heading">
                        <h2>Project Links</h2>
                        <p>External links to your project</p>
                    </div>

                    <div className="admin-form-grid">
                        <div className="admin-form-field">
                            <label htmlFor="edit-project-github">
                                GitHub URL
                            </label>

                            <input
                                id="edit-project-github"
                                type="url"
                                value={githubUrl}
                                onChange={(event) =>
                                    setGithubUrl(event.target.value)
                                }
                                placeholder="https://github.com/username/project"
                            />
                        </div>

                        <div className="admin-form-field">
                            <label htmlFor="edit-project-live">
                                Live Demo URL
                            </label>

                            <input
                                id="edit-project-live"
                                type="url"
                                value={liveUrl}
                                onChange={(event) =>
                                    setLiveUrl(event.target.value)
                                }
                                placeholder="https://your-project.com"
                            />
                        </div>
                    </div>
                </section>

                {/* PUBLISHING */}
                <section className="admin-card admin-form-section">
                    <div className="admin-form-section-heading">
                        <h2>Publishing & Organization</h2>
                        <p>Control visibility and project ordering</p>
                    </div>

                    <div className="admin-form-grid">
                        <div className="admin-form-field">
                            <label htmlFor="edit-project-status">
                                Publication Status
                            </label>

                            <select
                                id="edit-project-status"
                                value={status}
                                onChange={(event) =>
                                    setStatus(
                                        event.target.value as "draft" | "published"
                                    )
                                }
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>

                        <div className="admin-form-field">
                            <label htmlFor="edit-project-order">
                                Display Order
                            </label>

                            <input
                                id="edit-project-order"
                                type="number"
                                min="0"
                                step="1"
                                value={sortOrder}
                                onChange={(event) =>
                                    setSortOrder(event.target.value)
                                }
                            />

                            <small>Lower numbers appear first.</small>
                        </div>

                        <div className="admin-form-field full-width">
                            <label className="admin-featured-checkbox">
                                <input
                                    type="checkbox"
                                    checked={isFeatured}
                                    onChange={(event) =>
                                        setIsFeatured(event.target.checked)
                                    }
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

                {/* ACTIONS */}
                <div className="admin-form-actions">
                    <Link
                        href="/admin/projects"
                        className="admin-cancel-button"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        className="admin-button"
                        disabled={saving}
                    >
                        {saving ? "Saving Changes..." : "Save Changes →"}
                    </button>
                </div>
            </form>
        </div>
    );
}
