
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { adminCertificateService } from "@/services/adminCertifciateService";
import type { Certificate } from "@/types/certificates";

export default function AdminCertificatesClient() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [visibility, setVisibility] = useState("all");

  const loadCertificates = useCallback(async () => {
    try {
      setError("");
      const data = await adminCertificateService.getAll();
      setCertificates(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load certificates."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCertificates();
  }, [loadCertificates]);

  const filteredCertificates = useMemo(() => {
    return certificates
      .filter((certificate) => {
        const searchText = search.trim().toLowerCase();

        const matchesSearch =
          certificate.title.toLowerCase().includes(searchText) ||
          certificate.issuer.toLowerCase().includes(searchText) ||
          (certificate.credentialId || "")
            .toLowerCase()
            .includes(searchText);

        const matchesVisibility =
          visibility === "all" ||
          (visibility === "visible" && certificate.isVisible) ||
          (visibility === "hidden" && !certificate.isVisible);

        return matchesSearch && matchesVisibility;
      })
      .sort(
        (a, b) =>
          a.sortOrder - b.sortOrder ||
          a.title.localeCompare(b.title)
      );
  }, [certificates, search, visibility]);

  async function toggleVisibility(certificate: Certificate) {
    try {
      setActionId(certificate._id);
      setError("");

      await adminCertificateService.update(certificate._id, {
        isVisible: !certificate.isVisible,
      });

      await loadCertificates();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update certificate visibility."
      );
    } finally {
      setActionId(null);
    }
  }

  async function deleteCertificate(certificate: Certificate) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${certificate.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setActionId(certificate._id);
      setError("");

      await adminCertificateService.delete(certificate._id);
      await loadCertificates();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not delete certificate."
      );
    } finally {
      setActionId(null);
    }
  }

  const visibleCount = certificates.filter(
    (certificate) => certificate.isVisible
  ).length;

  const hiddenCount = certificates.length - visibleCount;

  return (
    <div className="admin-certificates-page">
      <div className="admin-certificates-heading">
        <div>
          <span className="admin-eyebrow">
            CONTENT MANAGEMENT / CERTIFICATES
          </span>

          <h1>Certificates</h1>

          <p>
            Manage your professional certificates and credentials.
          </p>
        </div>

        <Link
          href="/admin/certificates/new"
          className="admin-button"
        >
          + Add Certificate
        </Link>
      </div>

      <div className="admin-certificate-summary">
        <div className="admin-card">
          <span>Total Certificates</span>
          <strong>{certificates.length}</strong>
        </div>

        <div className="admin-card">
          <span>Visible</span>
          <strong>{visibleCount}</strong>
        </div>

        <div className="admin-card">
          <span>Hidden</span>
          <strong>{hiddenCount}</strong>
        </div>
      </div>

      {error && (
        <div className="admin-project-error" role="alert">
          {error}
        </div>
      )}

      <section className="admin-card admin-certificate-list">
        <div className="admin-certificate-list-heading">
          <div>
            <h2>All Certificates</h2>
            <p>Your professional achievements and credentials</p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={() => void loadCertificates()}
            disabled={loading}
          >
            ↻ Refresh
          </button>
        </div>

        <div className="admin-certificate-toolbar">
          <input
            type="search"
            placeholder="Search certificates..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search certificates"
          />

          <select
            value={visibility}
            onChange={(event) => setVisibility(event.target.value)}
            aria-label="Filter certificates by visibility"
          >
            <option value="all">All certificates</option>
            <option value="visible">Visible only</option>
            <option value="hidden">Hidden only</option>
          </select>
        </div>

        {loading ? (
          <div className="admin-project-empty">
            Loading certificates...
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div className="admin-project-empty">
            <h3>
              {certificates.length === 0
                ? "No certificates found"
                : "No matching certificates"}
            </h3>

            <p>
              {certificates.length === 0
                ? "Add your first certificate to get started."
                : "Try changing your search or visibility filter."}
            </p>
          </div>
        ) : (
          <div className="admin-project-table-wrapper">
            <table className="admin-project-table admin-certificate-table">
              <thead>
                <tr>
                  <th>Certificate</th>
                  <th>Issuer</th>
                  <th>Issue Date</th>
                  <th>Visibility</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredCertificates.map((certificate) => (
                  <tr key={certificate._id}>
                    <td>
                      <div className="admin-certificate-name">
                        {certificate.imageUrl ? (
                          <img
                            src={certificate.imageUrl}
                            alt=""
                          />
                        ) : (
                          <div className="admin-certificate-icon">
                            <span>✦</span>
                          </div>
                        )}

                        <div>
                          <strong>{certificate.title}</strong>

                          {certificate.credentialId && (
                            <small>
                              ID: {certificate.credentialId}
                            </small>
                          )}
                        </div>
                      </div>
                    </td>

                    <td>{certificate.issuer}</td>

                    <td>
                      {certificate.issueDate
                        ? new Date(
                            certificate.issueDate
                          ).toLocaleDateString()
                        : "—"}
                    </td>

                    <td>
                      <span
                        className={`admin-certificate-visibility ${
                          certificate.isVisible
                            ? "visible"
                            : "hidden"
                        }`}
                      >
                        {certificate.isVisible
                          ? "Visible"
                          : "Hidden"}
                      </span>
                    </td>

                    <td>
                      <div className="admin-project-actions">
                        <Link
                          href={`/admin/certificates/${certificate._id}/edit`}
                          className="admin-project-action"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          className="admin-project-action"
                          onClick={() =>
                            void toggleVisibility(certificate)
                          }
                          disabled={actionId === certificate._id}
                        >
                          {actionId === certificate._id
                            ? "Please wait..."
                            : certificate.isVisible
                              ? "Hide"
                              : "Show"}
                        </button>

                        <button
                          type="button"
                          className="admin-project-action danger"
                          onClick={() =>
                            void deleteCertificate(certificate)
                          }
                          disabled={actionId === certificate._id}
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

        {!loading && certificates.length > 0 && (
          <div className="admin-certificate-results">
            Showing {filteredCertificates.length} of{" "}
            {certificates.length} certificates
          </div>
        )}
      </section>
    </div>
  );
}
