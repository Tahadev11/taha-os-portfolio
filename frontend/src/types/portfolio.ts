
export interface SocialLinks {
  github?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  website?: string;
  _id?: string;
}

export interface Profile {
  _id?: string;
  fullName: string;
  professionalTitle: string;
  shortIntro: string;
  about: string;
  profileImage?: string;
  location?: string;
  email?: string;
  phone?: string;
  socialLinks?: SocialLinks;
  resumeUrl?: string;
  isAvailable?: boolean;
  createdAt?: string;
  updatedAt?: string;
}


export interface Project {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  techStack: string[];
  thumbnail?: string;
  gallery?: string[];
  githubUrl?: string;
  liveUrl?: string;
  isFeatured: boolean;
  sortOrder: number;
  status: "draft" | "published";
  createdAt?: string;
  updatedAt?: string;
}



export interface Experience {
  _id: string;
  position: string;
  organization: string;
  type: "employment" | "internship" | "training" | "freelance";
  location?: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description?: string;
  responsibilities: string[];
  techStack: string[];
  sortOrder: number;
  isVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

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

