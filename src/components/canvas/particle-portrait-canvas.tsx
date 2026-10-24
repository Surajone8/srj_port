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
  baseAlpha: number;
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
  mouseRadius = 140,
  pushStrength = 12,
}: ParticlePortraitCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const shockwavesRef = useRef<{ x: number; y: number; radius: number; maxRadius: number; strength: number }[]>([]);

  // Mouse & velocity tracking
  const mouseRef = useRef<{
    x: number;
    y: number;
    prevX: number;
    prevY: number;
    vx: number;
    vy: number;
    active: boolean;
  }>({
    x: -9999,
    y: -9999,
    prevX: -9999,
    prevY: -9999,
    vx: 0,
    vy: 0,
    active: false,
  });

  const tiltRef = useRef<{ currentX: number; currentY: number; targetX: number; targetY: number }>({
    currentX: 0,
    currentY: 0,
    targetX: 0,
    targetY: 0,
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

      // Calculate aspect ratio fit (contain)
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
              const sizeMultiplier = isRightSide ? 1.3 : 0.85;

              // Size circle based on brightness
              const baseRadius = Math.max(
                0.75,
                luminance * (pointSpacing * 0.48) * sizeMultiplier
              );

              // Base alpha
              const baseAlpha = Math.min(1.0, 0.25 + luminance * 0.75);

              particles.push({
                originX: x,
                originY: y,
                x: x + (Math.random() - 0.5) * 3,
                y: y + (Math.random() - 0.5) * 3,
                vx: 0,
                vy: 0,
                radius: baseRadius,
                baseRadius,
                alpha: baseAlpha,
                baseAlpha,
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

          const dxTorso = (x - centerX) / (headRadiusX * 1.8);
          const dyTorso = (y - (centerY + headRadiusY * 1.5)) / (headRadiusY * 1.2);
          const distTorso = dxTorso * dxTorso + dyTorso * dyTorso;

          const inHead = distHead <= 1.0;
          const inTorso = distTorso <= 1.0 && y > centerY + headRadiusY * 0.7;

          if (inHead || inTorso) {
            const isRightSide = x > centerX;
            const luminance = isRightSide ? 0.7 + Math.random() * 0.3 : 0.25 + Math.random() * 0.3;
            const baseRadius = Math.max(0.8, luminance * (pointSpacing * 0.45));
            const baseAlpha = isRightSide ? 0.9 : 0.45;

            particles.push({
              originX: x,
              originY: y,
              x,
              y,
              vx: 0,
              vy: 0,
              radius: baseRadius,
              baseRadius,
              alpha: baseAlpha,
              baseAlpha,
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
    const container = containerRef.current;
    if (!canvas || !container) return;
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

      // Smooth 3D Parallax Tilt update (Lerp)
      const tilt = tiltRef.current;
      tilt.currentX += (tilt.targetX - tilt.currentX) * 0.06;
      tilt.currentY += (tilt.targetY - tilt.currentY) * 0.06;
      container.style.transform = `perspective(1200px) rotateX(${tilt.currentY}deg) rotateY(${tilt.currentX}deg)`;

      // Clear with pitch dark background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const shockwaves = shockwavesRef.current;

      const k = 0.075; // Spring stiffness
      const friction = 0.86; // Damping

      // Expand and prune shockwaves
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.radius += 8;
        sw.strength *= 0.94;
        if (sw.radius > sw.maxRadius || sw.strength < 0.05) {
          shockwaves.splice(s, 1);
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          // 1. Mouse magnetic dispersion & velocity push
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.hypot(dx, dy);

            if (dist < mouseRadius && dist > 0) {
              // Proximity ratio (1 at cursor center, 0 at outer boundary)
              const proximity = 1 - dist / mouseRadius;
              const angle = Math.atan2(dy, dx);

              // Combined radial force + mouse velocity wake
              const radialPush = proximity * pushStrength;
              const velocityPushX = mouse.vx * proximity * 0.35;
              const velocityPushY = mouse.vy * proximity * 0.35;

              p.vx += Math.cos(angle) * radialPush + velocityPushX;
              p.vy += Math.sin(angle) * radialPush + velocityPushY;

              // Proximity spotlight: expand size & boost alpha
              p.radius = p.baseRadius * (1 + proximity * 0.6);
              p.alpha = Math.min(1.0, p.baseAlpha + proximity * 0.5);
            } else {
              // Ease back radius & alpha
              p.radius += (p.baseRadius - p.radius) * 0.1;
              p.alpha += (p.baseAlpha - p.alpha) * 0.1;
            }
          } else {
            p.radius += (p.baseRadius - p.radius) * 0.1;
            p.alpha += (p.baseAlpha - p.alpha) * 0.1;
          }

          // 2. Shockwave ripple physics
          for (let s = 0; s < shockwaves.length; s++) {
            const sw = shockwaves[s];
            const dx = p.x - sw.x;
            const dy = p.y - sw.y;
            const dist = Math.hypot(dx, dy);
            const waveDiff = Math.abs(dist - sw.radius);

            if (waveDiff < 30) {
              const waveForce = (1 - waveDiff / 30) * sw.strength * 12;
              const angle = Math.atan2(dy, dx);
              p.vx += Math.cos(angle) * waveForce;
              p.vy += Math.sin(angle) * waveForce;
            }
          }

          // 3. Ambient organic breathing wave
          const ambientWaveX = Math.sin(time + p.noiseOffset) * 0.35;
          const ambientWaveY = Math.cos(time + p.noiseOffset * 1.2) * 0.35;

          // 4. Harmonic spring force returning to resting origin
          const springX = (p.originX + ambientWaveX - p.x) * k;
          const springY = (p.originY + ambientWaveY - p.y) * k;

          p.vx = (p.vx + springX) * friction;
          p.vy = (p.vy + springY) * friction;

          p.x += p.vx;
          p.y += p.vy;
        }

        // 5. Render halftone circle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();
      }

      // Smooth decay of mouse velocity
      mouse.vx *= 0.8;
      mouse.vy *= 0.8;

      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [mouseRadius, pushStrength]);

  // Window-wide pointer tracking for seamless interaction across all hero elements
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      const mouse = mouseRef.current;
      if (mouse.prevX !== -9999) {
        mouse.vx = currentX - mouse.prevX;
        mouse.vy = currentY - mouse.prevY;
      }

      mouse.prevX = currentX;
      mouse.prevY = currentY;
      mouse.x = currentX;
      mouse.y = currentY;
      mouse.active = true;

      // Calculate 3D tilt target
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      tiltRef.current.targetX = ((currentX - centerX) / centerX) * 5;
      tiltRef.current.targetY = -((currentY - centerY) / centerY) * 5;
    };

    const handlePointerLeave = () => {
      const mouse = mouseRef.current;
      mouse.active = false;
      mouse.prevX = -9999;
      mouse.prevY = -9999;
      mouse.vx = 0;
      mouse.vy = 0;
      tiltRef.current.targetX = 0;
      tiltRef.current.targetY = 0;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("mouseleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, []);

  // Click shockwave interaction
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    shockwavesRef.current.push({
      x: clickX,
      y: clickY,
      radius: 0,
      maxRadius: 280,
      strength: 1.0,
    });
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      style={{
        transition: "transform 0.1s ease-out",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
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
