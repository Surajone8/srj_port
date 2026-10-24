import * as React from "react";

export function HudDeveloperStats() {
  const specs = [
    { label: "ROLE", value: "CREATIVE DEVELOPER" },
    { label: "STACK", value: "NEXT.JS / THREE.JS" },
    { label: "FOCUS", value: "WEBGL / MOTION" },
    { label: "AVAILABILITY", value: "OPEN FOR WORK" },
    { label: "RESPONSE", value: "UNDER 24H" },
  ];

  return (
    <div className="relative font-mono text-xs text-slate-300 w-full max-w-[340px] select-none">
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
        <div>
          <div className="text-3xl font-bold text-white tracking-tight">45+</div>
          <div className="text-[10px] text-slate-500 tracking-wider uppercase mt-1">
            Projects Completed
          </div>
        </div>
        <div className="border-l border-white/[0.08] pl-4">
          <div className="text-3xl font-bold text-white tracking-tight">10+</div>
          <div className="text-[10px] text-slate-500 tracking-wider uppercase mt-1">
            Experience Years
          </div>
        </div>
      </div>

      {/* Dotted Leader Spec Sheet */}
      <div className="flex flex-col gap-2.5 pt-4">
        {specs.map((item) => (
          <div key={item.label} className="flex items-baseline justify-between text-[11px]">
            <span className="text-slate-500 tracking-wider uppercase shrink-0">
              {item.label}
            </span>
            <span className="mx-2 grow border-b border-dotted border-white/20 relative top-[-3px]" />
            <span className="text-slate-200 font-semibold tracking-wider text-right shrink-0">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* HUD Bottom Bracket */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-white/[0.08] mt-4">
        <span>└ SYS.VER 2.6.4</span>
        <span>LATENCY: 14ms ┘</span>
      </div>
    </div>
  );
}
