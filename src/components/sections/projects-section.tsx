import * as React from "react";
import { featuredProjects } from "@/content/projects";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

export function ProjectsSection() {
  return (
    <section id="works" className="flex flex-col gap-8 sm:gap-10 px-4 sm:px-8 md:px-12 lg:px-20 py-12 sm:py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <span className="font-mono text-xs text-blue-400 uppercase tracking-wider">
            Selected Works
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-1">
            Featured Projects & Systems
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md">
          Production full-stack web applications, MERN platforms, and Python machine learning pipelines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {featuredProjects.map((project) => (
          <Card
            key={project.id}
            className="group relative overflow-hidden bg-[#161924] hover:border-blue-500/50 transition-all duration-300"
          >
            {/* Top Bar / Meta */}
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <Badge variant="outline" className="font-mono uppercase text-[10px]">
                  {project.category}
                </Badge>
                <span className="font-mono text-xs text-slate-500">
                  {project.year}
                </span>
              </div>
              <CardTitle className="group-hover:text-blue-400 transition-colors flex items-center justify-between mt-2">
                {project.title}
                <ArrowUpRight className="h-5 w-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </CardTitle>
              <CardDescription className="text-sm text-slate-300">
                {project.tagline}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col gap-6">
              <p className="text-xs text-slate-400 leading-relaxed">
                {project.description}
              </p>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 rounded-xl bg-black/30 p-3 border border-white/[0.04]">
                {project.metrics.map((m) => (
                  <div key={m.label} className="text-center">
                    <div className="font-mono text-base font-bold text-white">
                      {m.value}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate">
                      {m.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Deliverables / Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {project.deliverables.map((item) => (
                  <span
                    key={item}
                    className="font-mono text-[10px] text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
