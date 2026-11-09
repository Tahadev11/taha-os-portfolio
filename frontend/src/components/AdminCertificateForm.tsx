
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { adminCertificateService } from "@/services/adminCertifciateService";
import { adminProjectService } from "@/services/adminProjectService";

import type {
  Certificate,
  CreateCertificateData,
} from "@/types/certificates";

interface AdminCertificateFormProps {
  mode: "create" | "edit";
}

const initialFormData: CreateCertificateData = {
  title: "",
  issuer: "",
  issueDate: new Date().toISOString().slice(0, 10),
  expiryDate: "",
  credentialId: "",
  credentialUrl: "",
  imageUrl: "",
  description: "",
  skills: [],
  sortOrder: 0,
  isVisible: true,
};

function formatDate(value?: string): string {
  if (!value) return "";

  // Handles both ISO date strings and date-only strings.
  return value.slice(0, 10);
}

export default function AdminCertificateForm({
  mode,
}: AdminCertificateFormProps) {
  const router = useRouter();
  const params = useParams();

  const certificateId =
    typeof params.id === "string" ? params.id : "";

  const [formData, setFormData] =
    useState<CreateCertificateData>(initialFormData);

  const [skillsText, setSkillsText] = useState("");
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const loadCertificate = useCallback(async () => {
    if (!certificateId) {
      setError("Certificate ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const certificate: Certificate =
        await adminCertificateService.getById(certificateId);

      setFormData({
        title: certificate.title || "",
        issuer: certificate.issuer || "",
        issueDate: formatDate(certificate.issueDate),
        expiryDate: formatDate(certificate.expiryDate),
        credentialId: certificate.credentialId || "",
        credentialUrl: certificate.credentialUrl || "",
        imageUrl: certificate.imageUrl || "",
        description: certificate.description || "",
        skills: certificate.skills || [],
        sortOrder: certificate.sortOrder ?? 0,
        isVisible: certificate.isVisible ?? true,
      });

      setSkillsText((certificate.skills || []).join(", "));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load certificate."
      );
    } finally {
      setLoading(false);
    }
  }, [certificateId]);

  useEffect(() => {
    if (mode === "edit") {
      void loadCertificate();
    }
  }, [mode, loadCertificate]);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const target = event.target;
    const { name, value } = target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setFormData((previous) => ({
        ...previous,
        [name]: target.checked,
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]:
        target instanceof HTMLInputElement &&
        target.type === "number"
          ? Number(value)
          : value,
    }));
  }

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    // Allow selecting the same file again later.
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must not exceed 10 MB.");
      return;
    }

    try {
      setUploading(true);
      setError("");

      const result = await adminProjectService.uploadFile(file);

      setFormData((previous) => ({
        ...previous,
        imageUrl: result.url,
      }));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Certificate image upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!formData.title.trim()) {
      setError("Please enter the certificate title.");
      return;
    }

    if (!formData.issuer.trim()) {
      setError("Please enter the issuing organization.");
      return;
    }

    if (!formData.issueDate) {
      setError("Please select the issue date.");
      return;
    }

    if (
      formData.expiryDate &&
      formData.expiryDate < formData.issueDate
    ) {
      setError("Expiry date cannot be earlier than the issue date.");
      return;
    }

    if (formData.sortOrder < 0) {
      setError("Display order cannot be negative.");
      return;
    }

    if (uploading) {
      setError("Please wait for the image upload to finish.");
      return;
    }

    const relatedSkills = skillsText
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const payload: CreateCertificateData = {
      ...formData,
      title: formData.title.trim(),
      issuer: formData.issuer.trim(),
      issueDate: formData.issueDate,
      skills: relatedSkills,
      ...(formData.expiryDate
        ? { expiryDate: formData.expiryDate }
        : { expiryDate: undefined }),
      credentialId: formData.credentialId?.trim() || "",
      credentialUrl: formData.credentialUrl?.trim() || "",
      imageUrl: formData.imageUrl || "",
      description: formData.description?.trim() || "",
    };

    try {
      setSaving(true);

      if (mode === "create") {
        await adminCertificateService.create(payload);
      } else {
        await adminCertificateService.update(
          certificateId,
          payload
        );
      }

      router.push("/admin/certificates");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving the certificate."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-certificate-form-page">
        <div className="admin-certificate-form-loading">
          Loading certificate details...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-certificate-form-page">
      <div className="admin-certificate-form-heading">
        <div>
          <span className="admin-eyebrow">
            CONTENT MANAGEMENT / CERTIFICATES
          </span>

          <h1>
            {mode === "create"
              ? "Add New Certificate"
              : "Edit Certificate"}
          </h1>

          <p>
            {mode === "create"
              ? "Add a professional certificate to your portfolio."
              : "Update your certificate information and credentials."}
          </p>
        </div>

        <Link
          href="/admin/certificates"
          className="admin-certificate-back-button"
        >
          ← Back to Certificates
        </Link>
      </div>

      <form
        className="admin-certificate-form-card"
        onSubmit={handleSubmit}
      >
        {error && (
          <div className="admin-project-error" role="alert">
            {error}
          </div>
        )}

        <div className="admin-certificate-form-section">
          <h2>Certificate Information</h2>
          <p>Enter the main details of your certificate.</p>

          <div className="admin-certificate-form-grid">
            <div className="admin-certificate-field">
              <label htmlFor="title">Certificate Title *</label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Python for Everybody"
                value={formData.title}
                onChange={handleChange}
                maxLength={200}
                required
              />
            </div>

            <div className="admin-certificate-field">
              <label htmlFor="issuer">Issuing Organization *</label>
              <input
                id="issuer"
                name="issuer"
                type="text"
                placeholder="e.g. Coursera"
                value={formData.issuer}
                onChange={handleChange}
                maxLength={150}
                required
              />
            </div>

            <div className="admin-certificate-field">
              <label htmlFor="issueDate">Issue Date *</label>
              <input
                id="issueDate"
                name="issueDate"
                type="date"
                value={formData.issueDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-certificate-field">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                id="expiryDate"
                name="expiryDate"
                type="date"
                value={formData.expiryDate || ""}
                onChange={handleChange}
              />

              <span className="admin-certificate-field-hint">
                Leave empty if the certificate does not expire.
              </span>
            </div>

            <div className="admin-certificate-field">
              <label htmlFor="credentialId">Credential ID</label>
              <input
                id="credentialId"
                name="credentialId"
                type="text"
                placeholder="Certificate ID"
                value={formData.credentialId || ""}
                onChange={handleChange}
                maxLength={200}
              />
            </div>

            <div className="admin-certificate-field">
              <label htmlFor="credentialUrl">
                Credential Verification URL
              </label>
              <input
                id="credentialUrl"
                name="credentialUrl"
                type="url"
                placeholder="https://example.com/verify"
                value={formData.credentialUrl || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="admin-certificate-field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={5}
              placeholder="Describe what you learned or achieved..."
              value={formData.description || ""}
              onChange={handleChange}
              maxLength={2000}
            />
          </div>

          <div className="admin-certificate-field">
            <label htmlFor="skills">
              Related Skills
            </label>
            <input
              id="skills"
              type="text"
              placeholder="Python, Django, SQL"
              value={skillsText}
              onChange={(event) =>
                setSkillsText(event.target.value)
              }
            />

            <span className="admin-certificate-field-hint">
              Separate multiple skills with commas.
            </span>
          </div>
        </div>

        <div className="admin-certificate-form-section">
          <h2>Certificate Image</h2>
          <p>
            Upload an image of your certificate. JPG, PNG, WEBP
            and GIF are supported (maximum 10 MB).
          </p>

          {formData.imageUrl && (
            <div className="admin-certificate-image-preview">
              <img
                src={formData.imageUrl}
                alt="Certificate preview"
              />

              <button
                type="button"
                className="admin-project-action danger"
                onClick={() =>
                  setFormData((previous) => ({
                    ...previous,
                    imageUrl: "",
                  }))
                }
              >
                Remove Image
              </button>
            </div>
          )}

          <div className="admin-certificate-upload">
            <input
              id="certificateImage"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageUpload}
              disabled={uploading}
            />

            {uploading && (
              <span>Uploading certificate image...</span>
            )}
          </div>
        </div>

        <div className="admin-certificate-form-section">
          <h2>Display Settings</h2>
          <p>Control the order and visibility of this certificate.</p>

          <div className="admin-certificate-field admin-certificate-order">
            <label htmlFor="sortOrder">Display Order</label>
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              min="0"
              value={formData.sortOrder}
              onChange={handleChange}
            />

            <span className="admin-certificate-field-hint">
              Lower numbers appear first.
            </span>
          </div>

          <label className="admin-certificate-visibility-toggle">
            <input
              type="checkbox"
              name="isVisible"
              checked={formData.isVisible}
              onChange={handleChange}
            />

            <span>
              <strong>Show this certificate on my portfolio</strong>
              <small>
                {formData.isVisible
                  ? "Visitors can see this certificate."
                  : "This certificate will be hidden from visitors."}
              </small>
            </span>
          </label>
        </div>

        <div className="admin-certificate-form-footer">
          <Link
            href="/admin/certificates"
            className="admin-certificate-cancel-button"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="admin-button"
            disabled={saving || uploading}
          >
            {saving
              ? "Saving..."
              : mode === "create"
                ? "Create Certificate"
                : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
