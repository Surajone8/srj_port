export type ProjectCategory = "fintech" | "ai" | "design-system" | "mobile" | "experimental";

export interface ProjectMetric {
  label: string;
  value: string;
  change?: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  year: number;
  featured: boolean;
  role: string;
  deliverables: string[];
  metrics: ProjectMetric[];
  techStack: string[];
  coverImage?: string;
  liveUrl?: string;
  caseStudyUrl?: string;
  figmaUrl?: string;
}

export interface WorkExperience {
  company: string;
  role: string;
  period: string;
  description: string;
  highlights: string[];
  skills: string[];
  logo?: string;
}

export interface SkillGroup {
  category: string;
  skills: {
    name: string;
    level: "expert" | "advanced" | "proficient";
    icon?: string;
  }[];
}
