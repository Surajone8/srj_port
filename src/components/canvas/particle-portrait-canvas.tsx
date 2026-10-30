"use client";

import * as React from "react";
import { useEffect, useRef, useState, useCallback } from "react";

interface Particle {
  originX: number;
  originY: number;
  originZ: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  baseRadius: number;
  alpha: number;
  baseAlpha: number;
  noiseOffset: number;
  phase: number;
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
    speed: number;
    active: boolean;
  }>({
    x: -9999,
    y: -9999,
    prevX: -9999,
    prevY: -9999,
    vx: 0,
    vy: 0,
    speed: 0,
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
              const isRightSide = x > width * 0.48;
              const sizeMultiplier = isRightSide ? 1.3 : 0.85;

              // Size circle based on brightness
              const baseRadius = Math.max(
                0.75,
                luminance * (pointSpacing * 0.48) * sizeMultiplier
              );

              // Base alpha
              const baseAlpha = Math.min(1.0, 0.25 + luminance * 0.75);

              // 3D depth baseline from facial luminance
              const originZ = (luminance - 0.5) * 40;

              particles.push({
                originX: x,
                originY: y,
                originZ,
                x,
                y,
                z: originZ,
                vx: 0,
                vy: 0,
                vz: 0,
                radius: baseRadius,
                baseRadius,
                alpha: baseAlpha,
                baseAlpha,
                noiseOffset: Math.random() * Math.PI * 2,
                phase: Math.random() * Math.PI * 2,
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
            const originZ = (luminance - 0.5) * 40;

            particles.push({
              originX: x,
              originY: y,
              originZ,
              x,
              y,
              z: originZ,
              vx: 0,
              vy: 0,
              vz: 0,
              radius: baseRadius,
              baseRadius,
              alpha: baseAlpha,
              baseAlpha,
              noiseOffset: Math.random() * Math.PI * 2,
              phase: Math.random() * Math.PI * 2,
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
      time += 0.02;
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      // Clear with pitch dark background
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const shockwaves = shockwavesRef.current;

      // Restorative spring physics parameters
      const springStiffness = 0.045; // Smooth restoring force
      const damping = 0.90;          // Fluid damping so it oscillates gently for a short time and returns

      // Expand and prune shockwaves
      for (let s = shockwaves.length - 1; s >= 0; s--) {
        const sw = shockwaves[s];
        sw.radius += 7;
        sw.strength *= 0.94;
        if (sw.radius > sw.maxRadius || sw.strength < 0.05) {
          shockwaves.splice(s, 1);
        }
      }

      const fov = 750; // Perspective camera focal depth

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (!prefersReducedMotion) {
          // 1. Mouse hover 3D organic displacement
          if (mouse.active) {
            const dx = p.originX - mouse.x;
            const dy = p.originY - mouse.y;
            const dist = Math.hypot(dx, dy);

            if (dist < mouseRadius && dist > 0) {
              const proximity = (1 - dist / mouseRadius);
              // Smooth cosine bell curve for localized softness
              const smoothProximity = 0.5 - 0.5 * Math.cos(proximity * Math.PI);

              // 3D organic impulse - no hollow hole created!
              // Particles sway gently along X, Y, and pop toward the viewer on Z
              const angle = p.phase + time * 1.5;
              const impulseX = Math.cos(angle) * (smoothProximity * 1.4);
              const impulseY = Math.sin(angle) * (smoothProximity * 1.4);
              const impulseZ = smoothProximity * 4.2; // pops forward in 3D

              p.vx += impulseX;
              p.vy += impulseY;
              p.vz += impulseZ;

              // Subtle brightness boost without blowing out
              p.alpha = Math.min(1.0, p.baseAlpha + smoothProximity * 0.35);
            } else {
              p.alpha += (p.baseAlpha - p.alpha) * 0.05;
            }
          } else {
            p.alpha += (p.baseAlpha - p.alpha) * 0.05;
          }

          // 2. Shockwave ripple in 3D
          for (let s = 0; s < shockwaves.length; s++) {
            const sw = shockwaves[s];
            const dx = p.originX - sw.x;
            const dy = p.originY - sw.y;
            const dist = Math.hypot(dx, dy);
            const waveDiff = Math.abs(dist - sw.radius);

            if (waveDiff < 25) {
              const waveFactor = (1 - waveDiff / 25) * sw.strength;
              p.vz += waveFactor * 5;
              p.vx += (dx / (dist || 1)) * waveFactor * 1.2;
              p.vy += (dy / (dist || 1)) * waveFactor * 1.2;
            }
          }

          // 3. Gentle ambient 3D floating harmonic
          const ambientWaveX = Math.sin(time + p.noiseOffset) * 0.4;
          const ambientWaveY = Math.cos(time + p.noiseOffset * 1.3) * 0.4;
          const ambientWaveZ = Math.sin(time * 0.8 + p.phase) * 1.5;

          // 4. Harmonic restoring spring toward origin on all 3 dimensions (X, Y, Z)
          const targetX = p.originX + ambientWaveX;
          const targetY = p.originY + ambientWaveY;
          const targetZ = p.originZ + ambientWaveZ;

          p.vx = (p.vx + (targetX - p.x) * springStiffness) * damping;
          p.vy = (p.vy + (targetY - p.y) * springStiffness) * damping;
          p.vz = (p.vz + (targetZ - p.z) * springStiffness) * damping;

          p.x += p.vx;
          p.y += p.vy;
          p.z += p.vz;
        }

        // 5. 3D Perspective Projection
        // As particle pops along Z, it slightly scales its radius and projects its (X, Y)
        const scale = fov / (fov - p.z);
        const projectedRadius = Math.max(0.6, p.baseRadius * scale);
        const projX = (p.x - width / 2) * scale + width / 2;
        const projY = (p.y - height / 2) * scale + height / 2;

        // Render circle
        ctx.beginPath();
        ctx.arc(projX, projY, projectedRadius, 0, Math.PI * 2);
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
  }, [mouseRadius]);

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
        mouse.speed = Math.hypot(mouse.vx, mouse.vy);
      }

      mouse.prevX = currentX;
      mouse.prevY = currentY;
      mouse.x = currentX;
      mouse.y = currentY;
      mouse.active = true;
    };

    const handlePointerLeave = () => {
      const mouse = mouseRef.current;
      mouse.active = false;
      mouse.prevX = -9999;
      mouse.prevY = -9999;
      mouse.vx = 0;
      mouse.vy = 0;
      mouse.speed = 0;
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
