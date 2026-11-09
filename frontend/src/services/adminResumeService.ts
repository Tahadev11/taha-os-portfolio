
import { apiRequest } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";
import { adminProjectService } from "@/services/adminProjectService";
import type { Resume } from "@/types/resume";

import type {
  CreateResumeData,
  UpdateResumeData,
} from "@/types/resume";

function requireToken(): string {
  const token = getAdminToken();

  if (!token) {
    throw new Error("You are not logged in. Please log in again.");
  }

  return token;
}

export const adminResumeService = {
  // Get all resumes (Admin)
  getAll(): Promise<Resume[]> {
    return apiRequest<Resume[]>("/resume", {
      method: "GET",
      token: requireToken(),
    });
  },

  // Get resume by ID (Admin)
  getById(id: string): Promise<Resume> {
    return apiRequest<Resume>(`/resume/${id}`, {
      method: "GET",
      token: requireToken(),
    });
  },

  // Create resume
  create(data: CreateResumeData): Promise<Resume> {
    return apiRequest<Resume>("/resume", {
      method: "POST",
      token: requireToken(),
      body: JSON.stringify(data),
    });
  },

  // Update resume
  update(
    id: string,
    data: UpdateResumeData
  ): Promise<Resume> {
    return apiRequest<Resume>(`/resume/${id}`, {
      method: "PATCH",
      token: requireToken(),
      body: JSON.stringify(data),
    });
  },

  // Delete resume
  delete(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/resume/${id}`, {
      method: "DELETE",
      token: requireToken(),
    });
  },

  // Upload PDF to Cloudinary
  async uploadFile(file: File) {
    if (file.type !== "application/pdf") {
      throw new Error("Only PDF files are allowed.");
    }

    if (file.size > 10 * 1024 * 1024) {
      throw new Error("PDF file size must not exceed 10 MB.");
    }

    return adminProjectService.uploadFile(file);
  },
};
