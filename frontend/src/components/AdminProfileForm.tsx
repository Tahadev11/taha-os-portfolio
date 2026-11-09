"use client";

import { useEffect, useState, type FormEvent } from "react";

import { adminProfileService } from "@/services/adminProfileService";
import { adminProjectService } from "@/services/adminProjectService";

import type {
  Profile,
  UpdateProfileData,
} from "@/types/profile";

const emptyProfile: Profile = {
  fullName: "",
  professionalTitle: "",
  shortIntro: "",
  about: "",
  profileImage: "",
  location: "",
  email: "",
  phone: "",
  socialLinks: {
    github: "",
    linkedin: "",
    website: "",
  },
  resumeUrl: "",
  isAvailable: true,
};

export default function AdminProfileForm() {
  const [profile, setProfile] = useState<Profile>(emptyProfile);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);
      setError("");

      const data = await adminProfileService.getProfile();

      if (data) {
        setProfile({
          ...emptyProfile,
          ...data,
          socialLinks: {
            ...emptyProfile.socialLinks,
            ...data.socialLinks,
          },
        });
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load profile.",
      );
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSocialChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      socialLinks: {
        ...previous.socialLinks,
        [name]: value,
      },
    }));
  }

  async function handleImageUpload(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);
      setError("");
      setSuccess("");

      const uploadedFile =
        await adminProjectService.uploadFile(file);

      setProfile((previous) => ({
        ...previous,
        profileImage: uploadedFile.url,
      }));

      setSuccess("Profile image uploaded successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Profile image upload failed.",
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updateData: UpdateProfileData = {
        fullName: profile.fullName.trim(),
        professionalTitle: profile.professionalTitle.trim(),
        shortIntro: profile.shortIntro.trim(),
        about: profile.about.trim(),
        location: profile.location.trim(),
        email: profile.email.trim(),
        phone: profile.phone.trim(),
        socialLinks: profile.socialLinks,
        isAvailable: profile.isAvailable,
      };

      // Do not send empty values to DTO fields validated as URLs.
      if (profile.profileImage.trim()) {
        updateData.profileImage = profile.profileImage.trim();
      }

      if (profile.resumeUrl.trim()) {
        updateData.resumeUrl = profile.resumeUrl.trim();
      }

      const updatedProfile =
        await adminProfileService.updateProfile(updateData);

      setProfile((previous) => ({
        ...previous,
        ...updatedProfile,
        socialLinks: {
          ...previous.socialLinks,
          ...updatedProfile.socialLinks,
        },
      }));

      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update profile.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="admin-profile-loading">
        Loading profile information...
      </div>
    );
  }

  return (
    <div className="admin-profile-page">
      <div className="admin-profile-header">
        <div>
          <h1>Profile</h1>
          <p>Manage your personal and professional information.</p>
        </div>
      </div>

      {error && (
        <div className="admin-profile-alert admin-profile-error">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-profile-alert admin-profile-success">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-profile-form">
        {/* Profile Image */}

        <section className="admin-profile-card">
          <div className="admin-profile-section-heading">
            <div>
              <h2>Profile Image</h2>
              <p>Your public portfolio profile picture.</p>
            </div>
          </div>

          <div className="admin-profile-image-area">
            <div className="admin-profile-image-preview">
              {profile.profileImage ? (
                <img
                  src={profile.profileImage}
                  alt="Profile preview"
                />
              ) : (
                <span>
                  {profile.fullName
                    ? profile.fullName.charAt(0).toUpperCase()
                    : "?"}
                </span>
              )}
            </div>

            <div className="admin-profile-image-controls">
              <label
                htmlFor="profileImage"
                className="admin-profile-upload-button"
              >
                {uploading ? "Uploading..." : "Upload Image"}
              </label>

              <input
                id="profileImage"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageUpload}
                disabled={uploading}
                hidden
              />

              <p>PNG, JPG or WebP. Maximum size: 5MB.</p>

              {profile.profileImage && (
                <button
                  type="button"
                  className="admin-profile-remove-image"
                  onClick={() =>
                    setProfile((previous) => ({
                      ...previous,
                      profileImage: "",
                    }))
                  }
                >
                  Remove image
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Personal Information */}

        <section className="admin-profile-card">
          <div className="admin-profile-section-heading">
            <div>
              <h2>Personal Information</h2>
              <p>Basic information displayed on your portfolio.</p>
            </div>
          </div>

          <div className="admin-profile-grid">
            <div className="admin-profile-field">
              <label htmlFor="fullName">Full Name *</label>
              <input
                id="fullName"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                required
              />
            </div>

            <div className="admin-profile-field">
              <label htmlFor="email">Email Address *</label>
              <input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="admin-profile-field">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                placeholder="+92..."
              />
            </div>

            <div className="admin-profile-field">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                name="location"
                value={profile.location}
                onChange={handleChange}
                placeholder="City, Country"
              />
            </div>
          </div>
        </section>

        {/* Professional Information */}

        <section className="admin-profile-card">
          <div className="admin-profile-section-heading">
            <div>
              <h2>Professional Information</h2>
              <p>Your professional identity and introduction.</p>
            </div>
          </div>

          <div className="admin-profile-field">
            <label htmlFor="professionalTitle">
              Professional Title *
            </label>
            <input
              id="professionalTitle"
              name="professionalTitle"
              value={profile.professionalTitle}
              onChange={handleChange}
              placeholder="Software Engineer"
              required
            />
          </div>

          <div className="admin-profile-field">
            <label htmlFor="shortIntro">Short Introduction</label>
            <textarea
              id="shortIntro"
              name="shortIntro"
              value={profile.shortIntro}
              onChange={handleChange}
              placeholder="A short introduction about yourself..."
              rows={3}
            />
          </div>

          <div className="admin-profile-field">
            <label htmlFor="about">About Me</label>
            <textarea
              id="about"
              name="about"
              value={profile.about}
              onChange={handleChange}
              placeholder="Write more about your background, experience and interests..."
              rows={6}
            />
          </div>
        </section>

        {/* Social Links */}

        <section className="admin-profile-card">
          <div className="admin-profile-section-heading">
            <div>
              <h2>Social Links</h2>
              <p>Connect your portfolio to your online profiles.</p>
            </div>
          </div>

          <div className="admin-profile-grid">
            <div className="admin-profile-field">
              <label htmlFor="github">GitHub URL</label>
              <input
                id="github"
                name="github"
                type="url"
                value={profile.socialLinks.github}
                onChange={handleSocialChange}
                placeholder="https://github.com/username"
              />
            </div>

            <div className="admin-profile-field">
              <label htmlFor="linkedin">LinkedIn URL</label>
              <input
                id="linkedin"
                name="linkedin"
                type="url"
                value={profile.socialLinks.linkedin}
                onChange={handleSocialChange}
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className="admin-profile-field">
              <label htmlFor="website">Personal Website</label>
              <input
                id="website"
                name="website"
                type="url"
                value={profile.socialLinks.website}
                onChange={handleSocialChange}
                placeholder="https://example.com"
              />
            </div>
          </div>
        </section>

        {/* Availability */}

        <section className="admin-profile-card">
          <div className="admin-profile-section-heading">
            <div>
              <h2>Availability</h2>
              <p>Control your public availability status.</p>
            </div>
          </div>

          <label className="admin-profile-toggle">
            <input
              type="checkbox"
              checked={profile.isAvailable}
              onChange={(event) =>
                setProfile((previous) => ({
                  ...previous,
                  isAvailable: event.target.checked,
                }))
              }
            />

            <span className="admin-profile-toggle-text">
              <strong>
                {profile.isAvailable
                  ? "Available for opportunities"
                  : "Currently unavailable"}
              </strong>
              <small>
                This status can be displayed on your public portfolio.
              </small>
            </span>
          </label>
        </section>

        {/* Save Button */}

        <div className="admin-profile-actions">
          <button
            type="submit"
            disabled={saving || uploading}
            className="admin-profile-save-button"
          >
            {saving ? "Saving Changes..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}