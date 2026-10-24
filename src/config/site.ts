export const siteConfig = {
  name: "Neeraj Yadav",
  title: "Neeraj Yadav — Senior Product Designer & Design Technologist",
  description:
    "Designing intelligent interfaces, design systems, and craft-driven software with precision, code, and empathy.",
  url: "https://neerajyadav.design",
  ogImage: "https://neerajyadav.design/og.jpg",
  creator: "@neerajyadav",
  availability: {
    status: "available",
    period: "Q4 2026",
    label: "Available for Q4/2026",
    timezone: "IST (UTC+5:30)",
  },
  links: {
    github: "https://github.com/neerajyadav",
    linkedin: "https://linkedin.com/in/neerajyadav",
    twitter: "https://twitter.com/neerajyadav",
    figma: "https://figma.com/@neerajyadav",
    email: "mailto:hello@neerajyadav.design",
  },
} as const;

export type SiteConfig = typeof siteConfig;
