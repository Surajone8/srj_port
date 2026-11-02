export type ProjectCategory = "web-app" | "ai-ml" | "mern-stack" | "frontend" | "full-stack";

export interface ProjectMetric {
  label: string;
  value: string;
  change?: string;
}

export interface Project {
  id: string;
  slug: string;
  num: string;
  title: string;
  tagline: string;
  description: string;
  category: ProjectCategory;
  categoryLabel: string;
  year: number;
  featured: boolean;
  role: string;
  tags: string[];
  deliverables?: string[];
  metrics?: ProjectMetric[];
  techStack: string[];
  coverImage?: string;
  previewGradient?: string;
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
