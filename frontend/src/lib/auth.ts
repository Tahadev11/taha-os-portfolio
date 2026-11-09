
import { apiRequest } from "@/lib/api";

export interface AdminUser {
    id: string;
    name?: string;
    email: string;
    role: string;
}

interface LoginResponse {
    message: string;
    accessToken: string;
    admin: AdminUser;
}

interface CurrentAdminResponse {
    message: string;
    admin: AdminUser;
}

interface LoginCredentials {
    email: string;
    password: string;
}

const TOKEN_KEY = "admin_access_token";

export async function loginAdmin(
    credentials: LoginCredentials
): Promise<AdminUser> {
    const response = await apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
    });

    if (!response.accessToken) {
        throw new Error("Login response did not contain an access token.");
    }

    localStorage.setItem(TOKEN_KEY, response.accessToken);

    return response.admin;
}

export function getAdminToken(): string | null {
    if (typeof window === "undefined") {
        return null;
    }

    return localStorage.getItem(TOKEN_KEY);
}

export async function verifyAdmin(
    token: string
): Promise<AdminUser> {
    const response = await apiRequest<CurrentAdminResponse>("/auth/me", {
        method: "GET",
        token,
    });

    return response.admin;
}

export function logoutAdmin(): void {
    if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_KEY);
    }
}
