import { apiRequest } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";

import type {
  Certificate,
  CreateCertificateData,
  UpdateCertificateData,
} from "@/types/certificates";

function requireToken(): string {
  const token = getAdminToken();

  if (!token) {
    throw new Error(
      "Your admin session has expired. Please log in again."
    );
  }

  return token;
}

export const adminCertificateService = {
  getAll(): Promise<Certificate[]> {
    return apiRequest<Certificate[]>("/certificates", {
      method: "GET",
      token: requireToken(),
    });
  },

  getById(id: string): Promise<Certificate> {
    return apiRequest<Certificate>(`/certificates/${id}`, {
      method: "GET",
      token: requireToken(),
    });
  },

  create(data: CreateCertificateData): Promise<Certificate> {
    return apiRequest<Certificate>("/certificates", {
      method: "POST",
      token: requireToken(),
      body: JSON.stringify(data),
    });
  },

  update(
    id: string,
    data: UpdateCertificateData
  ): Promise<Certificate> {
    return apiRequest<Certificate>(`/certificates/${id}`, {
      method: "PATCH",
      token: requireToken(),
      body: JSON.stringify(data),
    });
  },

  delete(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(
      `/certificates/${id}`,
      {
        method: "DELETE",
        token: requireToken(),
      }
    );
  },
};