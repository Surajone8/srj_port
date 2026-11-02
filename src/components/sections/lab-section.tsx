"use client";

import * as React from "react";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function LabSection() {
  const [toggleState, setToggleState] = useState(true);
  const [sliderValue, setSliderValue] = useState(65);

  return (
    <section id="lab" className="flex flex-col gap-8 sm:gap-10 px-4 sm:px-8 md:px-12 lg:px-20 py-12 sm:py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <span className="font-mono text-xs text-purple-400 uppercase tracking-wider">
            Interaction Lab & Playground
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-1">
            Micro-interactions & Physics
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md">
          Tactile UI experiments exploring spring dynamics, gesture responses, and modern design engineering.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Experiment 1: Spring Switch */}
        <Card className="bg-[#141720]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="accent" className="font-mono text-[10px]">
                Spring Physics
              </Badge>
              <span className="font-mono text-xs text-slate-500">Mass: 1, Stiff: 300</span>
            </div>
            <CardTitle className="text-lg">Tactile Kinetic Toggle</CardTitle>
            <CardDescription>
              Interactive toggle with sub-pixel bounce and audio-visual tactile feedback.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-8 bg-black/20 rounded-xl m-6 border border-white/[0.04]">
            <button
              onClick={() => setToggleState(!toggleState)}
              className={`relative h-12 w-24 rounded-full transition-colors duration-300 p-1 cursor-pointer focus:outline-none ${
                toggleState ? "bg-blue-600" : "bg-slate-800"
              }`}
            >
              <div
                className={`h-10 w-10 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                  toggleState ? "translate-x-12" : "translate-x-0"
                }`}
              />
            </button>
            <span className="font-mono text-xs text-slate-400 mt-4">
              State: {toggleState ? "Active (On)" : "Disabled (Off)"}
            </span>
          </CardContent>
        </Card>

        {/* Experiment 2: Dynamic Spatial Slider */}
        <Card className="bg-[#141720]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="default" className="font-mono text-[10px]">
                Token Interpolation
              </Badge>
              <span className="font-mono text-xs text-slate-500">OKLCH / CSS Vars</span>
            </div>
            <CardTitle className="text-lg">Color & Radius Dynamic Scaler</CardTitle>
            <CardDescription>
              Real-time auto-layout spacing and border-radius token live tweaker.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 p-8 bg-black/20 rounded-xl m-6 border border-white/[0.04]">
            <div className="flex justify-between items-center font-mono text-xs text-slate-400">
              <span>Radius: {sliderValue}px</span>
              <span>Interpolation: oklch</span>
            </div>
            <input
              type="range"
              min="4"
              max="64"
              value={sliderValue}
              onChange={(e) => setSliderValue(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div
              style={{ borderRadius: `${sliderValue}px` }}
              className="h-20 w-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-xs font-mono font-bold text-white transition-all duration-150"
            >
              Dynamic Surface
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
