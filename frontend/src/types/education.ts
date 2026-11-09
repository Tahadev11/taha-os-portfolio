
export interface Education {
  _id: string;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  grade?: string;
  description?: string;
  sortOrder: number;
  isVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateEducationData = Omit<
  Education,
  "_id" | "createdAt" | "updatedAt"
>;

export type UpdateEducationData = Partial<CreateEducationData>;
