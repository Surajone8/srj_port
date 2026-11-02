"use client";

import * as React from "react";
import { useState, useRef } from "react";
import Image from "next/image";
import { featuredProjects } from "@/content/projects";
import { ArrowUpRight } from "lucide-react";

export function ProjectsSection() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(3); // Default to project 04 like screenshot
  const projectCardsRef = useRef<(HTMLElement | null)[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const activeProject = featuredProjects[activeProjectIndex] || featuredProjects[0];
  const totalCount = String(featuredProjects.length).padStart(2, "0");
  const currentCount = String(activeProjectIndex + 1).padStart(2, "0");

  // Track which project is centered in view as the user scrolls
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.top + containerRect.height / 2;

    let closestIndex = 0;
    let closestDist = Infinity;

    projectCardsRef.current.forEach((card, idx) => {
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const dist = Math.abs(cardCenter - containerCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closestIndex = idx;
      }
    });

    setActiveProjectIndex(closestIndex);
  };

  const scrollToProject = (index: number) => {
    setActiveProjectIndex(index);
    const target = projectCardsRef.current[index];
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <section id="works" className="relative w-full min-h-screen bg-black text-white font-mono select-none overflow-hidden border-t border-white/[0.08]">
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 figma-canvas-grid pointer-events-none opacity-30" />

      {/* Main 3-Column Layout: Left Index | Center Project Feed | Right Big HUD Column */}
      <div className="relative z-10 w-full h-screen grid grid-cols-1 lg:grid-cols-12 gap-0">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: INDEX & VERTICAL SCRUBBER                    */}
        {/* ========================================================= */}
        <aside className="hidden xl:flex xl:col-span-2 flex-col justify-between py-10 px-8 border-r border-white/[0.08] text-[11px] text-slate-400 bg-black/60">
          {/* Top Index Label */}
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-8">
              INDEX
            </div>

            {/* Vertical Index List */}
            <nav className="flex flex-col gap-3.5">
              {featuredProjects.map((p, idx) => {
                const isActive = activeProjectIndex === idx;
                return (
                  <button
                    key={p.id}
                    onClick={() => scrollToProject(idx)}
                    className={`text-left text-[11px] tracking-wider uppercase transition-colors cursor-pointer flex items-center gap-2.5 group ${
                      isActive ? "text-white font-bold" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <span className={isActive ? "text-white" : "text-slate-600 group-hover:text-slate-400"}>
                      {p.num}
                    </span>
                    <span className="truncate">{p.title}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Scrubber Gauge Line */}
          <div className="flex items-center gap-3 my-auto py-12">
            <span className="text-[10px] text-slate-600">20</span>
            <div className="h-28 w-1 bg-white/10 rounded-full relative overflow-hidden">
              <div
                className="w-full bg-white rounded-full transition-all duration-300"
                style={{
                  height: `${100 / featuredProjects.length}%`,
                  transform: `translateY(${activeProjectIndex * 100}%)`,
                }}
              />
            </div>
            <span className="text-[10px] text-slate-600">100</span>
          </div>

          {/* Left Bottom Mini Note */}
          <div className="text-[10px] text-slate-600">
            Wanna Say Hello?
            <br />
            <a href="mailto:ysuraj18333@gmail.com" className="text-slate-400 hover:text-white transition-colors">
              ysuraj18333@gmail.com
            </a>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* CENTER COLUMN: PROJECT CARD FEED                         */}
        {/* ========================================================= */}
        <main
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="lg:col-span-8 xl:col-span-7 flex flex-col gap-8 py-12 px-4 sm:px-8 md:px-10 h-screen overflow-y-auto no-scrollbar border-r border-white/[0.08]"
        >
          {featuredProjects.map((project, idx) => {
            const isActive = activeProjectIndex === idx;

            return (
              <article
                key={project.id}
                ref={(el) => {
                  projectCardsRef.current[idx] = el;
                }}
                onMouseEnter={() => setActiveProjectIndex(idx)}
                className={`relative group rounded-xl border transition-all duration-300 overflow-hidden bg-[#0c0e14]/90 shrink-0 ${
                  isActive
                    ? "border-white/25 shadow-2xl shadow-black/90"
                    : "border-white/[0.08] hover:border-white/20"
                }`}
              >
                {/* Outer Bracket Notch Accents */}
                <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/40" />
                <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white/40" />
                <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white/40" />
                <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/40" />

                <div className="p-5 sm:p-6 flex flex-col md:flex-row gap-5 items-center md:items-start">
                  {/* Left: Project Visual Thumbnail Frame (Fixed Ratio like Axevia) */}
                  <div className="w-full md:w-44 lg:w-48 h-36 shrink-0 rounded-lg overflow-hidden border border-white/10 bg-black relative group/thumb">
                    {project.coverImage ? (
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 200px"
                        className="object-cover grayscale contrast-125 group-hover/thumb:grayscale-0 transition-all duration-500"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-black" />
                    )}
                    <div className="absolute inset-0 bg-black/20 group-hover/thumb:bg-transparent transition-colors" />
                  </div>

                  {/* Right: Project Metadata & Copy */}
                  <div className="flex-1 flex flex-col justify-between h-full gap-3 w-full">
                    <div>
                      {/* Meta Eyebrow */}
                      <div className="text-[10px] sm:text-[11px] text-slate-400 tracking-wider uppercase flex items-center gap-2">
                        <span className="text-white font-bold">{project.num}</span>
                        <span>{project.categoryLabel}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-slate-400">{project.year}</span>
                      </div>

                      {/* Main Title (Clean uppercase sans typography) */}
                      <h3 className="text-xl sm:text-2xl lg:text-[1.65rem] font-bold text-white tracking-tight uppercase font-sans mt-1.5 group-hover:text-blue-400 transition-colors">
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-[13px] text-slate-400 leading-relaxed font-sans mt-2 max-w-xl">
                        {project.description}
                      </p>
                    </div>

                    {/* Bottom Tags & View Case Link */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.06] mt-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] text-slate-400 bg-white/[0.04] border border-white/[0.08] px-2 py-0.5 rounded-sm uppercase tracking-wider"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <a
                        href={`#${project.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs text-white hover:text-blue-400 font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer"
                      >
                        <span>VIEW CASE</span>
                        <span className="text-slate-500 group-hover:translate-x-0.5 transition-transform">→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </main>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: BIG HUD PROJECTS STATUS & COUNTER           */}
        {/* ========================================================= */}
        <aside className="hidden lg:flex lg:col-span-4 xl:col-span-3 flex-col justify-between py-10 px-8 text-right bg-black/60">
          {/* Top Breadcrumb */}
          <div className="text-[11px] text-slate-400 uppercase tracking-widest flex items-center justify-end gap-1.5">
            <span className="text-slate-600">HOME</span>
            <span className="text-slate-600">/</span>
            <span className="text-white font-bold">PROJECTS</span>
          </div>

          {/* Big Huge Typography Header & HUD Counter */}
          <div className="my-auto flex flex-col items-end w-full">
            <h2 className="text-5xl xl:text-6xl 2xl:text-7xl font-black uppercase text-white tracking-tight text-right leading-[0.9] font-sans">
              PROJECTS
            </h2>

            {/* Massive Active Project Counter (e.g. 04 / 06) */}
            <div className="flex items-baseline justify-end gap-1 mt-10 text-white">
              <span className="text-6xl xl:text-7xl 2xl:text-8xl font-black tracking-tighter font-sans">
                {currentCount}
              </span>
              <span className="text-xl xl:text-2xl font-normal text-slate-500 font-mono">
                /{totalCount}
              </span>
            </div>

            {/* Active Project Sub-label */}
            <div className="mt-4 text-right">
              <div className="text-xs uppercase font-bold text-white tracking-wider">
                {activeProject.title}
              </div>
              <div className="text-[10px] uppercase text-slate-500 tracking-widest mt-0.5">
                {activeProject.categoryLabel.split("·")[0]?.trim() || "DEVELOPMENT"}
              </div>
            </div>

            {/* Scroller Indicator dot */}
            <div className="flex items-center justify-end gap-3 mt-10 text-[10px] text-slate-500 uppercase tracking-widest">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              <span>SCROLL</span>
            </div>
          </div>

          {/* Bottom Right Audio / Projects Mini Badge Button */}
          <div className="flex items-center justify-end gap-3">
            <div className="flex items-center gap-2 border border-white/10 rounded-xl px-4 py-2 bg-white/[0.04]">
              {/* Mini Audio visualizer bars */}
              <div className="flex items-end gap-0.5 h-3">
                <span className="w-0.5 h-2 bg-slate-400 animate-pulse" />
                <span className="w-0.5 h-3 bg-white animate-pulse delay-75" />
                <span className="w-0.5 h-1.5 bg-slate-400 animate-pulse delay-150" />
              </div>
              <span className="text-xs font-bold text-white tracking-widest">[3]</span>
              <span className="text-xs font-bold text-white tracking-wider">PROJECTS</span>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black shrink-0">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        </aside>

      </div>
    </section>
  );
}
