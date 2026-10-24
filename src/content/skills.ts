import { SkillGroup } from "@/types";

export const skillGroups: SkillGroup[] = [
  {
    category: "Product & UI/UX Design",
    skills: [
      { name: "Figma & FigJam (Variables, Auto-layout, Variants)", level: "expert" },
      { name: "Design Systems & Token Architecture", level: "expert" },
      { name: "Complex Interaction & Motion Design", level: "expert" },
      { name: "User Research & Usability Testing", level: "advanced" },
      { name: "Information Architecture & Wireframing", level: "expert" },
    ],
  },
  {
    category: "Design Engineering & Frontend",
    skills: [
      { name: "React 19 & Next.js App Router", level: "expert" },
      { name: "TypeScript & Strict Type Modeling", level: "expert" },
      { name: "Tailwind CSS & Modern CSS (OKLCH, Subgrid)", level: "expert" },
      { name: "HTML Canvas & Micro-animations", level: "advanced" },
      { name: "Accessibility (WCAG 2.2 AAA Standards)", level: "expert" },
    ],
  },
  {
    category: "Tools & Methodologies",
    skills: [
      { name: "Framer Motion & Spring Physics", level: "advanced" },
      { name: "Git & Version Control Workflows", level: "expert" },
      { name: "Design Sprint & Agile Delivery", level: "expert" },
      { name: "Dev Mode & Code Connect Bridging", level: "expert" },
    ],
  },
];
