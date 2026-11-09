
"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { portfolioService } from "@/services/portfolioService";

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSuccess("");
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      await portfolioService.createMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        subject: formData.subject.trim(),
        message: formData.message.trim(),
      });

      setSuccess(
        "Message sent successfully! Thank you for reaching out."
      );

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="contact-section">
      <div className="contact-header">
        <span className="contact-label">GET IN TOUCH</span>
        <h2>Let's work together.</h2>
        <p>
          Have a project idea, opportunity, or just want to say hello?
          Send me a message.
        </p>
      </div>

      <div className="contact-layout">
        <div className="contact-info">
          <div className="contact-info-card">
            <span className="contact-info-icon">&gt;_</span>
            <h3>Let's connect</h3>
            <p>
              I'm always interested in discussing software development,
              backend engineering, and new opportunities.
            </p>
          </div>

          <div className="contact-terminal-note">
            <span className="contact-note-dot" />
            <span>Currently accepting opportunities</span>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="contact-form-heading">
            <span>01 / SEND MESSAGE</span>
            <span className="contact-form-status">
              {loading ? "SENDING..." : "READY"}
            </span>
          </div>

          <div className="contact-form-group">
            <label htmlFor="contact-name">Your name *</label>
            <input
              id="contact-name"
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              maxLength={100}
              required
            />
          </div>

          <div className="contact-form-group">
            <label htmlFor="contact-email">Email address *</label>
            <input
              id="contact-email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              maxLength={150}
              required
            />
          </div>

          <div className="contact-form-group">
            <label htmlFor="contact-subject">Subject</label>
            <input
              id="contact-subject"
              type="text"
              name="subject"
              placeholder="What is this about?"
              value={formData.subject}
              onChange={handleChange}
              maxLength={150}
            />
          </div>

          <div className="contact-form-group">
            <label htmlFor="contact-message">Your message *</label>
            <textarea
              id="contact-message"
              name="message"
              placeholder="Write your message here..."
              value={formData.message}
              onChange={handleChange}
              maxLength={5000}
              rows={6}
              required
            />
            <span className="contact-character-count">
              {formData.message.length}/5000
            </span>
          </div>

          {success && (
            <div className="contact-feedback contact-success" role="status">
              <span>✓</span> {success}
            </div>
          )}

          {error && (
            <div className="contact-feedback contact-error" role="alert">
              <span>!</span> {error}
            </div>
          )}

          <button
            type="submit"
            className="contact-submit-button"
            disabled={loading}
          >
            {loading ? "Sending message..." : "Send message →"}
          </button>

          <p className="contact-form-footer">
            * Required fields. Your message will be sent securely.
          </p>
        </form>
      </div>
    </section>
  );
}
