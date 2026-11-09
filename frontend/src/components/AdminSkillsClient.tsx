
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { adminSkillService } from "@/services/adminSkillService";
import type { Skill } from "@/types/skills";

export default function AdminSkillsClient() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const loadSkills = useCallback(async () => {
    try {
      setError("");
      const data = await adminSkillService.getAll();
      setSkills(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load skills."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSkills();
  }, [loadSkills]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(skills.map((skill) => skill.category || "Other"))
      ).sort((a, b) => a.localeCompare(b)),
    [skills]
  );

  const filteredSkills = useMemo(() => {
    return [...skills]
      .filter((skill) => {
        const matchesSearch = skill.name
          .toLowerCase()
          .includes(search.trim().toLowerCase());

        const matchesCategory =
          selectedCategory === "all" ||
          (skill.category || "Other") === selectedCategory;

        return matchesSearch && matchesCategory;
      })
      .sort(
        (a, b) =>
          a.sortOrder - b.sortOrder ||
          a.name.localeCompare(b.name)
      );
  }, [skills, search, selectedCategory]);

  async function toggleVisibility(skill: Skill) {
    try {
      setActionId(skill._id);
      setError("");

      await adminSkillService.update(skill._id, {
        isVisible: !skill.isVisible,
      });

      await loadSkills();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not update skill visibility."
      );
    } finally {
      setActionId(null);
    }
  }

  async function deleteSkill(skill: Skill) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${skill.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setActionId(skill._id);
      setError("");

      await adminSkillService.delete(skill._id);
      await loadSkills();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not delete skill."
      );
    } finally {
      setActionId(null);
    }
  }

  const visibleCount = skills.filter((skill) => skill.isVisible).length;
  const hiddenCount = skills.length - visibleCount;

  return (
    <div className="admin-skills-page">
      <div className="admin-skills-heading">
        <div>
          <span className="admin-eyebrow">
            CONTENT MANAGEMENT / SKILLS
          </span>

          <h1>Skills</h1>

          <p>
            Manage your technical skills, proficiency levels, and
            how they appear on your public portfolio.
          </p>
        </div>

        <Link href="/admin/skills/new" className="admin-button">
          + Add Skill
        </Link>
      </div>

      <div className="admin-skill-summary">
        <div className="admin-card">
          <span>Total Skills</span>
          <strong>{skills.length}</strong>
        </div>

        <div className="admin-card">
          <span>Visible</span>
          <strong>{visibleCount}</strong>
        </div>

        <div className="admin-card">
          <span>Hidden</span>
          <strong>{hiddenCount}</strong>
        </div>

        <div className="admin-card">
          <span>Categories</span>
          <strong>{categories.length}</strong>
        </div>
      </div>

      {error && (
        <div className="admin-project-error" role="alert">
          {error}
        </div>
      )}

      <section className="admin-card admin-skill-list">
        <div className="admin-skill-list-heading">
          <div>
            <h2>All Skills</h2>
            <p>Your technical skills collection</p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={() => void loadSkills()}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </div>

        <div className="admin-skill-toolbar">
          <input
            type="search"
            placeholder="Search skills..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search skills"
          />

          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            aria-label="Filter skills by category"
          >
            <option value="all">All categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="admin-project-empty">
            Loading skills...
          </div>
        ) : filteredSkills.length === 0 ? (
          <div className="admin-project-empty">
            <h3>
              {skills.length === 0 ? "No skills found" : "No matching skills"}
            </h3>
            <p>
              {skills.length === 0
                ? "Add your first skill to get started."
                : "Try changing your search or category filter."}
            </p>
          </div>
        ) : (
          <div className="admin-project-table-wrapper">
            <table className="admin-project-table admin-skill-table">
              <thead>
                <tr>
                  <th>Skill</th>
                  <th>Category</th>
                  <th>Proficiency</th>
                  <th>Visibility</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredSkills.map((skill) => (
                  <tr key={skill._id}>
                    <td>
                      <div className="admin-skill-name">
                        <div className="admin-skill-icon">
                          {skill.icon || skill.name.charAt(0).toUpperCase()}
                        </div>

                        <strong>{skill.name}</strong>
                      </div>
                    </td>

                    <td>{skill.category || "Other"}</td>

                    <td>
                      <div className="admin-skill-proficiency">
                        <div className="admin-skill-progress">
                          <span
                            style={{
                              width: `${skill.proficiency}%`,
                            }}
                          />
                        </div>

                        <strong>{skill.proficiency}%</strong>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`admin-skill-visibility ${
                          skill.isVisible ? "visible" : "hidden"
                        }`}
                      >
                        {skill.isVisible ? "Visible" : "Hidden"}
                      </span>
                    </td>

                    <td>
                      <div className="admin-project-actions">
                        <Link
                          href={`/admin/skills/${skill._id}/edit`}
                          className="admin-project-action"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          className="admin-project-action"
                          onClick={() => void toggleVisibility(skill)}
                          disabled={actionId === skill._id}
                        >
                          {actionId === skill._id
                            ? "Please wait..."
                            : skill.isVisible
                              ? "Hide"
                              : "Show"}
                        </button>

                        <button
                          type="button"
                          className="admin-project-action danger"
                          onClick={() => void deleteSkill(skill)}
                          disabled={actionId === skill._id}
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

        {!loading && skills.length > 0 && (
          <div className="admin-skill-results">
            Showing {filteredSkills.length} of {skills.length} skills
          </div>
        )}
      </section>
    </div>
  );
}
