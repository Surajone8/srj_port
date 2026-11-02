import * as React from "react";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import { mainNav } from "@/config/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-6 z-50 flex justify-center px-4 w-full">
      <nav className="flex items-center gap-6 rounded-full border border-white/[0.08] bg-[#11141D]/80 px-6 py-2.5 backdrop-blur-xl shadow-2xl shadow-black/40">
        {/* Monogram / Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-semibold tracking-wider text-white hover:text-blue-400 transition-colors"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400 font-mono text-xs font-bold border border-blue-500/30">
            SY
          </span>
          <span className="hidden sm:inline font-mono text-xs text-slate-400">
            /dev
          </span>
        </Link>

        <div className="h-4 w-px bg-white/10" />

        {/* Links */}
        <ul className="flex items-center gap-1 sm:gap-2">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                {item.title}
                {item.badge && (
                  <span className="rounded-full bg-blue-500/10 px-1.5 py-0.2 text-[10px] font-mono text-blue-400 border border-blue-500/20">
                    {item.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="h-4 w-px bg-white/10 hidden md:block" />

        {/* Availability Badge */}
        <div className="hidden md:flex items-center">
          <Badge variant="success" className="gap-1.5 py-1 text-[11px] font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {siteConfig.availability.label}
          </Badge>
        </div>

        {/* CTA */}
        <Button size="sm" className="hidden sm:inline-flex text-xs h-8 rounded-full px-4" asChild>
          <a href="#contact">Get in Touch</a>
        </Button>
      </nav>
    </header>
  );
}
