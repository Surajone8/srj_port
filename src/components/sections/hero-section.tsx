import * as React from "react";
import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Terminal } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative flex flex-col justify-center min-h-[720px] px-8 md:px-20 py-16 overflow-hidden">
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col gap-8 z-10">
        {/* Eyebrow / Role Tag */}
        <div className="flex items-center gap-3">
          <Badge variant="default" className="gap-2 px-3 py-1 font-mono text-xs">
            <Sparkles className="h-3 w-3 text-blue-400" />
            Product Designer & Technologist
          </Badge>
          <span className="font-mono text-xs text-slate-500">
            SF Pro / 8pt Spatial Grid
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08]">
          Designing intelligent interfaces,{" "}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
            design systems
          </span>
          , and craft-driven software.
        </h1>

        {/* Subhead */}
        <p className="text-lg sm:text-xl text-slate-400 max-w-2xl leading-relaxed">
          {siteConfig.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button size="lg" className="rounded-full gap-2 px-6 shadow-xl shadow-blue-500/25" asChild>
            <a href="#works">
              Explore Featured Works
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>

          <Button variant="outline" size="lg" className="rounded-full gap-2 px-6" asChild>
            <a href="#lab">
              <Terminal className="h-4 w-4 text-purple-400" />
              Interactive Lab
            </a>
          </Button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-12 border-t border-white/[0.08] mt-6">
          <div>
            <div className="font-mono text-3xl font-bold text-white">10+</div>
            <div className="text-xs text-slate-400 mt-1">Years Crafting Products</div>
          </div>
          <div>
            <div className="font-mono text-3xl font-bold text-blue-400">40+</div>
            <div className="text-xs text-slate-400 mt-1">Shipped Web & Mobile Apps</div>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <div className="font-mono text-3xl font-bold text-emerald-400">1.4M+</div>
            <div className="text-xs text-slate-400 mt-1">Active End Users Impacted</div>
          </div>
        </div>
      </div>
    </section>
  );
}
