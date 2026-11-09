
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { adminEducationService } from "@/services/adminEducationService";
import type { Education } from "@/types/education";

type TypeFilter = "all" | "current" | "completed";
type VisibilityFilter = "all" | "visible" | "hidden";

export default function AdminEducationClient() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [visibilityFilter, setVisibilityFilter] =
    useState<VisibilityFilter>("all");

  const loadEducation = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await adminEducationService.getAll();
      setEducation(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load education records."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEducation();
  }, [loadEducation]);

  const handleVisibility = async (item: Education) => {
    try {
      await adminEducationService.update(item._id, {
        isVisible: !item.isVisible,
      });

      await loadEducation();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Failed to update visibility."
      );
    }
  };

  const handleDelete = async (item: Education) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.degree}"?`
    );

    if (!confirmed) return;

    try {
      await adminEducationService.delete(item._id);
      await loadEducation();
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : "Failed to delete education record."
      );
    }
  };

  const formatDate = (date?: string | null) => {
    if (!date) return "Present";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const filteredEducation = education.filter((item) => {
    const searchText = [
      item.degree,
      item.institution,
      item.fieldOfStudy,
      item.location,
      item.grade,
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchText.includes(search.toLowerCase());

    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "current" && item.isCurrent) ||
      (typeFilter === "completed" && !item.isCurrent);

    const matchesVisibility =
      visibilityFilter === "all" ||
      (visibilityFilter === "visible" && item.isVisible) ||
      (visibilityFilter === "hidden" && !item.isVisible);

    return matchesSearch && matchesType && matchesVisibility;
  });

  return (
    <div className="admin-page admin-education-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <span className="admin-eyebrow">ACADEMIC MANAGEMENT</span>
          <h1>Education</h1>
          <p>Manage your academic qualifications and education history.</p>
        </div>

        <Link
          href="/admin/education/new"
          className="admin-primary-button"
        >
          + Add Education
        </Link>
      </div>

      {/* Statistics */}
      <div className="admin-education-stats">
        <div className="admin-education-stat">
          <span>Total Education</span>
          <strong>{education.length}</strong>
        </div>

        <div className="admin-education-stat">
          <span>Visible</span>
          <strong>
            {education.filter((item) => item.isVisible).length}
          </strong>
        </div>

        <div className="admin-education-stat">
          <span>Currently Studying</span>
          <strong>
            {education.filter((item) => item.isCurrent).length}
          </strong>
        </div>

        <div className="admin-education-stat">
          <span>Completed</span>
          <strong>
            {education.filter((item) => !item.isCurrent).length}
          </strong>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="admin-education-toolbar">
        <input
          type="search"
          placeholder="Search degree, institution, field..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(event.target.value as TypeFilter)
          }
        >
          <option value="all">All Education</option>
          <option value="current">Currently Studying</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={visibilityFilter}
          onChange={(event) =>
            setVisibilityFilter(event.target.value as VisibilityFilter)
          }
        >
          <option value="all">All Visibility</option>
          <option value="visible">Visible</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>

      {/* Error */}
      {error && (
        <div className="admin-education-error">
          <span>{error}</span>
          <button type="button" onClick={() => void loadEducation()}>
            Retry
          </button>
        </div>
      )}

      {/* Education Table */}
      <div className="admin-education-table-card">
        {loading ? (
          <div className="admin-education-empty">
            <p>Loading education records...</p>
          </div>
        ) : filteredEducation.length === 0 ? (
          <div className="admin-education-empty">
            <h3>No education records found</h3>
            <p>
              {education.length === 0
                ? "Add your first academic qualification to get started."
                : "Try changing your search or filters."}
            </p>
          </div>
        ) : (
          <div className="admin-education-table-wrapper">
            <table className="admin-education-table">
              <thead>
                <tr>
                  <th>Degree</th>
                  <th>Institution</th>
                  <th>Field of Study</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Visibility</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredEducation.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <strong>{item.degree}</strong>
                      {item.grade && <small>{item.grade}</small>}
                    </td>

                    <td>
                      <strong>{item.institution}</strong>
                      {item.location && <small>{item.location}</small>}
                    </td>

                    <td>{item.fieldOfStudy || "—"}</td>

                    <td>
                      {formatDate(item.startDate)} –{" "}
                      {item.isCurrent
                        ? "Present"
                        : formatDate(item.endDate)}
                    </td>

                    <td>
                      <span
                        className={`admin-education-badge ${
                          item.isCurrent ? "current" : "completed"
                        }`}
                      >
                        {item.isCurrent ? "Studying" : "Completed"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`admin-education-badge ${
                          item.isVisible ? "visible" : "hidden"
                        }`}
                      >
                        {item.isVisible ? "Visible" : "Hidden"}
                      </span>
                    </td>

                    <td>
                      <div className="admin-education-actions">
                        <Link
                          href={`/admin/education/${item._id}/edit`}
                          className="edit"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() => void handleVisibility(item)}
                          className="toggle"
                        >
                          {item.isVisible ? "Hide" : "Show"}
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleDelete(item)}
                          className="delete"
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
