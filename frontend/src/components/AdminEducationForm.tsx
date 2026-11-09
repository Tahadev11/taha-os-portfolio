
"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { adminEducationService } from "@/services/adminEducationService";

import type {
  CreateEducationData,
  Education,
} from "@/types/education";

interface AdminEducationFormProps {
  mode: "create" | "edit";
}

const initialFormData: CreateEducationData = {
  degree: "",
  institution: "",
  fieldOfStudy: "",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  grade: "",
  description: "",
  sortOrder: 0,
  isVisible: true,
};

export default function AdminEducationForm({
  mode,
}: AdminEducationFormProps) {
  const router = useRouter();
  const params = useParams();

  const id = typeof params.id === "string" ? params.id : "";

  const [formData, setFormData] =
    useState<CreateEducationData>(initialFormData);

  const [loading, setLoading] = useState(mode === "edit");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode !== "edit" || !id) return;

    let active = true;

    const loadEducation = async () => {
      try {
        setLoading(true);
        setError("");

        const education: Education =
          await adminEducationService.getById(id);

        if (!active) return;

        setFormData({
          degree: education.degree || "",
          institution: education.institution || "",
          fieldOfStudy: education.fieldOfStudy || "",
          location: education.location || "",
          startDate: education.startDate
            ? education.startDate.substring(0, 10)
            : "",
          endDate: education.endDate
            ? education.endDate.substring(0, 10)
            : "",
          isCurrent: education.isCurrent ?? false,
          grade: education.grade || "",
          description: education.description || "",
          sortOrder: education.sortOrder ?? 0,
          isVisible: education.isVisible ?? true,
        });
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load education record."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadEducation();

    return () => {
      active = false;
    };
  }, [mode, id]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = event.target;

    const checked =
      type === "checkbox" &&
      event.target instanceof HTMLInputElement
        ? event.target.checked
        : false;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : name === "sortOrder"
            ? Number(value)
            : value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (mode === "edit" && !id) {
      setError("Education record ID is missing.");
      return;
    }

    if (
      formData.endDate &&
      formData.startDate &&
      !formData.isCurrent &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      setError("End date cannot be earlier than start date.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const payload: CreateEducationData = {
        ...formData,
        endDate: formData.isCurrent
          ? null
          : formData.endDate || null,
      };

      if (mode === "create") {
        await adminEducationService.create(payload);
      } else {
        await adminEducationService.update(id, payload);
      }

      router.push("/admin/education");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save education record."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-page admin-education-page">
        <div className="admin-education-empty">
          <p>Loading education record...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page admin-education-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <span className="admin-eyebrow">
            ACADEMIC MANAGEMENT
          </span>

          <h1>
            {mode === "create"
              ? "Add Education"
              : "Edit Education"}
          </h1>

          <p>
            {mode === "create"
              ? "Add a new academic qualification to your portfolio."
              : "Update your academic qualification details."}
          </p>
        </div>

        <Link
          href="/admin/education"
          className="admin-secondary-button"
        >
          Back to Education
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="admin-education-error">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="admin-education-form"
      >
        {/* Education Information */}
        <div className="admin-education-form-section">
          <h2>Education Information</h2>

          <div className="admin-education-form-grid">
            <div className="admin-education-form-group">
              <label htmlFor="degree">
                Degree / Qualification *
              </label>

              <input
                id="degree"
                name="degree"
                type="text"
                value={formData.degree}
                onChange={handleChange}
                placeholder="e.g. Bachelor of Science"
                required
              />
            </div>

            <div className="admin-education-form-group">
              <label htmlFor="institution">
                Institution *
              </label>

              <input
                id="institution"
                name="institution"
                type="text"
                value={formData.institution}
                onChange={handleChange}
                placeholder="e.g. University of Sindh"
                required
              />
            </div>

            <div className="admin-education-form-group">
              <label htmlFor="fieldOfStudy">
                Field of Study
              </label>

              <input
                id="fieldOfStudy"
                name="fieldOfStudy"
                type="text"
                value={formData.fieldOfStudy || ""}
                onChange={handleChange}
                placeholder="e.g. Software Engineering"
              />
            </div>

            <div className="admin-education-form-group">
              <label htmlFor="location">
                Location
              </label>

              <input
                id="location"
                name="location"
                type="text"
                value={formData.location || ""}
                onChange={handleChange}
                placeholder="e.g. Jamshoro, Pakistan"
              />
            </div>

            <div className="admin-education-form-group">
              <label htmlFor="grade">
                Grade / CGPA
              </label>

              <input
                id="grade"
                name="grade"
                type="text"
                value={formData.grade || ""}
                onChange={handleChange}
                placeholder="e.g. 2.65 / 4.00"
              />
            </div>

            <div className="admin-education-form-group">
              <label htmlFor="sortOrder">
                Display Order
              </label>

              <input
                id="sortOrder"
                name="sortOrder"
                type="number"
                min="0"
                value={formData.sortOrder}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* Study Duration */}
        <div className="admin-education-form-section">
          <h2>Study Duration</h2>

          <div className="admin-education-form-grid">
            <div className="admin-education-form-group">
              <label htmlFor="startDate">
                Start Date *
              </label>

              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-education-form-group">
              <label htmlFor="endDate">
                End Date
              </label>

              <input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate || ""}
                onChange={handleChange}
                disabled={formData.isCurrent}
                required={!formData.isCurrent}
              />
            </div>
          </div>

          <label className="admin-education-form-checkbox">
            <input
              type="checkbox"
              name="isCurrent"
              checked={formData.isCurrent}
              onChange={handleChange}
            />

            <span>
              I am currently studying here
            </span>
          </label>
        </div>

        {/* Additional Information */}
        <div className="admin-education-form-section">
          <h2>Additional Information</h2>

          <div className="admin-education-form-group">
            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Add details about your education, achievements, or academic activities..."
              rows={5}
            />
          </div>
        </div>

        {/* Visibility */}
        <div className="admin-education-form-section">
          <label className="admin-education-form-checkbox">
            <input
              type="checkbox"
              name="isVisible"
              checked={formData.isVisible}
              onChange={handleChange}
            />

            <span>
              Display this education record on the public portfolio
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="admin-education-form-actions">
          <Link
            href="/admin/education"
            className="admin-secondary-button"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="admin-primary-button"
            disabled={submitting}
          >
            {submitting
              ? "Saving..."
              : mode === "create"
                ? "Add Education"
                : "Update Education"}
          </button>
        </div>
      </form>
    </div>
  );
}
