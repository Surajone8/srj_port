"use client";

import * as React from "react";
import { useEffect, useRef, useState, useCallback } from "react";

interface Particle {
  originX: number;
  originY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  alpha: number;
  noiseOffset: number;
}

interface ParticlePortraitCanvasProps {
  imageSrc?: string;
  className?: string;
  pointSpacing?: number;
  mouseRadius?: number;
  pushStrength?: number;
}

export function ParticlePortraitCanvas({
  imageSrc = "/images/portrait.jpg",
  className = "",
  pointSpacing = 7,
  mouseRadius = 120,
  pushStrength = 8,
}: ParticlePortraitCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });
  const animationFrameId = useRef<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize and sample image pixels to generate particles
  const initParticles = useCallback(
    (img: HTMLImageElement, width: number, height: number) => {
      const offscreen = document.createElement("canvas");
      const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;

      offscreen.width = width;
      offscreen.height = height;

      // Calculate aspect ratio fit (contain/cover)
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = width / height;

      let drawWidth = width;
      let drawHeight = height;
      let offsetX = 0;
      let offsetY = 0;

      if (imgAspect > canvasAspect) {
        drawHeight = height;
        drawWidth = height * imgAspect;
        offsetX = (width - drawWidth) / 2;
      } else {
        drawWidth = width;
        drawHeight = width / imgAspect;
        offsetY = (height - drawHeight) / 2;
      }

      // Draw the reference image onto offscreen canvas
      offCtx.fillStyle = "#000000";
      offCtx.fillRect(0, 0, width, height);
      offCtx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

      const imgData = offCtx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const particles: Particle[] = [];

      // Scan image with grid step
      for (let y = 0; y < height; y += pointSpacing) {
        for (let x = 0; x < width; x += pointSpacing) {
          const index = (y * width + x) * 4;
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3];

          if (a > 20) {
            // Perceived luminance formula (ITU-R BT.709)
            const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

            // Only plot points where there is discernible light/texture
            if (luminance > 0.12) {
              // Right half vs left half halftone nuance (Axevia effect)
              const isRightSide = x > width * 0.48;
              const sizeMultiplier = isRightSide ? 1.25 : 0.9;

              // Size circle based on brightness
              const baseRadius = Math.max(
                0.75,
                luminance * (pointSpacing * 0.48) * sizeMultiplier
              );

              // Organic alpha
              const alpha = Math.min(1.0, 0.25 + luminance * 0.75);

              particles.push({
                originX: x,
                originY: y,
                x: x + (Math.random() - 0.5) * 4,
                y: y + (Math.random() - 0.5) * 4,
                vx: 0,
                vy: 0,
                radius: baseRadius,
                baseRadius,
                alpha,
                noiseOffset: Math.random() * Math.PI * 2,
              });
            }
          }
        }
      }

      particlesRef.current = particles;
      setIsLoaded(true);
    },
    [pointSpacing]
  );

  // Fallback procedural particle generator if no image is available
  const generateProceduralParticles = useCallback(
    (width: number, height: number) => {
      const particles: Particle[] = [];
      const centerX = width * 0.5;
      const centerY = height * 0.46;
      const headRadiusX = Math.min(width, height) * 0.22;
      const headRadiusY = Math.min(width, height) * 0.28;

      for (let y = 0; y < height; y += pointSpacing) {
        for (let x = 0; x < width; x += pointSpacing) {
          const dx = (x - centerX) / headRadiusX;
          const dy = (y - centerY) / headRadiusY;
          const distHead = dx * dx + dy * dy;

          // Torso ellipse
          const dxTorso = (x - centerX) / (headRadiusX * 1.8);
          const dyTorso = (y - (centerY + headRadiusY * 1.5)) / (headRadiusY * 1.2);
          const distTorso = dxTorso * dxTorso + dyTorso * dyTorso;

          const inHead = distHead <= 1.0;
          const inTorso = distTorso <= 1.0 && y > centerY + headRadiusY * 0.7;

          if (inHead || inTorso) {
            // Simulated split light: right side is bright, left side is stippled
            const isRightSide = x > centerX;
            const luminance = isRightSide ? 0.7 + Math.random() * 0.3 : 0.25 + Math.random() * 0.3;
            const baseRadius = Math.max(0.8, luminance * (pointSpacing * 0.45));

            particles.push({
              originX: x,
              originY: y,
              x,
              y,
              vx: 0,
              vy: 0,
              radius: baseRadius,
              baseRadius,
              alpha: isRightSide ? 0.9 : 0.45,
              noiseOffset: Math.random() * Math.PI * 2,
            });
          }
        }
      }
      particlesRef.current = particles;
      setIsLoaded(true);
    },
    [pointSpacing]
  );

  // Setup canvas and load image
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let isMounted = true;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.scale(dpr, dpr);
    }

    // Load reference image
    if (imageSrc) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageSrc;
      img.onload = () => {
        if (!isMounted) return;
        initParticles(img, width, height);
      };
      img.onerror = () => {
        if (!isMounted) return;
        generateProceduralParticles(width, height);
      };
    } else {
      generateProceduralParticles(width, height);
    }

    return () => {
      isMounted = false;
    };
  }, [imageSrc, initParticles, generateProceduralParticles]);

  // Main interactive physics render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let time = 0;

    const render = () => {
      time += 0.015;
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      // Clear with pitch dark background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const k = 0.07; // Spring stiffness
      const friction = 0.88; // Damping

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          // 1. Mouse repulsion physics
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.hypot(dx, dy);

            if (dist < mouseRadius && dist > 0) {
              const force = (1 - dist / mouseRadius) * pushStrength;
              const angle = Math.atan2(dy, dx);
              p.vx += Math.cos(angle) * force * 1.2;
              p.vy += Math.sin(angle) * force * 1.2;
            }
          }

          // 2. Ambient organic floating wave
          const ambientWaveX = Math.sin(time + p.noiseOffset) * 0.4;
          const ambientWaveY = Math.cos(time + p.noiseOffset * 1.2) * 0.4;

          // 3. Spring force returning to resting origin
          const springX = (p.originX + ambientWaveX - p.x) * k;
          const springY = (p.originY + ambientWaveY - p.y) * k;

          p.vx = (p.vx + springX) * friction;
          p.vy = (p.vy + springY) * friction;

          p.x += p.vx;
          p.y += p.vy;
        }

        // Draw the white circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
      }

      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [mouseRadius, pushStrength]);

  // Mouse / Pointer event handlers
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.active = false;
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-full overflow-hidden select-none cursor-crosshair ${className}`}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-slate-600 animate-pulse">
          SAMPLING HALFTONE PARTICLES...
        </div>
      )}
    </div>
  );
}
