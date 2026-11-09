
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

import { adminResumeService } from "@/services/adminResumeService";
import type { Resume } from "@/types/resume";

export default function AdminResumeClient() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadResumes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await adminResumeService.getAll();
      setResumes(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load resumes."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadResumes();
  }, [loadResumes]);

  const handleToggleActive = async (resume: Resume) => {
    const action = resume.isActive ? "deactivate" : "activate";

    if (
      !window.confirm(
        `Are you sure you want to ${action} "${resume.title}"?`
      )
    ) {
      return;
    }

    try {
      setProcessingId(resume._id);
      setError("");

      await adminResumeService.update(resume._id, {
        isActive: !resume.isActive,
      });

      await loadResumes();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update resume status."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (resume: Resume) => {
    if (
      !window.confirm(
        `Delete "${resume.title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      setProcessingId(resume._id);
      setError("");

      await adminResumeService.delete(resume._id);
      await loadResumes();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete resume."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes <= 0) return "Unknown";

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const formatDate = (date?: string) => {
    if (!date) return "Unknown";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "Unknown";

    return parsedDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const activeCount = resumes.filter((resume) => resume.isActive).length;
  const inactiveCount = resumes.length - activeCount;

  return (
    <div className="admin-page admin-resume-page">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <span className="admin-eyebrow">CONTENT MANAGEMENT</span>
          <h1>Resume Management</h1>
          <p>
            Upload and manage the resume displayed on your public portfolio.
          </p>
        </div>

        <Link
          href="/admin/resume/new"
          className="admin-primary-button"
        >
          <span>+</span> Upload Resume
        </Link>
      </div>

      {/* Statistics */}
      <div className="admin-resume-stats">
        <div className="admin-resume-stat">
          <span>Total Resumes</span>
          <strong>{resumes.length}</strong>
          <small>All uploaded documents</small>
        </div>

        <div className="admin-resume-stat">
          <span>Active Resume</span>
          <strong>{activeCount}</strong>
          <small>Currently displayed publicly</small>
        </div>

        <div className="admin-resume-stat">
          <span>Inactive Resumes</span>
          <strong>{inactiveCount}</strong>
          <small>Stored but not displayed</small>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="admin-resume-error">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")}>
            Dismiss
          </button>
        </div>
      )}

      {/* Table Card */}
      <div className="admin-resume-table-card">
        <div className="admin-resume-table-heading">
          <div>
            <h2>Uploaded Resumes</h2>
            <p>Manage your uploaded PDF documents.</p>
          </div>

          <button
            type="button"
            className="admin-secondary-button"
            onClick={() => void loadResumes()}
            disabled={loading}
          >
            {loading ? "Loading..." : "↻ Refresh"}
          </button>
        </div>

        {loading ? (
          <div className="admin-resume-empty">
            <div className="admin-resume-loading-indicator" />
            <p>Loading resumes...</p>
          </div>
        ) : resumes.length === 0 ? (
          <div className="admin-resume-empty">
            <div className="admin-resume-empty-icon">PDF</div>
            <h3>No resumes uploaded yet</h3>
            <p>
              Upload your first resume PDF to make it available on your
              portfolio.
            </p>

            <Link
              href="/admin/resume/new"
              className="admin-primary-button"
            >
              Upload Your Resume
            </Link>
          </div>
        ) : (
          <div className="admin-resume-table-wrapper">
            <table className="admin-resume-table">
              <thead>
                <tr>
                  <th>Resume</th>
                  <th>File Details</th>
                  <th>Upload Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {resumes.map((resume) => (
                  <tr key={resume._id}>
                    <td>
                      <div className="admin-resume-title">
                        <div className="admin-resume-file-icon">
                          PDF
                        </div>

                        <div className="admin-resume-title-info">
                          <strong>{resume.title}</strong>
                          <small>
                            {resume.description ||
                              "No description provided"}
                          </small>
                        </div>
                      </div>
                    </td>

                    <td>
                      <strong className="admin-resume-filename">
                        {resume.fileName || "Resume.pdf"}
                      </strong>
                      <small>
                        {formatFileSize(resume.fileSize)}
                      </small>
                    </td>

                    <td>{formatDate(resume.createdAt)}</td>

                    <td>
                      <span
                        className={`admin-resume-badge ${
                          resume.isActive ? "active" : "inactive"
                        }`}
                      >
                        <span className="admin-resume-status-dot" />
                        {resume.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="admin-resume-actions">
<a
  href="/resume/view"
  target="_blank"
  rel="noopener noreferrer"
  className="view"
>
  View
</a>

                        <a
                          href={resume.fileUrl}
                          download={resume.fileName || "resume.pdf"}
                          className="download"
                        >
                          Download
                        </a>

                        <Link
                          href={`/admin/resume/${resume._id}/edit`}
                          className="edit"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          className="toggle"
                          disabled={processingId === resume._id}
                          onClick={() => void handleToggleActive(resume)}
                        >
                          {processingId === resume._id
                            ? "Please wait..."
                            : resume.isActive
                              ? "Deactivate"
                              : "Activate"}
                        </button>

                        <button
                          type="button"
                          className="delete"
                          disabled={processingId === resume._id}
                          onClick={() => void handleDelete(resume)}
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
      </div>
    </div>
  );
}
