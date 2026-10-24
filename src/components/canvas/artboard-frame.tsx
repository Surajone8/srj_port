"use client";

import * as React from "react";
import { ArtboardFrameMeta } from "@/types";
import { cn } from "@/lib/utils";

interface ArtboardFrameProps {
  meta: ArtboardFrameMeta;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  children: React.ReactNode;
}

export function ArtboardFrame({
  meta,
  isSelected = false,
  onSelect,
  children,
}: ArtboardFrameProps) {
  return (
    <div
      id={meta.id}
      onClick={() => onSelect?.(meta.id)}
      style={{
        position: "absolute",
        left: `${meta.x}px`,
        top: `${meta.y}px`,
        width: `${meta.width}px`,
        minHeight: `${meta.height}px`,
      }}
      className={cn(
        "group flex flex-col rounded-xl transition-shadow bg-[#11141D] text-white",
        isSelected
          ? "ring-2 ring-blue-500 shadow-2xl shadow-blue-500/20"
          : "hover:ring-1 hover:ring-white/20"
      )}
    >
      {/* Frame Header Label (Figma Style) */}
      <div className="absolute -top-7 left-0 flex items-center gap-2 select-none">
        <span
          className={cn(
            "font-mono text-xs font-medium px-2 py-0.5 rounded transition-colors",
            isSelected
              ? "bg-blue-600 text-white"
              : "text-slate-400 group-hover:text-slate-200"
          )}
        >
          {meta.name}
        </span>
        {meta.badge && (
          <span className="font-mono text-[10px] text-slate-500">
            {meta.badge}
          </span>
        )}
      </div>

      {/* Frame Interior Content */}
      <div className="w-full h-full overflow-hidden rounded-xl border border-white/[0.08]">
        {children}
      </div>
    </div>
  );
}
