// types/Portfolio.ts
export interface ProjectProp {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
}

export interface UserProp {
  uid?: string;
  username: string;
  email: string;
  age?: number;
  bio?: string;
  skills: string[];
  projects: ProjectProp[];
  experiences:ExperienceProp[];
}

export interface ExperienceProp {
  id: string;
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  currentlyWorking: boolean;
  description: string;
  skills: string[];
}