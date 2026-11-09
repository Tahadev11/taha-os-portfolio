
export interface Certificate {
  _id: string;
  title: string;
  issuer: string;
  issueDate?: string;
  credentialUrl?: string;
  imageUrl?: string;
}

interface CertificatesSectionProps {
  certificates: Certificate[];
  loading: boolean;
}

export default function CertificatesSection({
  certificates,
  loading,
}: CertificatesSectionProps) {
  return (
    <section className="quick-access">
      <div className="quick-access-heading">
        <span>MY CERTIFICATES</span>
        <span>
          {certificates.length} CERTIFICATE
          {certificates.length === 1 ? "" : "S"}
        </span>
      </div>

      {loading ? (
        <p className="hero-description">
          Loading certificates...
        </p>
      ) : certificates.length > 0 ? (
        <div className="quick-grid">
          {certificates.map((certificate) => (
            <article
              className="project-card certificate-card"
              key={certificate._id}
            >
              <div className="project-card-header">
                <span className="quick-card-icon">▤</span>
              </div>

              {certificate.imageUrl && (
                <a
                  href={certificate.imageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="certificate-image-wrapper"
                  aria-label={`View ${certificate.title} image`}
                >
                  <img
                    src={certificate.imageUrl}
                    alt={`${certificate.title} certificate`}
                    className="certificate-image"
                    loading="lazy"
                  />
                </a>
              )}

              <h3 className="project-card-title">
                {certificate.title}
              </h3>

              <p className="hero-description">
                Issued by {certificate.issuer}
              </p>

              {certificate.issueDate && (
                <p className="hero-description">
                  {new Date(
                    certificate.issueDate
                  ).toLocaleDateString()}
                </p>
              )}

              {certificate.credentialUrl && (
                <div className="project-card-actions">
                  <a
                    className="secondary-button"
                    href={certificate.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Verify Certificate ↗
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <p className="hero-description">
          No certificates available yet.
        </p>
      )}
    </section>
  );
}
