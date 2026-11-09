
import { apiRequest } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export interface AdminProject {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  techStack: string[];
  thumbnail: string;
  gallery: string[];
  githubUrl: string;
  liveUrl: string;
  isFeatured: boolean;
  sortOrder: number;
  status: "draft" | "published";
  createdAt?: string;
  updatedAt?: string;
}

export type CreateProjectData = Omit<
  AdminProject,
  "_id" | "createdAt" | "updatedAt"
>;

interface UploadResponse {
  message: string;
  file: {
    url: string;
    publicId: string;
    fileName: string;
    fileSize: number;
    format: string;
    resourceType: string;
  };
}

function requireToken(): string {
  const token = getAdminToken();

  if (!token) {
    throw new Error("You are not logged in. Please log in again.");
  }

  return token;
}

export const adminProjectService = {
  getAll(): Promise<AdminProject[]> {
    return apiRequest<AdminProject[]>("/projects", {
      method: "GET",
      token: requireToken(),
    });
  },

  create(data: CreateProjectData): Promise<AdminProject> {
    return apiRequest<AdminProject>("/projects", {
      method: "POST",
      token: requireToken(),
      body: JSON.stringify(data),
    });
  },

  update(
    id: string,
    data: Partial<AdminProject>
  ): Promise<AdminProject> {
    return apiRequest<AdminProject>(`/projects/${id}`, {
      method: "PATCH",
      token: requireToken(),
      body: JSON.stringify(data),
    });
  },

  delete(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/projects/${id}`, {
      method: "DELETE",
      token: requireToken(),
    });
  },

  async uploadFile(file: File): Promise<UploadResponse["file"]> {
    const token = requireToken();

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/uploads`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();

      let message: string | string[] = errorText || "Image upload failed.";

      try {
        const parsed = JSON.parse(errorText);
        message = parsed.message || message;
      } catch {
        // Keep the original error message.
      }

      throw new Error(
        Array.isArray(message) ? message.join(", ") : message
      );
    }

    const result: UploadResponse = await response.json();

    return result.file;
  },
};
