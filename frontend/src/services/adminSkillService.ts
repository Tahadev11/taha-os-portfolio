
import { apiRequest } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";

import type {
  Skill,
  CreateSkillData,
  UpdateSkillData,
} from "@/types/skills";

function requireToken(): string {
  const token = getAdminToken();

  if (!token) {
    throw new Error(
      "Your admin session has expired. Please log in again."
    );
  }

  return token;
}

export const adminSkillService = {
  // Get all skills (including hidden skills)
  getAll(): Promise<Skill[]> {
    return apiRequest<Skill[]>("/skills", {
      method: "GET",
      token: requireToken(),
    });
  },

  // Get one skill
  getById(id: string): Promise<Skill> {
    return apiRequest<Skill>(`/skills/${id}`, {
      method: "GET",
      token: requireToken(),
    });
  },

  // Create a skill
  create(data: CreateSkillData): Promise<Skill> {
    return apiRequest<Skill>("/skills", {
      method: "POST",
      token: requireToken(),
      body: JSON.stringify(data),
    });
  },

  // Update a skill
  update(id: string, data: UpdateSkillData): Promise<Skill> {
    return apiRequest<Skill>(`/skills/${id}`, {
      method: "PATCH",
      token: requireToken(),
      body: JSON.stringify(data),
    });
  },

  // Delete a skill
  delete(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/skills/${id}`, {
      method: "DELETE",
      token: requireToken(),
    });
  },
};
