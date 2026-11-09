export interface ProfileSocialLinks {
  github: string;
  linkedin: string;
  website: string;
}

export interface Profile {
  _id?: string;
  fullName: string;
  professionalTitle: string;
  shortIntro: string;
  about: string;
  profileImage: string;
  location: string;
  email: string;
  phone: string;
  socialLinks: ProfileSocialLinks;
  resumeUrl: string;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type UpdateProfileData = Partial<Profile>;