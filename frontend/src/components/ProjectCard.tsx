
"use client";

import { useState } from "react";
import type { Project } from "@/types/portfolio";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  // Include the thumbnail and all gallery images.
  // Remove duplicate URLs.
  const projectImages = Array.from(
    new Set(
      [project.thumbnail, ...(project.gallery || [])].filter(
        (image): image is string => Boolean(image)
      )
    )
  );

  function openGallery(index = 0) {
    setActiveImage(index);
    setGalleryOpen(true);
  }

  function previousImage() {
    setActiveImage((current) =>
      current === 0 ? projectImages.length - 1 : current - 1
    );
  }

  function nextImage() {
    setActiveImage((current) =>
      current === projectImages.length - 1 ? 0 : current + 1
    );
  }

  return (
    <>
      <article className="project-card">
        {/* Project Thumbnail */}
        {projectImages.length > 0 && (
          <div className="project-card-image">
            <button
              type="button"
              className="project-image-open"
              onClick={() => openGallery(0)}
              aria-label={`View images for ${project.title}`}
            >
              <img
                src={projectImages[0]}
                alt={`${project.title} project preview`}
              />

              <span className="project-image-overlay">
                View Project Images ↗
              </span>
            </button>

            {projectImages.length > 1 && (
              <span className="project-image-count">
                ▧ {projectImages.length} IMAGES
              </span>
            )}
          </div>
        )}

        <div className="project-card-header">
          <span className="quick-card-icon">▣</span>

          {project.isFeatured && (
            <span className="project-featured">★ FEATURED</span>
          )}
        </div>

        <h3 className="project-card-title">
          {project.title}
        </h3>

        <p className="hero-description">
          {project.shortDescription}
        </p>

        {/* Gallery Button */}
        {projectImages.length > 0 && (
          <button
            type="button"
            className="project-gallery-button"
            onClick={() => openGallery(0)}
          >
            <span>▧</span>
            View All Project Images ({projectImages.length})
            <span>↗</span>
          </button>
        )}

        <div className="project-tech-stack">
          {project.techStack.map((technology) => (
            <span className="terminal-language" key={technology}>
              {technology}
            </span>
          ))}
        </div>

        <div className="project-card-actions">
          {project.githubUrl && (
            <a
              className="secondary-button"
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub ↗
            </a>
          )}

          {project.liveUrl && (
            <a
              className="primary-button"
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Live Demo ↗
            </a>
          )}
        </div>
      </article>

      {/* Project Image Gallery Modal */}
      {galleryOpen && projectImages.length > 0 && (
        <div
          className="project-gallery-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} image gallery`}
          onClick={() => setGalleryOpen(false)}
        >
          <div
            className="project-gallery-content"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="project-gallery-modal-header">
              <div>
                <span className="project-gallery-eyebrow">
                  PROJECT GALLERY
                </span>

                <h2>{project.title}</h2>

                <p>
                  Image {activeImage + 1} of {projectImages.length}
                </p>
              </div>

              <button
                type="button"
                className="project-gallery-close"
                onClick={() => setGalleryOpen(false)}
                aria-label="Close gallery"
              >
                ✕
              </button>
            </div>

            {/* Main Image */}
            <div className="project-gallery-main">
              {projectImages.length > 1 && (
                <button
                  type="button"
                  className="project-gallery-nav previous"
                  onClick={previousImage}
                  aria-label="Previous image"
                >
                  ‹
                </button>
              )}

              <img
                src={projectImages[activeImage]}
                alt={`${project.title} screenshot ${activeImage + 1}`}
              />

              {projectImages.length > 1 && (
                <button
                  type="button"
                  className="project-gallery-nav next"
                  onClick={nextImage}
                  aria-label="Next image"
                >
                  ›
                </button>
              )}
            </div>

            {/* Image Thumbnails */}
            {projectImages.length > 1 && (
              <div className="project-gallery-thumbnails">
                {projectImages.map((image, index) => (
                  <button
                    type="button"
                    key={`${image}-${index}`}
                    className={
                      activeImage === index
                        ? "project-gallery-thumbnail active"
                        : "project-gallery-thumbnail"
                    }
                    onClick={() => setActiveImage(index)}
                    aria-label={`View image ${index + 1}`}
                    aria-pressed={activeImage === index}
                  >
                    <img
                      src={image}
                      alt={`${project.title} thumbnail ${index + 1}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
