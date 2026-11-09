
"use client";

import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { adminExperienceService } from "@/services/adminExperienceService";
import type {
  CreateExperienceData,
  Experience,
  ExperienceType,
} from "@/types/experience";

interface AdminExperienceFormProps {
  mode: "create" | "edit";
}

interface ExperienceFormState {
  position: string;
  organization: string;
  type: ExperienceType;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  responsibilities: string;
  techStack: string;
  sortOrder: number;
  isVisible: boolean;
}

const initialFormData: ExperienceFormState = {
  position: "",
  organization: "",
  type: "employment",
  location: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  description: "",
  responsibilities: "",
  techStack: "",
  sortOrder: 0,
  isVisible: true,
};

function formatDateForInput(date?: string | null): string {
  if (!date) return "";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) return "";

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function splitCommaSeparated(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function AdminExperienceForm({
  mode,
}: AdminExperienceFormProps) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const experienceId = params?.id;

  const [formData, setFormData] =
    useState<ExperienceFormState>(initialFormData);

  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode !== "edit") return;

    if (!experienceId) {
      setError("Experience ID is missing.");
      setLoading(false);
      return;
    }

    let cancelled = false;

    const loadExperience = async () => {
      try {
        setLoading(true);
        setError("");

        const experience: Experience =
          await adminExperienceService.getById(experienceId);

        if (cancelled) return;

        setFormData({
          position: experience.position ?? "",
          organization: experience.organization ?? "",
          type: experience.type ?? "employment",
          location: experience.location ?? "",
          startDate: formatDateForInput(experience.startDate),
          endDate: formatDateForInput(experience.endDate),
          isCurrent: experience.isCurrent ?? false,
          description: experience.description ?? "",
          responsibilities: (
            experience.responsibilities ?? []
          ).join(", "),
          techStack: (experience.techStack ?? []).join(", "),
          sortOrder: experience.sortOrder ?? 0,
          isVisible: experience.isVisible ?? true,
        });
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load experience."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadExperience();

    return () => {
      cancelled = true;
    };
  }, [mode, experienceId]);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = event.target;

    if (type === "checkbox") {
      const checked = (event.target as HTMLInputElement).checked;

      setFormData((previous) => ({
        ...previous,
        [name]: checked,
        ...(name === "isCurrent" && checked
          ? { endDate: "" }
          : {}),
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      [name]:
        name === "sortOrder" ? Math.max(0, Number(value)) : value,
    }));
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");

    if (!formData.position.trim()) {
      setError("Position is required.");
      return;
    }

    if (!formData.organization.trim()) {
      setError("Organization is required.");
      return;
    }

    if (!formData.startDate) {
      setError("Start date is required.");
      return;
    }

    if (
      !formData.isCurrent &&
      formData.endDate &&
      new Date(formData.endDate) < new Date(formData.startDate)
    ) {
      setError("End date cannot be earlier than start date.");
      return;
    }

    const payload: CreateExperienceData = {
      position: formData.position.trim(),
      organization: formData.organization.trim(),
      type: formData.type,
      location: formData.location.trim(),
      startDate: new Date(
        `${formData.startDate}T00:00:00.000Z`
      ).toISOString(),
      endDate:
        formData.isCurrent || !formData.endDate
          ? null
          : new Date(
              `${formData.endDate}T00:00:00.000Z`
            ).toISOString(),
      isCurrent: formData.isCurrent,
      description: formData.description.trim(),
      responsibilities: splitCommaSeparated(
        formData.responsibilities
      ),
      techStack: splitCommaSeparated(formData.techStack),
      sortOrder: formData.sortOrder,
      isVisible: formData.isVisible,
    };

    try {
      setSaving(true);

      if (mode === "create") {
        await adminExperienceService.create(payload);
      } else {
        if (!experienceId) {
          throw new Error("Experience ID is missing.");
        }

        await adminExperienceService.update(
          experienceId,
          payload
        );
      }

      router.push("/admin/experience");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to save experience."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="admin-experience-page">
        <div className="admin-card admin-form-card">
          Loading experience...
        </div>
      </main>
    );
  }

  return (
    <main className="admin-experience-page">
      <div className="admin-experience-heading">
        <div>
          <span className="admin-eyebrow">
            PORTFOLIO MANAGEMENT
          </span>

          <h1>
            {mode === "create"
              ? "Add Experience"
              : "Edit Experience"}
          </h1>

          <p>
            {mode === "create"
              ? "Add a new professional experience to your portfolio."
              : "Update your professional experience details."}
          </p>
        </div>

        <Link
          href="/admin/experience"
          className="admin-secondary-button"
        >
          ← Back to Experience
        </Link>
      </div>

      {error && (
        <div className="admin-project-error">
          {error}
        </div>
      )}

      <form
        className="admin-card admin-form-card"
        onSubmit={handleSubmit}
      >
        <div className="admin-form-section">
          <h2>Basic Information</h2>
          <p>Enter your role and organization details.</p>

          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label htmlFor="position">Position *</label>
              <input
                id="position"
                name="position"
                type="text"
                value={formData.position}
                onChange={handleChange}
                placeholder="e.g. Backend Developer"
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="organization">
                Organization *
              </label>
              <input
                id="organization"
                name="organization"
                type="text"
                value={formData.organization}
                onChange={handleChange}
                placeholder="e.g. ABC Technologies"
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="type">Experience Type *</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="employment">Employment</option>
                <option value="internship">Internship</option>
                <option value="training">Training</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                type="text"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Hyderabad, Pakistan"
              />
            </div>
          </div>
        </div>

        <div className="admin-form-section">
          <h2>Duration</h2>
          <p>Specify when this experience started and ended.</p>

          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label htmlFor="startDate">Start Date *</label>
              <input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                disabled={formData.isCurrent}
              />
            </div>
          </div>

          <label className="admin-form-checkbox">
            <input
              type="checkbox"
              name="isCurrent"
              checked={formData.isCurrent}
              onChange={handleChange}
            />
            <span>I currently work or participate here</span>
          </label>
        </div>

        <div className="admin-form-section">
          <h2>Experience Details</h2>
          <p>
            Describe your work and the technologies you used.
          </p>

          <div className="admin-form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write a short description of this experience..."
              rows={4}
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="responsibilities">
              Responsibilities
            </label>
            <textarea
              id="responsibilities"
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              placeholder="Backend development, API integration, Database management"
              rows={4}
            />
            <small>
              Separate each responsibility with a comma.
            </small>
          </div>

          <div className="admin-form-group">
            <label htmlFor="techStack">Technology Stack</label>
            <input
              id="techStack"
              name="techStack"
              type="text"
              value={formData.techStack}
              onChange={handleChange}
              placeholder="NestJS, Node.js, MongoDB, TypeScript"
            />
            <small>
              Separate technologies with commas.
            </small>
          </div>
        </div>

        <div className="admin-form-section">
          <h2>Display Settings</h2>
          <p>Control the order and visibility on your portfolio.</p>

          <div className="admin-form-group">
            <label htmlFor="sortOrder">Sort Order</label>
            <input
              id="sortOrder"
              name="sortOrder"
              type="number"
              min="0"
              value={formData.sortOrder}
              onChange={handleChange}
            />
            <small>
              Lower numbers appear first.
            </small>
          </div>

          <label className="admin-form-checkbox">
            <input
              type="checkbox"
              name="isVisible"
              checked={formData.isVisible}
              onChange={handleChange}
            />
            <span>Show this experience on my public portfolio</span>
          </label>
        </div>

        <div className="admin-form-actions">
          <Link
            href="/admin/experience"
            className="admin-secondary-button"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="admin-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : mode === "create"
                ? "Create Experience"
                : "Update Experience"}
          </button>
        </div>
      </form>
    </main>
  );
}
