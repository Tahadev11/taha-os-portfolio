export default function ResumeViewPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#08090D",
        color: "#F5F7FF",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "20px",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: "24px" }}>
              Taha Siddique — Resume
            </h1>
            <p style={{ color: "#9299AA", marginTop: "6px" }}>
              Full Stack Developer
            </p>
          </div>

          <a
            href="/api/resume/view"
            download="Taha-Siddique-Resume.pdf"
            style={{
              background: "#4F8CFF",
              color: "#fff",
              padding: "11px 18px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Download Resume
          </a>
        </div>

        <iframe
          src="/api/resume/view"
          title="Taha Siddique Resume"
          style={{
            width: "100%",
            height: "calc(100vh - 150px)",
            minHeight: "600px",
            border: "1px solid #242938",
            borderRadius: "10px",
            background: "#fff",
          }}
        />
      </div>
    </main>
  );
}
