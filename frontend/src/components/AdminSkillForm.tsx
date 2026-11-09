"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { adminSkillService } from "@/services/adminSkillService";
import type { CreateSkillData, Skill } from "@/types/skills";

interface AdminSkillFormProps {
  mode: "create" | "edit";
}

const initialFormData: CreateSkillData = {
  name: "",
  category: "",
  proficiency: 50,
  icon: "",
  sortOrder: 0,
  isVisible: true,
};

export default function AdminSkillForm({
  mode,
}: AdminSkillFormProps) {
  const router = useRouter();
  const params = useParams();

  const skillId =
    typeof params.id === "string" ? params.id : "";

  const [formData, setFormData] =
    useState<CreateSkillData>(initialFormData);

  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadSkill = useCallback(async () => {
    if (!skillId) {
      setError("Skill ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const skill: Skill = await adminSkillService.getById(skillId);

      setFormData({
        name: skill.name || "",
        category: skill.category || "",
        proficiency: skill.proficiency ?? 0,
        icon: skill.icon || "",
        sortOrder: skill.sortOrder ?? 0,
        isVisible: skill.isVisible ?? true,
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load skill."
      );
    } finally {
      setLoading(false);
    }
  }, [skillId]);

  useEffect(() => {
    if (mode === "edit") {
      void loadSkill();
    }
  }, [mode, loadSkill]);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
            ? Number(value)
            : value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Please enter a skill name.");
      return;
    }

    if (!formData.category.trim()) {
      setError("Please enter a skill category.");
      return;
    }

    if (
      formData.proficiency < 0 ||
      formData.proficiency > 100
    ) {
      setError("Proficiency must be between 0 and 100.");
      return;
    }

    try {
      setSaving(true);

      const payload: CreateSkillData = {
        ...formData,
        name: formData.name.trim(),
        category: formData.category.trim(),
        icon: formData.icon.trim(),
      };

      if (mode === "create") {
        await adminSkillService.create(payload);
        setSuccess("Skill created successfully.");
      } else {
        await adminSkillService.update(skillId, payload);
        setSuccess("Skill updated successfully.");
      }

      router.push("/admin/skills");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-skill-form-page">
        <div className="admin-skill-form-loading">
          Loading skill details...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-skill-form-page">
      <div className="admin-skill-form-heading">
        <div>
          <span className="admin-eyebrow">
            CONTENT MANAGEMENT / SKILLS
          </span>

          <h1>
            {mode === "create" ? "Add New Skill" : "Edit Skill"}
          </h1>

          <p>
            {mode === "create"
              ? "Add a technical skill to your portfolio."
              : "Update the skill information displayed on your portfolio."}
          </p>
        </div>

        <Link href="/admin/skills" className="admin-skill-back-button">
          ← Back to Skills
        </Link>
      </div>

      <form
        className="admin-skill-form-card"
        onSubmit={handleSubmit}
      >
        {error && (
          <div className="admin-project-error" role="alert">
            {error}
          </div>
        )}

        {success && (
          <div className="admin-skill-form-success" role="status">
            {success}
          </div>
        )}

        <div className="admin-skill-form-section">
          <h2>Skill Information</h2>
          <p>Enter the basic details of this skill.</p>

          <div className="admin-skill-form-grid">
            <div className="admin-skill-field">
              <label htmlFor="name">Skill Name *</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. TypeScript"
                value={formData.name}
                onChange={handleChange}
                maxLength={100}
                required
              />
            </div>

            <div className="admin-skill-field">
              <label htmlFor="category">Category *</label>
              <input
                id="category"
                name="category"
                type="text"
                placeholder="e.g. Programming Languages"
                value={formData.category}
                onChange={handleChange}
                maxLength={100}
                required
              />
            </div>

            <div className="admin-skill-field">
              <label htmlFor="proficiency">
                Proficiency ({formData.proficiency}%)
              </label>

              <input
                id="proficiency"
                name="proficiency"
                type="number"
                min="0"
                max="100"
                value={formData.proficiency}
                onChange={handleChange}
                required
              />

              <span className="admin-skill-field-hint">
                Enter a value between 0 and 100.
              </span>
            </div>

            <div className="admin-skill-field">
              <label htmlFor="icon">Icon or Emoji</label>
              <input
                id="icon"
                name="icon"
                type="text"
                placeholder="e.g. ⚛️ or 🐍"
                value={formData.icon}
                onChange={handleChange}
                maxLength={100}
              />

              <span className="admin-skill-field-hint">
                You can use an emoji or an icon identifier supported by your public skills component.
              </span>
            </div>

            <div className="admin-skill-field">
              <label htmlFor="sortOrder">Display Order</label>
              <input
                id="sortOrder"
                name="sortOrder"
                type="number"
                min="0"
                value={formData.sortOrder}
                onChange={handleChange}
              />

              <span className="admin-skill-field-hint">
                Lower numbers appear first.
              </span>
            </div>
          </div>
        </div>

        <div className="admin-skill-form-section">
          <h2>Portfolio Visibility</h2>
          <p>Choose whether this skill should appear publicly.</p>

          <label className="admin-skill-visibility-toggle">
            <input
              type="checkbox"
              name="isVisible"
              checked={formData.isVisible}
              onChange={handleChange}
            />

            <span className="admin-skill-toggle-content">
              <strong>Show this skill on my portfolio</strong>
              <small>
                {formData.isVisible
                  ? "This skill will be visible to visitors."
                  : "This skill will be hidden from visitors."}
              </small>
            </span>
          </label>
        </div>

        <div className="admin-skill-form-footer">
          <Link
            href="/admin/skills"
            className="admin-skill-cancel-button"
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
                ? "Create Skill"
                : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}