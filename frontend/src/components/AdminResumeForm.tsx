
"use client";

import { useEffect, useState, type FormEvent, type ChangeEvent } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { adminResumeService } from "@/services/adminResumeService";
import type { Resume } from "@/types/resume";

interface AdminResumeFormProps {
  mode: "create" | "edit";
}

export default function AdminResumeForm({
  mode,
}: AdminResumeFormProps) {
  const router = useRouter();
  const params = useParams();
  const resumeId = params.id as string | undefined;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  const [existingResume, setExistingResume] =
    useState<Resume | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(mode === "edit");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode !== "edit") return;

    if (!resumeId) {
      setError("Resume ID is missing.");
      setLoading(false);
      return;
    }

    const loadResume = async () => {
      try {
        setLoading(true);
        setError("");

        const resume = await adminResumeService.getById(resumeId);

        setExistingResume(resume);
        setTitle(resume.title);
        setDescription(resume.description || "");
        setIsActive(resume.isActive);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load resume."
        );
      } finally {
        setLoading(false);
      }
    };

    void loadResume();
  }, [mode, resumeId]);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    setError("");

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("PDF file size must not exceed 10 MB.");
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please enter a resume title.");
      return;
    }

    if (mode === "create" && !file) {
      setError("Please select a PDF file to upload.");
      return;
    }

    if (mode === "edit" && !resumeId) {
      setError("Resume ID is missing.");
      return;
    }

    try {
      setSaving(true);

      let fileUrl = existingResume?.fileUrl || "";
      let fileName = existingResume?.fileName || "";
      let fileSize = existingResume?.fileSize ?? 0;

      if (file) {
        setUploading(true);

        const uploadedFile =
          await adminResumeService.uploadFile(file);

        fileUrl = uploadedFile.url;
        fileName = uploadedFile.fileName;
        fileSize = uploadedFile.fileSize;

        setUploading(false);
      }

      if (!fileUrl) {
        throw new Error("Please upload a PDF file.");
      }

      const payload = {
        title: title.trim(),
        description: description.trim(),
        fileUrl,
        fileName,
        fileSize,
        isActive,
      };

      if (mode === "create") {
        await adminResumeService.create(payload);
      } else {
        await adminResumeService.update(resumeId!, payload);
      }

      router.push("/admin/resume");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page admin-resume-page">
        <div className="admin-resume-empty">
          <p>Loading resume details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page admin-resume-page">
      <div className="admin-page-header">
        <div>
          <span className="admin-eyebrow">
            CONTENT MANAGEMENT
          </span>

          <h1>
            {mode === "create" ? "Upload Resume" : "Edit Resume"}
          </h1>

          <p>
            {mode === "create"
              ? "Upload a new PDF resume to your portfolio."
              : "Update your resume information or replace its PDF file."}
          </p>
        </div>

        <Link
          href="/admin/resume"
          className="admin-secondary-button"
        >
          Back to Resumes
        </Link>
      </div>

      {error && (
        <div className="admin-resume-error">
          <span>{error}</span>
        </div>
      )}

      <form
        className="admin-resume-form"
        onSubmit={handleSubmit}
      >
        <div className="admin-resume-form-section">
          <h2>Resume Information</h2>

          <div className="admin-resume-form-grid">
            <div className="admin-resume-form-group full-width">
              <label htmlFor="resume-title">
                Resume Title *
              </label>

              <input
                id="resume-title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="e.g. Taha Siddique - Software Engineer"
                required
                maxLength={150}
              />
            </div>

            <div className="admin-resume-form-group full-width">
              <label htmlFor="resume-description">
                Description
              </label>

              <textarea
                id="resume-description"
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="A short description of this resume..."
                rows={4}
                maxLength={1000}
              />
            </div>
          </div>
        </div>

        <div className="admin-resume-form-section">
          <h2>Resume PDF</h2>

          {existingResume && (
            <div className="admin-resume-current-file">
              <div className="admin-resume-file-icon">
                PDF
              </div>

              <div>
                <strong>Current PDF</strong>
                <span>{existingResume.fileName || "Resume.pdf"}</span>
              </div>

<a
  href="/resume/view"
  target="_blank"
  rel="noopener noreferrer"
>
  View Resume
</a>
            </div>
          )}

          <div className="admin-resume-form-group full-width">
            <label htmlFor="resume-file">
              {mode === "create"
                ? "Select Resume PDF *"
                : "Replace Resume PDF (Optional)"}
            </label>

            <div className="admin-resume-upload-box">
              <input
                id="resume-file"
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
              />

              <p>
                {file
                  ? `Selected: ${file.name}`
                  : mode === "edit"
                    ? "Choose a new PDF if you want to replace the current file."
                    : "Choose a PDF file to upload."}
              </p>

              <small>
                PDF only. Maximum file size: 10 MB.
              </small>
            </div>
          </div>
        </div>

        <div className="admin-resume-form-section">
          <h2>Publication Settings</h2>

          <label className="admin-resume-form-checkbox">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(event) =>
                setIsActive(event.target.checked)
              }
            />

            <span>
              <strong>Set as active resume</strong>
              <small>
                The active resume will be displayed on your public portfolio.
                Activating this resume deactivates other resumes.
              </small>
            </span>
          </label>
        </div>

        <div className="admin-resume-form-actions">
          <Link
            href="/admin/resume"
            className="admin-secondary-button"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="admin-primary-button"
            disabled={saving || uploading}
          >
            {uploading
              ? "Uploading PDF..."
              : saving
                ? "Saving..."
                : mode === "create"
                  ? "Upload Resume"
                  : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
