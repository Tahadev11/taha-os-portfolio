
export interface Skill {
  _id: string;
  name: string;
  category: string;
  proficiency: number;
  icon: string;
  sortOrder: number;
  isVisible: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateSkillData = Omit<
  Skill,
  "_id" | "createdAt" | "updatedAt"
>;

export type UpdateSkillData = Partial<CreateSkillData>;
