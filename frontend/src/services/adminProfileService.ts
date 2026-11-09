import { apiRequest } from "@/lib/api";
import { getAdminToken } from "@/lib/auth";

import type {
  Profile,
  UpdateProfileData,
} from "@/types/profile";

function requireToken(): string {
  const token = getAdminToken();

  if (!token) {
    throw new Error("You are not logged in. Please log in again.");
  }

  return token;
}

export const adminProfileService = {
  getProfile(): Promise<Profile | null> {
    return apiRequest<Profile | null>("/profile", {
      method: "GET",
      token: requireToken(),
    });
  },

  updateProfile(data: UpdateProfileData): Promise<Profile> {
    return apiRequest<Profile>("/profile", {
      method: "PATCH",
      token: requireToken(),
      body: JSON.stringify(data),
    });
  },
};