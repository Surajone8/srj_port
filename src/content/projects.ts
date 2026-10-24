import { Project } from "@/types";

export const featuredProjects: Project[] = [
  {
    id: "tradeiq-fintech",
    slug: "tradeiq-fintech-superapp",
    title: "TradeIQ SuperApp",
    tagline: "Simplifying global multi-asset wealth and algorithmic trading.",
    description:
      "A complete redesign of the mobile and web experience for an institutional-grade wealth platform, enabling 1.4M users to trade equities, crypto, and derivatives with frictionless clarity.",
    category: "fintech",
    year: 2026,
    featured: true,
    role: "Lead Product Designer & Design Systems Lead",
    deliverables: ["Mobile Design System", "Execution Flow UX", "Micro-interactions", "Design Tokens"],
    metrics: [
      { label: "Execution Conversion", value: "+42%" },
      { label: "App Store Rating", value: "4.9★" },
      { label: "Daily Active Traders", value: "1.4M" },
    ],
    techStack: ["Figma Variables", "React Native", "Tailwind CSS", "Framer Motion"],
    coverImage: "/images/projects/tradeiq.jpg",
  },
  {
    id: "workspace-ai",
    slug: "workspace-ai-ux",
    title: "Workspace AI Canvas",
    tagline: "Visual node-based reasoning interface for generative workflows.",
    description:
      "An infinite canvas interaction paradigm for non-technical creators to chain LLMs, multimodal models, and data pipelines into autonomous workflows.",
    category: "ai",
    year: 2025,
    featured: true,
    role: "Staff Interaction Designer",
    deliverables: ["Infinite Canvas UX", "Node Graph Architecture", "Contextual Action Toolbar"],
    metrics: [
      { label: "Workflow Creation Speed", value: "3.5x Faster" },
      { label: "Session Retention", value: "+68%" },
      { label: "Community Templates", value: "25k+" },
    ],
    techStack: ["Next.js", "React Flow", "Web Audio API", "Tailwind CSS"],
    coverImage: "/images/projects/workspace-ai.jpg",
  },
  {
    id: "prism-design-system",
    slug: "prism-design-system",
    title: "Prism Design System",
    tagline: "Multi-brand, cross-platform design tokens and accessible React primitives.",
    description:
      "Unified design language powering 8 consumer products across Web, iOS, and Android with 100% WCAG AAA contrast compliance and automated token synchronisation.",
    category: "design-system",
    year: 2024,
    featured: false,
    role: "Design Technologist",
    deliverables: ["Token Architecture", "Component Library", "Figma Code Connect"],
    metrics: [
      { label: "Dev Handoff Velocity", value: "+55%" },
      { label: "Design Token Adoption", value: "100%" },
    ],
    techStack: ["Style Dictionary", "Tailwind CSS", "Radix UI", "TypeScript"],
  },
];
