
import { apiRequest } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";

import type {
  Experience,
  CreateExperienceData,
  UpdateExperienceData,
} from "@/types/experience";

export const adminExperienceService = {
  async getAll(): Promise<Experience[]> {
    const token = getAdminToken();

    if (!token) {
      throw new Error("Admin authentication required.");
    }

    return apiRequest<Experience[]>("/experience", {
      method: "GET",
      token,
    });
  },

  async getById(id: string): Promise<Experience> {
    const token = getAdminToken();

    if (!token) {
      throw new Error("Admin authentication required.");
    }

    return apiRequest<Experience>(`/experience/${id}`, {
      method: "GET",
      token,
    });
  },

  async create(
    data: CreateExperienceData
  ): Promise<Experience> {
    const token = getAdminToken();

    if (!token) {
      throw new Error("Admin authentication required.");
    }

    return apiRequest<Experience>("/experience", {
      method: "POST",
      body: JSON.stringify(data),
      token,
    });
  },

  async update(
    id: string,
    data: UpdateExperienceData
  ): Promise<Experience> {
    const token = getAdminToken();

    if (!token) {
      throw new Error("Admin authentication required.");
    }

    return apiRequest<Experience>(`/experience/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      token,
    });
  },

  async delete(id: string): Promise<{ message: string }> {
    const token = getAdminToken();

    if (!token) {
      throw new Error("Admin authentication required.");
    }

    return apiRequest<{ message: string }>(
      `/experience/${id}`,
      {
        method: "DELETE",
        token,
      }
    );
  },
};
