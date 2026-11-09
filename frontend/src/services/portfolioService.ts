
import { apiRequest } from "@/lib/api";

import type {
  Profile,
  Project,
  Experience,
  Education,
} from "@/types/portfolio";

import type { Certificate } from "@/components/CertficatesSection";
import type { Skill } from "@/types/skills";
import type { Resume } from "@/types/resume";
import type { Settings } from "@/types/settings";

export interface CreateMessagePayload {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export const portfolioService = {
  getProfile(): Promise<Profile> {
    return apiRequest<Profile>("/profile");
  },

  getSettings(): Promise<Settings> {
    return apiRequest<Settings>("/settings/public");
  },

  getProjects(): Promise<Project[]> {
    return apiRequest<Project[]>("/projects/public");
  },

  getResume(): Promise<Resume> {
    return apiRequest<Resume>("/resume/public");
  },

  getProjectBySlug(slug: string): Promise<Project> {
    return apiRequest<Project>(
      `/projects/public/${encodeURIComponent(slug)}`
    );
  },

  getCertificates(): Promise<Certificate[]> {
    return apiRequest<Certificate[]>("/certificates/public");
  },

  getSkills(): Promise<Skill[]> {
    return apiRequest<Skill[]>("/skills/public");
  },

  getExperiences(): Promise<Experience[]> {
    return apiRequest<Experience[]>("/experience/public");
  },

  getEducation(): Promise<Education[]> {
    return apiRequest<Education[]>("/education/public");
  },

  createMessage(payload: CreateMessagePayload): Promise<unknown> {
    return apiRequest<unknown>("/messages/public", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
