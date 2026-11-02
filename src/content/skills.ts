import { SkillGroup } from "@/types";

export const skillGroups: SkillGroup[] = [
  {
    category: "Frontend & Web Technologies",
    skills: [
      { name: "React.js & Next.js (App Router, SSR)", level: "expert" },
      { name: "JavaScript (ES6+) & TypeScript", level: "expert" },
      { name: "HTML5, CSS3 & Tailwind CSS", level: "expert" },
      { name: "State Management (Redux Toolkit, Context API)", level: "advanced" },
      { name: "RESTful APIs & GraphQL Integration", level: "expert" },
    ],
  },
  {
    category: "Backend & MERN Stack",
    skills: [
      { name: "Node.js & Express.js", level: "expert" },
      { name: "MongoDB & Mongoose (Schema, Aggregations)", level: "expert" },
      { name: "Authentication & Security (JWT, OAuth, bcrypt)", level: "advanced" },
      { name: "Database Design & Optimization", level: "advanced" },
      { name: "API Architecture & Microservices", level: "proficient" },
    ],
  },
  {
    category: "Python & Machine Learning",
    skills: [
      { name: "Python Core & OOP", level: "expert" },
      { name: "Data Processing (NumPy, Pandas)", level: "advanced" },
      { name: "Machine Learning (Scikit-Learn, Supervised/Unsupervised)", level: "advanced" },
      { name: "Model Evaluation & Data Preprocessing", level: "advanced" },
      { name: "FastAPI / Flask for ML Model Serving", level: "proficient" },
    ],
  },
];
