
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginAdmin } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      await loginAdmin({
        email: email.trim(),
        password,
      });

      router.replace("/admin");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to sign in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <div className="admin-login-glow" />

      <div className="admin-login-card">
        <a href="/" className="admin-login-brand">
          TAHA<span>.</span>OS
        </a>

        <div className="admin-login-heading">
          <span className="admin-eyebrow">
            ADMINISTRATOR ACCESS
          </span>

          <h1>Welcome back.</h1>

          <p>
            Sign in to manage your portfolio workspace.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-field">
            <label htmlFor="admin-email">Email address</label>

            <input
              id="admin-email"
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="username"
              maxLength={150}
              required
            />
          </div>

          <div className="admin-field">
            <label htmlFor="admin-password">Password</label>

            <input
              id="admin-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              minLength={8}
              required
            />
          </div>

          {error && (
            <div className="admin-login-error" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? "Authenticating..." : "Sign in to dashboard"}
            {!loading && <span>→</span>}
          </button>
        </form>

        <div className="admin-login-footer">
          <span className="admin-login-dot" />
          SECURE ADMINISTRATOR PORTAL
        </div>

        <a href="/" className="admin-back-link">
          ← Back to public portfolio
        </a>
      </div>
    </main>
  );
}
