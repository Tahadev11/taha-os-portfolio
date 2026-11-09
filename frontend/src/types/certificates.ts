export interface Certificate {
  _id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  imageUrl?: string;
  description?: string;
  skills: string[];
  sortOrder: number;
  isVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateCertificateData = Omit<
  Certificate,
  "_id" | "createdAt" | "updatedAt"
>;

export type UpdateCertificateData =
  Partial<CreateCertificateData>;