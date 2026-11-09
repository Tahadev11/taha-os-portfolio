
"use client";

import { useState } from "react";
import { adminProjectService } from "@/services/adminProjectService";

interface ProjectImageUploaderProps {
  thumbnail: string;
  gallery: string[];
  onThumbnailChange: (url: string) => void;
  onGalleryChange: (urls: string[]) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export default function ProjectImageUploader({
  thumbnail,
  gallery,
  onThumbnailChange,
  onGalleryChange,
}: ProjectImageUploaderProps) {
  const [thumbnailUploading, setThumbnailUploading] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryProgress, setGalleryProgress] = useState("");
  const [error, setError] = useState("");

  function validateFile(file: File): boolean {
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError(
        `${file.name}: Only JPG, PNG, WEBP and GIF images are allowed.`
      );
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`${file.name}: Maximum file size is 10 MB.`);
      return false;
    }

    return true;
  }

  async function handleThumbnailUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!validateFile(file)) {
      event.target.value = "";
      return;
    }

    try {
      setThumbnailUploading(true);

      const result = await adminProjectService.uploadFile(file);

      onThumbnailChange(result.url);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Thumbnail upload failed."
      );
    } finally {
      setThumbnailUploading(false);
      event.target.value = "";
    }
  }

  async function handleGalleryUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(event.target.files || []);

    if (!files.length) return;

    setError("");
    setGalleryProgress("");

    // Validate all selected files before uploading.
    for (const file of files) {
      if (!validateFile(file)) {
        event.target.value = "";
        return;
      }
    }

    const uploadedUrls: string[] = [];

    try {
      setGalleryUploading(true);

      for (let i = 0; i < files.length; i++) {
        setGalleryProgress(
          `Uploading image ${i + 1} of ${files.length}...`
        );

        const result = await adminProjectService.uploadFile(files[i]);

        uploadedUrls.push(result.url);
      }

      onGalleryChange([...gallery, ...uploadedUrls]);
      setGalleryProgress("All gallery images uploaded successfully.");
    } catch (err) {
      // Keep any images that uploaded successfully before an error.
      if (uploadedUrls.length > 0) {
        onGalleryChange([...gallery, ...uploadedUrls]);
      }

      setError(
        err instanceof Error
          ? err.message
          : "Gallery image upload failed."
      );
    } finally {
      setGalleryUploading(false);
      event.target.value = "";
    }
  }

  function removeGalleryImage(index: number) {
    onGalleryChange(gallery.filter((_, i) => i !== index));
  }

  return (
    <div className="project-image-uploader">
      {/* THUMBNAIL UPLOAD */}
      <div className="admin-form-field full-width">
        <label>Thumbnail Image</label>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleThumbnailUpload}
          disabled={thumbnailUploading || galleryUploading}
        />

        <small>
          Choose one image from your computer. Maximum size: 10 MB.
        </small>

        {thumbnailUploading && (
          <p>Uploading thumbnail to Cloudinary...</p>
        )}

        {thumbnail && (
          <div className="project-image-preview">
            <img
              src={thumbnail}
              alt="Project thumbnail preview"
            />

            <button
              type="button"
              className="admin-cancel-button"
              onClick={() => onThumbnailChange("")}
              disabled={thumbnailUploading}
            >
              Remove Thumbnail
            </button>
          </div>
        )}
      </div>

      {/* GALLERY UPLOAD */}
      <div className="admin-form-field full-width">
        <label>Gallery Images</label>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleGalleryUpload}
          disabled={galleryUploading || thumbnailUploading}
        />

        <small>
          Select multiple project screenshots from your computer.
          Maximum size: 10 MB per image.
        </small>

        {galleryUploading && (
          <p>{galleryProgress}</p>
        )}

        {!galleryUploading && galleryProgress && (
          <p>{galleryProgress}</p>
        )}

        {gallery.length > 0 && (
          <div className="project-gallery-preview">
            {gallery.map((url, index) => (
              <div
                className="project-gallery-item"
                key={`${url}-${index}`}
              >
                <img
                  src={url}
                  alt={`Project gallery image ${index + 1}`}
                />

                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={() => removeGalleryImage(index)}
                  disabled={galleryUploading}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ERROR */}
      {error && (
        <div className="admin-project-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}
