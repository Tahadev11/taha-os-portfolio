
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { adminExperienceService } from "@/services/adminExperienceService";
import type {
  Experience,
  ExperienceType,
} from "@/types/experience";

type ExperienceFilter = "all" | "visible" | "hidden";

const experienceTypeLabels: Record<ExperienceType, string> = {
  employment: "Employment",
  internship: "Internship",
  training: "Training",
  freelance: "Freelance",
};

export default function AdminExperienceClient() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [visibility, setVisibility] =
    useState<ExperienceFilter>("all");

  const loadExperiences = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await adminExperienceService.getAll();
      setExperiences(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load experiences."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadExperiences();
  }, [loadExperiences]);

  const filteredExperiences = useMemo(() => {
    return experiences
      .filter((experience) => {
        const searchValue = search.toLowerCase().trim();

        const matchesSearch =
          !searchValue ||
          experience.position.toLowerCase().includes(searchValue) ||
          experience.organization.toLowerCase().includes(searchValue) ||
          experience.location.toLowerCase().includes(searchValue) ||
          experience.techStack.some((tech) =>
            tech.toLowerCase().includes(searchValue)
          );

        const matchesType =
          selectedType === "all" ||
          experience.type === selectedType;

        const matchesVisibility =
          visibility === "all" ||
          (visibility === "visible" && experience.isVisible) ||
          (visibility === "hidden" && !experience.isVisible);

        return (
          matchesSearch &&
          matchesType &&
          matchesVisibility
        );
      })
      .sort((a, b) => {
        if (a.sortOrder !== b.sortOrder) {
          return a.sortOrder - b.sortOrder;
        }

        return (
          new Date(b.startDate).getTime() -
          new Date(a.startDate).getTime()
        );
      });
  }, [experiences, search, selectedType, visibility]);

  const visibleCount = experiences.filter(
    (experience) => experience.isVisible
  ).length;

  const currentCount = experiences.filter(
    (experience) => experience.isCurrent
  ).length;

  const internshipCount = experiences.filter(
    (experience) => experience.type === "internship"
  ).length;

  const handleToggleVisibility = async (
    experience: Experience
  ) => {
    try {
      setActionId(experience._id);
      setError("");

      await adminExperienceService.update(experience._id, {
        isVisible: !experience.isVisible,
      });

      await loadExperiences();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update experience visibility."
      );
    } finally {
      setActionId(null);
    }
  };

  const handleDelete = async (experience: Experience) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${experience.position}" at "${experience.organization}"?`
    );

    if (!confirmed) return;

    try {
      setActionId(experience._id);
      setError("");

      await adminExperienceService.delete(experience._id);
      await loadExperiences();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to delete experience."
      );
    } finally {
      setActionId(null);
    }
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "Present";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="admin-experience-page">
      <div className="admin-experience-heading">
        <div>
          <span className="admin-eyebrow">
            PORTFOLIO MANAGEMENT
          </span>

          <h1>Experience</h1>

          <p>
            Manage your professional experience, internships,
            training, and freelance work.
          </p>
        </div>

        <Link
          href="/admin/experience/new"
          className="admin-button"
        >
          + Add Experience
        </Link>
      </div>

      <div className="admin-experience-summary">
        <div className="admin-card">
          <span>Total Experience</span>
          <strong>{experiences.length}</strong>
        </div>

        <div className="admin-card">
          <span>Visible</span>
          <strong>{visibleCount}</strong>
        </div>

        <div className="admin-card">
          <span>Currently Working</span>
          <strong>{currentCount}</strong>
        </div>

        <div className="admin-card">
          <span>Internships</span>
          <strong>{internshipCount}</strong>
        </div>
      </div>

      {error && (
        <div className="admin-project-error">
          {error}
        </div>
      )}

      <section className="admin-card admin-experience-list">
        <div className="admin-experience-list-heading">
          <div>
            <h2>All Experience</h2>
            <p>
              {filteredExperiences.length} of {experiences.length}{" "}
              entries
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={() => void loadExperiences()}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </div>

        <div className="admin-experience-toolbar">
          <input
            type="search"
            placeholder="Search position, organization, location..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="admin-project-search"
          />

          <select
            value={selectedType}
            onChange={(event) =>
              setSelectedType(event.target.value)
            }
            className="admin-project-filter"
          >
            <option value="all">All Types</option>
            <option value="employment">Employment</option>
            <option value="internship">Internship</option>
            <option value="training">Training</option>
            <option value="freelance">Freelance</option>
          </select>

          <select
            value={visibility}
            onChange={(event) =>
              setVisibility(event.target.value as ExperienceFilter)
            }
            className="admin-project-filter"
          >
            <option value="all">All Visibility</option>
            <option value="visible">Visible</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>

        {loading ? (
          <div className="admin-project-empty">
            Loading experiences...
          </div>
        ) : filteredExperiences.length === 0 ? (
          <div className="admin-project-empty">
            <h3>No experiences found</h3>
            <p>
              {experiences.length === 0
                ? "Add your first experience to get started."
                : "Try changing your search or filters."}
            </p>

            {experiences.length === 0 && (
              <Link
                href="/admin/experience/new"
                className="admin-button"
              >
                + Add Experience
              </Link>
            )}
          </div>
        ) : (

<div className="admin-experience-table-wrapper">
  <table className="admin-project-table admin-experience-table">
    <thead>
      <tr>
        <th>Position</th>
        <th>Organization</th>
        <th>Type</th>
        <th>Duration</th>
        <th>Status</th>
        <th>Visibility</th>
        <th>Actions</th>
      </tr>
    </thead>

    <tbody>
      {filteredExperiences.map((experience) => (
        <tr key={experience._id}>
          <td>
            <div className="admin-experience-position">
              <strong>{experience.position}</strong>
            </div>
          </td>

          <td>
            <div className="admin-experience-organization">
              <strong>{experience.organization}</strong>
              {experience.location && (
                <small>{experience.location}</small>
              )}
            </div>
          </td>

          <td>
            <span className="admin-experience-type">
              {experienceTypeLabels[experience.type] ??
                experience.type}
            </span>
          </td>

          <td>
            <div className="admin-experience-duration">
              <span>{formatDate(experience.startDate)}</span>
              <span>—</span>
              <span>
                {experience.isCurrent
                  ? "Present"
                  : formatDate(experience.endDate)}
              </span>
            </div>
          </td>

          <td>
            {experience.isCurrent ? (
              <span className="admin-experience-current">
                Current
              </span>
            ) : (
              <span className="admin-experience-former">
                Completed
              </span>
            )}
          </td>

          <td>
            <span
              className={`admin-project-status ${
                experience.isVisible ? "published" : "draft"
              }`}
            >
              {experience.isVisible ? "Visible" : "Hidden"}
            </span>
          </td>

          <td>
            <div className="admin-project-actions">
              <Link
                href={`/admin/experience/${experience._id}/edit`}
                className="admin-project-action"
              >
                Edit
              </Link>

              <button
                type="button"
                className="admin-project-action"
                onClick={() =>
                  void handleToggleVisibility(experience)
                }
                disabled={actionId === experience._id}
              >
                {actionId === experience._id
                  ? "Please wait..."
                  : experience.isVisible
                    ? "Hide"
                    : "Show"}
              </button>

              <button
                type="button"
                className="admin-project-action danger"
                onClick={() => void handleDelete(experience)}
                disabled={actionId === experience._id}
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
    </main>
  );
}
