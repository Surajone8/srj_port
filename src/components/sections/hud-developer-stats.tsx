"use client";

import * as React from "react";
import { useState } from "react";

export function HudDeveloperStats() {
  const [activeRow, setActiveRow] = useState<number | null>(null);

  const specs = [
    { label: "ROLE", value: "SOFTWARE DEVELOPER" },
    { label: "STACK", value: "REACT / MERN / PYTHON" },
    { label: "FOCUS", value: "FULL STACK & ML" },
    { label: "AVAILABILITY", value: "OPEN FOR WORK" },
    { label: "RESPONSE", value: "UNDER 24H" },
  ];

  return (
    <div className="relative font-mono text-xs text-slate-300 w-full select-none">
      {/* HUD Header with corner brackets */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-white/[0.08] pb-2">
        <span className="flex items-center gap-1.5 tracking-wider">
          <span className="text-white">┌</span> DEVELOPER STATS
        </span>
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          ACTIVE <span className="text-white">┐</span>
        </span>
      </div>

      {/* Main KPI Counters */}
      <div className="grid grid-cols-2 gap-4 py-5 border-b border-white/[0.08]">
        <div className="group cursor-default">
          <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
            45+
          </div>
          <div className="text-[10px] text-slate-500 tracking-wider uppercase mt-1">
            Projects Completed
          </div>
        </div>
        <div className="border-l border-white/[0.08] pl-4 group cursor-default">
          <div className="text-3xl sm:text-4xl font-bold text-white tracking-tight group-hover:text-emerald-400 transition-colors">
            1.8+
          </div>
          <div className="text-[10px] text-slate-500 tracking-wider uppercase mt-1">
            Years Experience (1y 10m)
          </div>
        </div>
      </div>

      {/* Dotted Leader Spec Sheet */}
      <div className="flex flex-col gap-2 pt-4">
        {specs.map((item, idx) => (
          <div
            key={item.label}
            onMouseEnter={() => setActiveRow(idx)}
            onMouseLeave={() => setActiveRow(null)}
            className={`flex items-baseline justify-between text-[11px] px-1 py-0.5 rounded transition-colors cursor-default ${
              activeRow === idx ? "bg-white/[0.06] text-white" : ""
            }`}
          >
            <span
              className={`tracking-wider uppercase shrink-0 transition-colors ${
                activeRow === idx ? "text-blue-400" : "text-slate-500"
              }`}
            >
              {item.label}
            </span>
            <span
              className={`mx-2 grow border-b border-dotted relative top-[-3px] transition-colors ${
                activeRow === idx ? "border-blue-400/50" : "border-white/20"
              }`}
            />
            <span
              className={`font-semibold tracking-wider text-right shrink-0 transition-colors ${
                activeRow === idx ? "text-white drop-shadow-sm" : "text-slate-200"
              }`}
            >
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* HUD Bottom Bracket */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 pt-3 border-t border-white/[0.08] mt-4">
        <span>└ SYS.VER 2.6.4</span>
        <span className="text-emerald-500/80">LATENCY: 14ms ┘</span>
      </div>
    </div>
  );
}
