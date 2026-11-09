
"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";import {
  adminMessageService,
  type AdminMessage,
  type MessageStatus,
} from "@/services/adminMessageService";

type MessageFilter = "all" | MessageStatus;

function formatDate(date: string): string {
  return new Date(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || "?";
}

export default function AdminMessagesClient() {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [selectedMessage, setSelectedMessage] =
    useState<AdminMessage | null>(null);

  const [filter, setFilter] = useState<MessageFilter>("all");
  const [search, setSearch] = useState("");
  const [replyText, setReplyText] = useState("");

  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [messageData, unreadData] = await Promise.all([
        adminMessageService.getAll(),
        adminMessageService.getUnreadCount(),
      ]);

      setMessages(messageData);
      setUnreadCount(unreadData);

      setSelectedMessage((current) => {
        if (!current) return null;

        return messageData.find(
          (message) => message._id === current._id,
        ) || null;
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load messages.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  const filteredMessages = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return messages.filter((message) => {
      const matchesFilter =
        filter === "all" || message.status === filter;

      const matchesSearch =
        !normalizedSearch ||
        message.name.toLowerCase().includes(normalizedSearch) ||
        message.email.toLowerCase().includes(normalizedSearch) ||
        message.subject.toLowerCase().includes(normalizedSearch) ||
        message.message.toLowerCase().includes(normalizedSearch);

      return matchesFilter && matchesSearch;
    });
  }, [messages, filter, search]);

  const counts = useMemo(
    () => ({
      all: messages.length,
      unread: messages.filter((item) => item.status === "unread").length,
      read: messages.filter((item) => item.status === "read").length,
      replied: messages.filter((item) => item.status === "replied").length,
    }),
    [messages],
  );

  async function openMessage(id: string) {
    setDetailLoading(true);
    setError("");
    setSuccess("");
    setReplyText("");

    try {
      const message = await adminMessageService.getById(id);

      setSelectedMessage(message);

      // Opening an unread message automatically marks it as read
      // in the backend. Update the inbox and unread counter too.
      setMessages((current) =>
        current.map((item) =>
          item._id === message._id ? message : item,
        ),
      );

      const newUnreadCount = await adminMessageService.getUnreadCount();
      setUnreadCount(newUnreadCount);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to open this message.",
      );
    } finally {
      setDetailLoading(false);
    }
  }

async function handleReply(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

    if (!selectedMessage || !replyText.trim()) return;

    setSending(true);
    setError("");
    setSuccess("");

    try {
      const response = await adminMessageService.reply(
        selectedMessage._id,
        replyText.trim(),
      );

      setSelectedMessage(response.data);

      setMessages((current) =>
        current.map((item) =>
          item._id === response.data._id ? response.data : item,
        ),
      );

      setReplyText("");
      setSuccess("Your email reply was sent successfully.");

      const newUnreadCount = await adminMessageService.getUnreadCount();
      setUnreadCount(newUnreadCount);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to send your reply.",
      );
    } finally {
      setSending(false);
    }
  }

  async function handleStatusChange(status: "read" | "unread") {
    if (!selectedMessage) return;

    setError("");
    setSuccess("");

    try {
      const updated = await adminMessageService.updateStatus(
        selectedMessage._id,
        status,
      );

      setSelectedMessage(updated);

      setMessages((current) =>
        current.map((item) =>
          item._id === updated._id ? updated : item,
        ),
      );

      const newUnreadCount = await adminMessageService.getUnreadCount();
      setUnreadCount(newUnreadCount);

      setSuccess(
        status === "read"
          ? "Message marked as read."
          : "Message marked as unread.",
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update message status.",
      );
    }
  }

  async function handleDelete() {
    if (!selectedMessage) return;

    const confirmed = window.confirm(
      `Delete the message from ${selectedMessage.name}? This cannot be undone.`,
    );

    if (!confirmed) return;

    setDeleting(true);
    setError("");
    setSuccess("");

    try {
      await adminMessageService.delete(selectedMessage._id);

      setMessages((current) =>
        current.filter((item) => item._id !== selectedMessage._id),
      );

      setSelectedMessage(null);
      setReplyText("");
      setSuccess("Message deleted successfully.");

      const newUnreadCount = await adminMessageService.getUnreadCount();
      setUnreadCount(newUnreadCount);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete this message.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="admin-messages-page">
      <section className="admin-messages-heading">
        <div>
          <span className="admin-eyebrow">COMMUNICATION / INBOX</span>
          <h1>Messages</h1>
          <p>
            Manage contact form submissions and reply directly to visitors.
          </p>
        </div>

        <button
          type="button"
          className="admin-refresh-button"
          onClick={() => void loadMessages()}
          disabled={loading}
        >
          ↻ Refresh inbox
        </button>
      </section>

      <section className="admin-message-stats">
        <div className="admin-card">
          <span>Total messages</span>
          <strong>{counts.all}</strong>
        </div>

        <div className="admin-card">
          <span>Unread messages</span>
          <strong>{unreadCount}</strong>
        </div>

        <div className="admin-card">
          <span>Read messages</span>
          <strong>{counts.read}</strong>
        </div>

        <div className="admin-card">
          <span>Replied messages</span>
          <strong>{counts.replied}</strong>
        </div>
      </section>

      {error && (
        <div className="admin-project-error" role="alert">
          {error}
        </div>
      )}

      {success && (
        <div className="admin-message-success" role="status">
          {success}
        </div>
      )}

      <section className="admin-message-workspace">
        <aside className="admin-message-inbox">
          <div className="admin-message-inbox-heading">
            <div>
              <h2>Inbox</h2>
              <span>{messages.length} messages</span>
            </div>

            <span className="admin-message-unread-indicator">
              {unreadCount} unread
            </span>
          </div>

          <div className="admin-message-search">
            <input
              type="search"
              placeholder="Search messages..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search messages"
            />
          </div>

          <div className="admin-message-filters">
            {(["all", "unread", "read", "replied"] as MessageFilter[]).map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  className={filter === item ? "active" : ""}
                  onClick={() => setFilter(item)}
                >
                  {item === "all"
                    ? "All"
                    : item.charAt(0).toUpperCase() + item.slice(1)}
                  <span>{counts[item]}</span>
                </button>
              ),
            )}
          </div>

          <div className="admin-message-list">
            {loading ? (
              <div className="admin-message-empty">
                Loading messages...
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="admin-message-empty">
                <span>✉</span>
                <strong>No messages found</strong>
                <p>Try another filter or search term.</p>
              </div>
            ) : (
              filteredMessages.map((message) => (
                <button
                  key={message._id}
                  type="button"
                  className={`admin-message-item ${
                    selectedMessage?._id === message._id ? "selected" : ""
                  } ${message.status === "unread" ? "unread" : ""}`}
                  onClick={() => void openMessage(message._id)}
                >
                  <span className="admin-message-avatar">
                    {getInitial(message.name)}
                  </span>

                  <span className="admin-message-item-content">
                    <span className="admin-message-item-top">
                      <strong>{message.name}</strong>
                      <time>{formatDate(message.createdAt)}</time>
                    </span>

                    <span className="admin-message-item-subject">
                      {message.subject || "No subject"}
                    </span>

                    <span className="admin-message-item-preview">
                      {message.message}
                    </span>

                    <span className={`admin-message-status ${message.status}`}>
                      {message.status}
                    </span>
                  </span>

                  {message.status === "unread" && (
                    <span
                      className="admin-message-unread-dot"
                      aria-label="Unread"
                    />
                  )}
                </button>
              ))
            )}
          </div>
        </aside>

        <div className="admin-message-detail">
          {detailLoading ? (
            <div className="admin-message-detail-empty">
              Loading message...
            </div>
          ) : !selectedMessage ? (
            <div className="admin-message-detail-empty">
              <span>✉</span>
              <h2>Select a message</h2>
              <p>
                Choose a message from your inbox to read it and send a reply.
              </p>
            </div>
          ) : (
            <>
              <div className="admin-message-detail-header">
                <div>
                  <span className="admin-eyebrow">MESSAGE DETAILS</span>
                  <h2>{selectedMessage.subject || "No subject"}</h2>
                </div>

                <div className="admin-message-detail-actions">
                  {selectedMessage.status !== "replied" && (
                    <button
                      type="button"
                      className="admin-message-secondary-button"
                      onClick={() =>
                        void handleStatusChange(
                          selectedMessage.status === "unread" ? "read" : "unread",
                        )
                      }
                    >
                      {selectedMessage.status === "unread"
                        ? "Mark as read"
                        : "Mark unread"}
                    </button>
                  )}

                  <button
                    type="button"
                    className="admin-message-delete-button"
                    onClick={() => void handleDelete()}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>

              <div className="admin-message-sender">
                <span className="admin-message-avatar large">
                  {getInitial(selectedMessage.name)}
                </span>

                <div>
                  <strong>{selectedMessage.name}</strong>
                  <a href={`mailto:${selectedMessage.email}`}>
                    {selectedMessage.email}
                  </a>
                  <span>Received {formatDate(selectedMessage.createdAt)}</span>
                </div>

                <span className={`admin-message-status ${selectedMessage.status}`}>
                  {selectedMessage.status}
                </span>
              </div>

              <div className="admin-message-original">
                <span className="admin-eyebrow">ORIGINAL MESSAGE</span>
                <p>{selectedMessage.message}</p>
              </div>

              <div className="admin-message-conversation">
                <div className="admin-message-conversation-heading">
                  <h3>Conversation history</h3>
                  <span>{selectedMessage.replies?.length || 0} replies</span>
                </div>

                {!selectedMessage.replies?.length ? (
                  <div className="admin-message-no-replies">
                    No replies have been sent yet.
                  </div>
                ) : (
                  <div className="admin-message-replies">
                    {selectedMessage.replies.map((reply, index) => (
                      <article
                        className="admin-message-reply"
                        key={reply._id || `${reply.sentAt}-${index}`}
                      >
                        <div className="admin-message-reply-heading">
                          <strong>You</strong>
                          <time>{formatDate(reply.sentAt)}</time>
                        </div>

                        <p>{reply.body}</p>

                        <div className="admin-message-reply-address">
                          To: {reply.to}
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>

              <form
                className="admin-message-reply-form"
                onSubmit={handleReply}
              >
                <div className="admin-message-conversation-heading">
                  <h3>Send a reply</h3>
                  <span>Via email</span>
                </div>

                <div className="admin-message-recipient">
                  <span>TO</span>
                  <strong>{selectedMessage.email}</strong>
                </div>

                <textarea
                  value={replyText}
                  onChange={(event) => setReplyText(event.target.value)}
                  placeholder="Write your reply here..."
                  rows={6}
                  maxLength={5000}
                  required
                />

                <div className="admin-message-reply-footer">
                  <span>{replyText.length}/5000 characters</span>

                  <button
                    type="submit"
                    className="admin-button"
                    disabled={sending || !replyText.trim()}
                  >
                    {sending ? "Sending email..." : "↗ Send email reply"}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
