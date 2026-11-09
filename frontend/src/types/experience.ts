
export type ExperienceType =
  | "employment"
  | "internship"
  | "training"
  | "freelance";

export interface Experience {
  _id: string;
  position: string;
  organization: string;
  type: ExperienceType;
  location: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description: string;
  responsibilities: string[];
  techStack: string[];
  sortOrder: number;
  isVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateExperienceData = Omit<
  Experience,
  "_id" | "createdAt" | "updatedAt"
>;

export type UpdateExperienceData =
  Partial<CreateExperienceData>;
