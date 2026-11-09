import { apiRequest } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";

import type {
  Settings,
  UpdateSettingsData,
} from "@/types/settings";

interface UpdateSettingsResponse {
  message: string;
  settings: Settings;
}

function requireToken(): string {
  const token = getAdminToken();

  if (!token) {
    throw new Error("You are not logged in. Please log in again.");
  }

  return token;
}

export const adminSettingsService = {
  getSettings(): Promise<Settings> {
    return apiRequest<Settings>("/settings", {
      method: "GET",
      token: requireToken(),
    });
  },

  async updateSettings(
    data: UpdateSettingsData,
  ): Promise<Settings> {
    const response =
      await apiRequest<UpdateSettingsResponse>("/settings", {
        method: "PATCH",
        token: requireToken(),
        body: JSON.stringify(data),
      });

    return response.settings;
  },
};