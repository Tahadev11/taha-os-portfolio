
import { apiRequest } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";

import type {
  Education,
  CreateEducationData,
  UpdateEducationData,
} from "@/types/education";

export const adminEducationService = {
  getAll(): Promise<Education[]> {
    const token = getAdminToken();

    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return apiRequest<Education[]>("/education", {
      method: "GET",
      token,
    });
  },

  getById(id: string): Promise<Education> {
    const token = getAdminToken();

    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return apiRequest<Education>(`/education/${id}`, {
      method: "GET",
      token,
    });
  },

  create(data: CreateEducationData): Promise<Education> {
    const token = getAdminToken();

    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return apiRequest<Education>("/education", {
      method: "POST",
      token,
      body: JSON.stringify(data),
    });
  },

  update(
    id: string,
    data: UpdateEducationData
  ): Promise<Education> {
    const token = getAdminToken();

    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return apiRequest<Education>(`/education/${id}`, {
      method: "PATCH",
      token,
      body: JSON.stringify(data),
    });
  },

  delete(id: string): Promise<unknown> {
    const token = getAdminToken();

    if (!token) {
      throw new Error("Authentication required. Please log in.");
    }

    return apiRequest<unknown>(`/education/${id}`, {
      method: "DELETE",
      token,
    });
  },
};
