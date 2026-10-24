import * as React from "react";
import { siteConfig } from "@/config/site";

export function Footer() {
  const currentYear = 2026;

  return (
    <footer className="w-full border-t border-white/[0.06] bg-[#0D0F14] py-12 px-6 text-slate-400">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex flex-col items-center md:items-start gap-1">
          <p className="font-mono text-xs tracking-wider text-slate-500 uppercase">
            Designed with precision & craft
          </p>
          <p className="text-sm text-slate-400">
            © {currentYear} {siteConfig.name}. All rights reserved.
          </p>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            GitHub
          </a>
          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            LinkedIn
          </a>
          <a
            href={siteConfig.links.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            Twitter/X
          </a>
          <a
            href={siteConfig.links.figma}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            Figma
          </a>
        </div>
      </div>
    </footer>
  );
}
