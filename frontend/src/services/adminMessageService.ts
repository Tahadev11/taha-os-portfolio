
import { apiRequest } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";

export type MessageStatus = "unread" | "read" | "replied";

export interface MessageReply {
  _id?: string;
  body: string;
  sentAt: string;
  from: string;
  to: string;
}

export interface AdminMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  replies: MessageReply[];
  createdAt: string;
  updatedAt: string;
}

interface ReplyResponse {
  message: string;
  data: AdminMessage;
}

interface DeleteResponse {
  message: string;
}

function requireToken(): string {
  const token = getAdminToken();

  if (!token) {
    throw new Error("Your admin session has expired. Please log in again.");
  }

  return token;
}

export const adminMessageService = {
  getAll(): Promise<AdminMessage[]> {
    return apiRequest<AdminMessage[]>("/messages", {
      method: "GET",
      token: requireToken(),
    });
  },

  getUnreadCount(): Promise<number> {
    return apiRequest<number>("/messages/unread-count", {
      method: "GET",
      token: requireToken(),
    });
  },

  getById(id: string): Promise<AdminMessage> {
    return apiRequest<AdminMessage>(`/messages/${id}`, {
      method: "GET",
      token: requireToken(),
    });
  },

  updateStatus(
    id: string,
    status: "read" | "unread",
  ): Promise<AdminMessage> {
    return apiRequest<AdminMessage>(`/messages/${id}`, {
      method: "PATCH",
      token: requireToken(),
      body: JSON.stringify({ status }),
    });
  },

  reply(id: string, reply: string): Promise<ReplyResponse> {
    return apiRequest<ReplyResponse>(`/messages/${id}/reply`, {
      method: "POST",
      token: requireToken(),
      body: JSON.stringify({ reply }),
    });
  },

  delete(id: string): Promise<DeleteResponse> {
    return apiRequest<DeleteResponse>(`/messages/${id}`, {
      method: "DELETE",
      token: requireToken(),
    });
  },
};
