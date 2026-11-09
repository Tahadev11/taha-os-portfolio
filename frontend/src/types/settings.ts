export interface SettingsSocialLinks {
  github: string;
  linkedin: string;
  twitter: string;
  instagram: string;
}

export interface Settings {
  _id?: string;
  siteTitle: string;
  siteDescription: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  logoUrl: string;
  lightLogoUrl: string;
  faviconUrl: string;
  theme: "dark" | "light" | "system";
  socialLinks: SettingsSocialLinks;
  contactEmail: string;
  contactPhone: string;
  maintenanceMode: boolean;
  isWebsiteVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type UpdateSettingsData = Partial<Settings>;