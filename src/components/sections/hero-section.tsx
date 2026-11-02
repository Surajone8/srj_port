"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { ParticlePortraitCanvas } from "@/components/canvas/particle-portrait-canvas";
import { HudDeveloperStats } from "@/components/sections/hud-developer-stats";
import { siteConfig } from "@/config/site";
import { LayoutGrid } from "lucide-react";

export function HeroSection() {
  const [timeString, setTimeString] = useState("12:00 a.m.");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }).toLowerCase()
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-screen bg-black text-white flex flex-col justify-between overflow-hidden px-6 md:px-12 py-6 select-none">
      {/* 1. TOP HEADER / BRAND NAVIGATION */}
      <header className="relative z-30 flex items-center justify-between w-full">
        {/* Brand / Name */}
        <div className="flex items-center gap-3">
          <span className="font-sans text-xl md:text-2xl font-bold tracking-tight text-white">
            {siteConfig.name}
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
        </div>

        {/* Top Right Action & Audio Indicator */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-slate-400">
            {/* Audio Waveform icon */}
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 h-1.5 bg-slate-400 animate-pulse" />
              <span className="w-0.5 h-3 bg-slate-300 animate-pulse delay-75" />
              <span className="w-0.5 h-2 bg-slate-400 animate-pulse delay-150" />
            </div>
            <span className="tracking-widest text-slate-400">[1]</span>
            <span className="text-white font-semibold">HOME</span>
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black hover:bg-slate-200 transition-colors cursor-pointer"
            title="Menu & Navigation"
            aria-label="Toggle navigation"
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* 2. CENTERPIECE: INTERACTIVE WHITE CIRCLES PARTICLE PORTRAIT */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-auto">
        <div className="w-full h-full max-w-[1300px] max-h-[880px] mx-auto">
          <ParticlePortraitCanvas
            imageSrc="/images/portrait.png"
            pointSpacing={6}
            mouseRadius={140}
            pushStrength={10}
            className="w-full h-full"
          />
        </div>
      </div>

      {/* 3. HERO CONTENT LAYER (LEFT & RIGHT) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center my-auto pt-10 pb-8 pointer-events-none">
        {/* Left Column: Big Display Typography & Glass Card */}
        <div className="lg:col-span-7 flex flex-col gap-6 pointer-events-auto">
          {/* Headline */}
          <div className="flex flex-col leading-none">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[5.5rem] font-black tracking-tight uppercase font-sans text-stroke-white drop-shadow-2xl">
              SOFTWARE
            </h1>
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[5.5rem] font-black tracking-tight uppercase font-sans text-white mt-[-0.1em] drop-shadow-2xl">
              DEVELOPER
            </h1>
          </div>

          {/* Subheading / Stack line */}
          <div className="font-mono text-xs sm:text-sm tracking-widest text-slate-400 uppercase">
            | REACT.JS · MERN STACK · PYTHON · MACHINE LEARNING |
          </div>

          {/* Frosted Glass Quote Card */}
          <div className="glass-panel rounded-xl p-6 max-w-lg border border-white/10 shadow-2xl relative overflow-hidden group">
            {/* Top gradient highlight line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <p className="font-mono text-xs sm:text-[13px] text-slate-300 leading-relaxed uppercase tracking-wide">
              &ldquo;I BUILD SCALABLE FULL-STACK WEB APPS AND ML SOLUTIONS WITH REACT,
              NODE, AND PYTHON — DELIVERING PRODUCTION-GRADE PERFORMANCE.&rdquo;
            </p>
          </div>
        </div>

        {/* Right Column: HUD Developer Stats */}
        <div className="lg:col-span-5 flex justify-start lg:justify-end pointer-events-auto">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl w-full max-w-[360px]">
            <HudDeveloperStats />
          </div>
        </div>
      </div>

      {/* 4. BOTTOM TICKER / HUD FOOTER BAR */}
      <footer className="relative z-30 flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-white/[0.08] font-mono text-[11px] text-slate-400">
        {/* Infinite Looping Status Badges */}
        <div className="relative overflow-hidden w-full md:max-w-xl [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div className="animate-ticker items-center gap-3 py-0.5">
            {/* Set 1 */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 border border-white/10 px-2.5 py-1 rounded-md bg-white/[0.03]">
                <span className="text-slate-500 text-[10px]">RENDERING</span>
                <span className="text-white font-bold">WEBGL / CANVAS</span>
              </div>
              <div className="flex items-center gap-1.5 border border-white/10 px-2.5 py-1 rounded-md bg-white/[0.03]">
                <span className="text-slate-500 text-[10px]">ZONE_ID</span>
                <span className="text-white font-bold">SOFTWARE DEVELOPER</span>
              </div>
              <div className="flex items-center gap-1.5 border border-white/10 px-2.5 py-1 rounded-md bg-white/[0.03]">
                <span className="text-slate-500 text-[10px]">AVAILABILITY</span>
                <span className="text-emerald-400 font-bold">OPEN</span>
              </div>
              <div className="flex items-center gap-1.5 border border-white/10 px-2.5 py-1 rounded-md bg-white/[0.03]">
                <span className="text-slate-500 text-[10px]">STACK</span>
                <span className="text-blue-400 font-bold">REACT · MERN · PYTHON ML</span>
              </div>
            </div>

            {/* Set 2 (Duplicate for seamless infinite loop) */}
            <div className="flex items-center gap-3 shrink-0" aria-hidden="true">
              <div className="flex items-center gap-1.5 border border-white/10 px-2.5 py-1 rounded-md bg-white/[0.03]">
                <span className="text-slate-500 text-[10px]">RENDERING</span>
                <span className="text-white font-bold">WEBGL / CANVAS</span>
              </div>
              <div className="flex items-center gap-1.5 border border-white/10 px-2.5 py-1 rounded-md bg-white/[0.03]">
                <span className="text-slate-500 text-[10px]">ZONE_ID</span>
                <span className="text-white font-bold">SOFTWARE DEVELOPER</span>
              </div>
              <div className="flex items-center gap-1.5 border border-white/10 px-2.5 py-1 rounded-md bg-white/[0.03]">
                <span className="text-slate-500 text-[10px]">AVAILABILITY</span>
                <span className="text-emerald-400 font-bold">OPEN</span>
              </div>
              <div className="flex items-center gap-1.5 border border-white/10 px-2.5 py-1 rounded-md bg-white/[0.03]">
                <span className="text-slate-500 text-[10px]">STACK</span>
                <span className="text-blue-400 font-bold">REACT · MERN · PYTHON ML</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Contact & Live Time */}
        <div className="flex items-center justify-between sm:justify-end w-full md:w-auto gap-6 shrink-0">
          <div>
            <span className="text-slate-500 mr-2">Wanna Say Hello?</span>
            <a
              href="mailto:ysuraj18333@gmail.com"
              className="text-white font-bold hover:text-blue-400 transition-colors underline-offset-4 hover:underline"
            >
              ysuraj18333@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-slate-500">Local Time</span>
            <span className="text-white font-bold tracking-wider uppercase">
              {timeString}
            </span>
          </div>
        </div>
      </footer>
    </section>
  );
}
