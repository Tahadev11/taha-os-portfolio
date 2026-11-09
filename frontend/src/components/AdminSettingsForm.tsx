"use client";

import { useEffect, useState, type FormEvent } from "react";

import { adminSettingsService } from "@/services/adminSettingsService";
import { adminProjectService } from "@/services/adminProjectService";

import type {
    Settings,
    UpdateSettingsData,
} from "@/types/settings";

const emptySettings: Settings = {
    siteTitle: "",
    siteDescription: "",
    seoTitle: "",
    seoDescription: "",
    seoKeywords: [],
    logoUrl: "",
    lightLogoUrl: "",
    faviconUrl: "",
    theme: "dark",
    socialLinks: {
        github: "",
        linkedin: "",
        twitter: "",
        instagram: "",
    },
    contactEmail: "",
    contactPhone: "",
    maintenanceMode: false,
    isWebsiteVisible: true,
};

export default function AdminSettingsForm() {
    const [settings, setSettings] =
        useState<Settings>(emptySettings);

    const [keywordsText, setKeywordsText] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [uploadingLightLogo, setUploadingLightLogo] = useState(false);
    const [uploadingFavicon, setUploadingFavicon] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        try {
            setLoading(true);
            setError("");

            const data = await adminSettingsService.getSettings();

            setSettings({
                ...emptySettings,
                ...data,
                socialLinks: {
                    ...emptySettings.socialLinks,
                    ...data.socialLinks,
                },
            });

            setKeywordsText((data.seoKeywords || []).join(", "));
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load website settings.",
            );
        } finally {
            setLoading(false);
        }
    }

    function handleChange(
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
    ) {
        const { name, value } = event.target;

        setSettings((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    function handleSocialChange(
        event: React.ChangeEvent<HTMLInputElement>,
    ) {
        const { name, value } = event.target;

        setSettings((previous) => ({
            ...previous,
            socialLinks: {
                ...previous.socialLinks,
                [name]: value,
            },
        }));
    }

    async function handleFileUpload(
        event: React.ChangeEvent<HTMLInputElement>,
        type: "logo" | "lightLogo" | "favicon",
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
            setError("");
            setSuccess("");

            if (type === "logo") setUploadingLogo(true);
            if (type === "lightLogo") setUploadingLightLogo(true);
            if (type === "favicon") setUploadingFavicon(true);

            const uploadedFile =
                await adminProjectService.uploadFile(file);

            const fieldName =
                type === "logo"
                    ? "logoUrl"
                    : type === "lightLogo"
                        ? "lightLogoUrl"
                        : "faviconUrl";

            setSettings((previous) => ({
                ...previous,
                [fieldName]: uploadedFile.url,
            }));

            setSuccess(
                type === "logo"
                    ? "Dark theme logo uploaded successfully."
                    : type === "lightLogo"
                        ? "Light theme logo uploaded successfully."
                        : "Favicon uploaded successfully.",
            );
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Image upload failed.",
            );
        } finally {
            setUploadingLogo(false);
            setUploadingLightLogo(false);
            setUploadingFavicon(false);
            event.target.value = "";
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const updateData: UpdateSettingsData = {
                siteTitle: settings.siteTitle.trim(),
                siteDescription: settings.siteDescription.trim(),
                seoTitle: settings.seoTitle.trim(),
                seoDescription: settings.seoDescription.trim(),
                seoKeywords: keywordsText
                    .split(",")
                    .map((keyword) => keyword.trim())
                    .filter(Boolean),
                theme: settings.theme,
                socialLinks: settings.socialLinks,
                contactEmail: settings.contactEmail.trim(),
                contactPhone: settings.contactPhone.trim(),
                maintenanceMode: settings.maintenanceMode,
                isWebsiteVisible: settings.isWebsiteVisible,
            };

            // Empty URL fields are omitted to avoid URL validation errors.
            if (settings.lightLogoUrl.trim()) {
                updateData.lightLogoUrl = settings.lightLogoUrl.trim();
            }

            if (settings.faviconUrl.trim()) {
                updateData.faviconUrl = settings.faviconUrl.trim();
            }

            const updatedSettings =
                await adminSettingsService.updateSettings(updateData);

            setSettings((previous) => ({
                ...previous,
                ...updatedSettings,
                socialLinks: {
                    ...previous.socialLinks,
                    ...updatedSettings.socialLinks,
                },
            }));

            setKeywordsText(
                (updatedSettings.seoKeywords || []).join(", "),
            );

            setSuccess("Website settings updated successfully.");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update website settings.",
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="admin-settings-loading">
                Loading website settings...
            </div>
        );
    }

    return (
        <div className="admin-settings-page">
            <div className="admin-settings-header">
                <div>
                    <h1>Website Settings</h1>
                    <p>Manage your website configuration and preferences.</p>
                </div>
            </div>

            {error && (
                <div className="admin-settings-alert admin-settings-error">
                    {error}
                </div>
            )}

            {success && (
                <div className="admin-settings-alert admin-settings-success">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="admin-settings-form">
                {/* General Settings */}

                <section className="admin-settings-card">
                    <div className="admin-settings-section-heading">
                        <div>
                            <h2>General Settings</h2>
                            <p>Basic information about your website.</p>
                        </div>
                    </div>

                    <div className="admin-settings-field">
                        <label htmlFor="siteTitle">Website Title *</label>
                        <input
                            id="siteTitle"
                            name="siteTitle"
                            value={settings.siteTitle}
                            onChange={handleChange}
                            placeholder="Taha Siddique | Software Engineer"
                            required
                        />
                    </div>

                    <div className="admin-settings-field">
                        <label htmlFor="siteDescription">
                            Website Description
                        </label>
                        <textarea
                            id="siteDescription"
                            name="siteDescription"
                            value={settings.siteDescription}
                            onChange={handleChange}
                            placeholder="Describe your portfolio website..."
                            rows={3}
                        />
                    </div>

                    <div className="admin-settings-field">
                        <label htmlFor="theme">Website Theme</label>
                        <select
                            id="theme"
                            name="theme"
                            value={settings.theme}
                            onChange={handleChange}
                        >
                            <option value="dark">Dark</option>
                            <option value="light">Light</option>
                            <option value="system">System Default</option>
                        </select>
                        <small>
                            This stores your preferred website theme. It does not
                            automatically change the frontend appearance unless
                            the frontend reads this setting.
                        </small>
                    </div>
                </section>

                {/* Branding */}

                <section className="admin-settings-card">
                    <div className="admin-settings-section-heading">
                        <div>
                            <h2>Website Branding</h2>
                            <p>Upload your website logo and favicon.</p>
                        </div>
                    </div>

<div className="admin-settings-upload-item">
  <label>Light Theme Logo</label>

  <div className="admin-settings-image-preview">
    {settings.lightLogoUrl ? (
      <img
        src={settings.lightLogoUrl}
        alt="Light theme logo"
      />
    ) : (
      <span>No light theme logo uploaded</span>
    )}
  </div>

  <label
    htmlFor="lightLogoUpload"
    className="admin-settings-upload-button"
  >
    {uploadingLightLogo
      ? "Uploading..."
      : "Upload Light Logo"}
  </label>

  <input
    id="lightLogoUpload"
    type="file"
    accept="image/png,image/jpeg,image/webp,image/svg+xml"
    hidden
    disabled={uploadingLightLogo}
    onChange={(event) =>
      handleFileUpload(event, "lightLogo")
    }
  />
</div>
                </section>

                {/* SEO */}

                <section className="admin-settings-card">
                    <div className="admin-settings-section-heading">
                        <div>
                            <h2>SEO Settings</h2>
                            <p>Configure how your website appears in search engines.</p>
                        </div>
                    </div>

                    <div className="admin-settings-field">
                        <label htmlFor="seoTitle">SEO Title</label>
                        <input
                            id="seoTitle"
                            name="seoTitle"
                            value={settings.seoTitle}
                            onChange={handleChange}
                            placeholder="Taha Siddique - Software Engineer"
                        />
                    </div>

                    <div className="admin-settings-field">
                        <label htmlFor="seoDescription">SEO Description</label>
                        <textarea
                            id="seoDescription"
                            name="seoDescription"
                            value={settings.seoDescription}
                            onChange={handleChange}
                            placeholder="Search engine description..."
                            rows={3}
                        />
                    </div>

                    <div className="admin-settings-field">
                        <label htmlFor="seoKeywords">SEO Keywords</label>
                        <input
                            id="seoKeywords"
                            value={keywordsText}
                            onChange={(event) =>
                                setKeywordsText(event.target.value)
                            }
                            placeholder="Software Engineer, Python Developer, NestJS"
                        />
                        <small>Separate keywords with commas.</small>
                    </div>
                </section>

                {/* Social Links */}

                <section className="admin-settings-card">
                    <div className="admin-settings-section-heading">
                        <div>
                            <h2>Social Media Links</h2>
                            <p>Your public social and professional profiles.</p>
                        </div>
                    </div>

                    <div className="admin-settings-grid">
                        <div className="admin-settings-field">
                            <label htmlFor="github">GitHub</label>
                            <input
                                id="github"
                                name="github"
                                type="url"
                                value={settings.socialLinks.github}
                                onChange={handleSocialChange}
                                placeholder="https://github.com/username"
                            />
                        </div>

                        <div className="admin-settings-field">
                            <label htmlFor="linkedin">LinkedIn</label>
                            <input
                                id="linkedin"
                                name="linkedin"
                                type="url"
                                value={settings.socialLinks.linkedin}
                                onChange={handleSocialChange}
                                placeholder="https://linkedin.com/in/username"
                            />
                        </div>

                        <div className="admin-settings-field">
                            <label htmlFor="twitter">Twitter / X</label>
                            <input
                                id="twitter"
                                name="twitter"
                                type="url"
                                value={settings.socialLinks.twitter}
                                onChange={handleSocialChange}
                                placeholder="https://x.com/username"
                            />
                        </div>

                        <div className="admin-settings-field">
                            <label htmlFor="instagram">Instagram</label>
                            <input
                                id="instagram"
                                name="instagram"
                                type="url"
                                value={settings.socialLinks.instagram}
                                onChange={handleSocialChange}
                                placeholder="https://instagram.com/username"
                            />
                        </div>
                    </div>
                </section>

                {/* Contact */}

                <section className="admin-settings-card">
                    <div className="admin-settings-section-heading">
                        <div>
                            <h2>Contact Information</h2>
                            <p>Website contact details.</p>
                        </div>
                    </div>

                    <div className="admin-settings-grid">
                        <div className="admin-settings-field">
                            <label htmlFor="contactEmail">Contact Email</label>
                            <input
                                id="contactEmail"
                                name="contactEmail"
                                type="email"
                                value={settings.contactEmail}
                                onChange={handleChange}
                                placeholder="contact@example.com"
                            />
                        </div>

                        <div className="admin-settings-field">
                            <label htmlFor="contactPhone">Contact Phone</label>
                            <input
                                id="contactPhone"
                                name="contactPhone"
                                value={settings.contactPhone}
                                onChange={handleChange}
                                placeholder="+92..."
                            />
                        </div>
                    </div>
                </section>

                {/* Website Controls */}

                <section className="admin-settings-card">
                    <div className="admin-settings-section-heading">
                        <div>
                            <h2>Website Controls</h2>
                            <p>Manage website visibility and maintenance mode.</p>
                        </div>
                    </div>

                    <label className="admin-settings-toggle">
                        <input
                            type="checkbox"
                            checked={settings.isWebsiteVisible}
                            onChange={(event) =>
                                setSettings((previous) => ({
                                    ...previous,
                                    isWebsiteVisible: event.target.checked,
                                }))
                            }
                        />

                        <span className="admin-settings-toggle-content">
                            <strong>Website Visibility</strong>
                            <small>
                                Allow visitors to access your public portfolio.
                            </small>
                        </span>

                        <span
                            className={
                                settings.isWebsiteVisible
                                    ? "admin-settings-status active"
                                    : "admin-settings-status inactive"
                            }
                        >
                            {settings.isWebsiteVisible ? "Visible" : "Hidden"}
                        </span>
                    </label>

                    <div className="admin-settings-toggle-divider" />

                    <label className="admin-settings-toggle">
                        <input
                            type="checkbox"
                            checked={settings.maintenanceMode}
                            onChange={(event) =>
                                setSettings((previous) => ({
                                    ...previous,
                                    maintenanceMode: event.target.checked,
                                }))
                            }
                        />

                        <span className="admin-settings-toggle-content">
                            <strong>Maintenance Mode</strong>
                            <small>
                                Enable maintenance mode for your website.
                            </small>
                        </span>

                        <span
                            className={
                                settings.maintenanceMode
                                    ? "admin-settings-status warning"
                                    : "admin-settings-status active"
                            }
                        >
                            {settings.maintenanceMode ? "Enabled" : "Disabled"}
                        </span>
                    </label>
                </section>

                {/* Save */}

                <div className="admin-settings-actions">
                    <button
                        type="submit"
                        className="admin-settings-save-button"
disabled={
  saving ||
  uploadingLogo ||
  uploadingLightLogo ||
  uploadingFavicon
}
                    >
                        {saving ? "Saving Settings..." : "Save Settings"}
                    </button>
                </div>
            </form>
        </div>
    );
}