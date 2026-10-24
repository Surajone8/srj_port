export interface NavItem {
  title: string;
  href: string;
  targetFrameId?: string;
  badge?: string;
  external?: boolean;
}

export const mainNav: NavItem[] = [
  {
    title: "Works",
    href: "#works",
    targetFrameId: "02_CaseStudy_Fintech",
  },
  {
    title: "Lab",
    href: "#lab",
    targetFrameId: "04_Interactive_Lab",
    badge: "Interactive",
  },
  {
    title: "About",
    href: "#about",
    targetFrameId: "05_Experience_Skills",
  },
  {
    title: "Contact",
    href: "#contact",
    targetFrameId: "06_Contact_Footer",
  },
];
