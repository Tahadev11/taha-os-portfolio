
export interface Resume {
  _id: string;
  title: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateResumeData = Omit<
  Resume,
  "_id" | "createdAt" | "updatedAt"
>;

export type UpdateResumeData = Partial<CreateResumeData>;
