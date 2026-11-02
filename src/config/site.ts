export const siteConfig = {
  name: "Suraj Yadav",
  title: "Suraj Yadav — Software Developer | MERN Stack & Python ML",
  description:
    "Software Developer with proficiency in React.js, MERN stack, and Python Machine Learning. Building fast, scalable, and intelligent applications.",
  url: "https://surajyadav.dev",
  ogImage: "https://surajyadav.dev/og.jpg",
  creator: "@surajyadav",
  availability: {
    status: "available",
    period: "Q4 2026",
    label: "Available for Work",
    timezone: "IST (UTC+5:30)",
  },
  links: {
    github: "https://github.com/surajyadav",
    linkedin: "https://linkedin.com/in/surajyadav",
    twitter: "https://twitter.com/surajyadav",
    figma: "https://figma.com/@surajyadav",
    email: "mailto:ysuraj18333@gmail.com",
  },
} as const;

export type SiteConfig = typeof siteConfig;
