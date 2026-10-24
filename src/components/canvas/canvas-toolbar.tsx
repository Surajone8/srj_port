"use client";

import * as React from "react";
import {
  MousePointer,
  Hand,
  Square,
  Type,
  Play,
  ZoomIn,
  ZoomOut,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CanvasToolbarProps {
  zoom: number;
  viewMode: "canvas" | "present" | "inspect";
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onTogglePresent: () => void;
  onToggleInspect: () => void;
}

export function CanvasToolbar({
  zoom,
  viewMode,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onTogglePresent,
  onToggleInspect,
}: CanvasToolbarProps) {
  const zoomPercent = Math.round(zoom * 100);

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl border border-white/[0.08] bg-[#161822]/90 p-1.5 backdrop-blur-xl shadow-2xl">
      {/* Figma File Name */}
      <div className="flex items-center gap-2 px-3 py-1 border-r border-white/10">
        <div className="h-2 w-2 rounded-full bg-blue-500 animate-ping" />
        <span className="font-mono text-xs font-semibold text-white">
          Portfolio Prototype v2
        </span>
      </div>

      {/* Tool Icons */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-400 bg-blue-500/10" title="Select (V)">
          <MousePointer className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Hand tool (H / Space)">
          <Hand className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Frame (F)">
          <Square className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Text (T)">
          <Type className="h-4 w-4" />
        </Button>
      </div>

      <div className="h-4 w-px bg-white/10" />

      {/* Zoom controls */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onZoomOut} title="Zoom Out (Cmd -)">
          <ZoomOut className="h-3.5 w-3.5" />
        </Button>
        <button
          onClick={onResetZoom}
          className="font-mono text-xs px-2 py-1 text-slate-300 hover:text-white rounded hover:bg-white/5 transition-colors"
          title="Reset to 100%"
        >
          {zoomPercent}%
        </button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onZoomIn} title="Zoom In (Cmd +)">
          <ZoomIn className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="h-4 w-px bg-white/10" />

      {/* Action & Present Buttons */}
      <div className="flex items-center gap-1.5">
        <Button
          variant={viewMode === "inspect" ? "primary" : "ghost"}
          size="sm"
          className="h-8 text-xs gap-1.5"
          onClick={onToggleInspect}
        >
          <Sliders className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Inspect</span>
        </Button>

        <Button
          variant={viewMode === "present" ? "primary" : "secondary"}
          size="sm"
          className="h-8 text-xs gap-1.5 bg-blue-600 hover:bg-blue-500 text-white"
          onClick={onTogglePresent}
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>Present</span>
        </Button>
      </div>
    </div>
  );
}
