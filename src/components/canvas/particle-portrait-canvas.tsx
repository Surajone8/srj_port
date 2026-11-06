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
  // Globe target: position in the unit disc (-1..1), plus look when forming the globe
  bx?: number;
  by?: number;
  gAlpha?: number;
  gRadius?: number;
  // India target: position in the unit square (-1..1), plus look when forming the map
  ix?: number;
  iy?: number;
  iAlpha?: number;
  iRadius?: number;
  // Goa target: same layout as India
  goaX?: number;
  goaY?: number;
  goaAlpha?: number;
  goaRadius?: number;
}


interface Target {
  x: number;
  y: number;
  lum: number;
}

/** Draws a square crop of `img` (centre/side as fractions of the image) onto a size×size canvas and returns its pixels. */
function readSquare(
  img: HTMLImageElement,
  cxFrac: number,
  cyFrac: number,
  sideFrac: number,
  size: number
): Uint8ClampedArray | null {
  const off = document.createElement("canvas");
  off.width = size;
  off.height = size;
  const ctx = off.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;
  const W = img.naturalWidth;
  const H = img.naturalHeight;
  const side = sideFrac * W;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(img, cxFrac * W - side / 2, cyFrac * H - side / 2, side, side, 0, 0, size, size);
  return ctx.getImageData(0, 0, size, size).data;
}

/** Picks `count` weighted-random candidates (higher weight = more likely) in random order. */
function pickWeighted(
  cand: { x: number; y: number; lum: number; w: number }[],
  count: number
): Target[] {
  const keyed = cand.map((c) => ({ x: c.x, y: c.y, lum: c.lum, key: Math.pow(Math.random(), 1 / c.w) }));
  keyed.sort((a, b) => b.key - a.key);
  const chosen: Target[] = keyed.slice(0, count);
  for (let i = chosen.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chosen[i], chosen[j]] = [chosen[j], chosen[i]];
  }
  return chosen;
}

/**
 * Samples a relief-map photo (landmass on black) into `count` targets inside the unit square.
 * Only the landmass is used (background is skipped); edges and rugged terrain get extra weight
 * so the outline and mountains stay crisp.
 */
function sampleMapTargets(
  count: number,
  img: HTMLImageElement,
  cxFrac: number,
  cyFrac: number,
  sideFrac: number
): Target[] {
  if (count === 0) return [];
  const size = 320;
  const data = readSquare(img, cxFrac, cyFrac, sideFrac, size);
  if (!data) return [];

  const lumAt = (px: number, py: number) => {
    const qx = Math.min(size - 1, px);
    const qy = Math.min(size - 1, py);
    const i = (qy * size + qx) * 4;
    return (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
  };

  const cand: { x: number; y: number; lum: number; w: number }[] = [];
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const lum = lumAt(px, py);
      const grad = Math.abs(lum - lumAt(px + 1, py)) + Math.abs(lum - lumAt(px, py + 1));
      if (lum < 0.07 && grad < 0.1) continue; // empty background
      cand.push({
        x: ((px + 0.5) / size) * 2 - 1 + (Math.random() - 0.5) * (2 / size),
        y: ((py + 0.5) / size) * 2 - 1 + (Math.random() - 0.5) * (2 / size),
        lum,
        w: 0.35 + lum * lum + Math.min(1, grad * 3),
      });
    }
  }
  if (cand.length === 0) return [];
  return pickWeighted(cand, count);
}

function assignIndiaTargets(particles: Particle[], img: HTMLImageElement, pointSpacing: number) {
  // The map in India.jpg is centred at ~(0.513, 0.507) and spans ~0.88 of the image width
  const chosen = sampleMapTargets(particles.length, img, 0.513, 0.507, 0.88);
  if (chosen.length === 0) return;
  for (let i = 0; i < particles.length; i++) {
    const t = chosen[i % chosen.length];
    const p = particles[i];
    p.ix = t.x;
    p.iy = t.y;
    p.iAlpha = Math.min(1, 0.3 + t.lum * 0.7);
    p.iRadius = Math.max(0.3, (0.3 + t.lum) * pointSpacing * 0.13);
  }
}

function assignGoaTargets(particles: Particle[], img: HTMLImageElement, pointSpacing: number) {
  // The map in Goa.png is centred at ~(0.487, 0.467) and spans ~0.88 of the image width
  const chosen = sampleMapTargets(particles.length, img, 0.487, 0.467, 0.88);
  if (chosen.length === 0) return;
  for (let i = 0; i < particles.length; i++) {
    const t = chosen[i % chosen.length];
    const p = particles[i];
    p.goaX = t.x;
    p.goaY = t.y;
    p.goaAlpha = Math.min(1, 0.3 + t.lum * 0.7);
    p.goaRadius = Math.max(0.3, (0.3 + t.lum) * pointSpacing * 0.13);
  }
}

/**
 * Samples the globe photo into a pool of targets inside the unit disc and hands
 * one to every particle. Bright land gets more particles, dark ocean fewer and dimmer,
 * so the sphere silhouette stays readable.
 */
function assignGlobeTargets(
  particles: Particle[],
  globeImg: HTMLImageElement,
  pointSpacing: number
) {
  const size = 256;
  const off = document.createElement("canvas");
  off.width = size;
  off.height = size;
  const ctx = off.getContext("2d", { willReadFrequently: true });
  if (!ctx || particles.length === 0) return;

  // The sphere in world.jpg is centred at ~(0.498, 0.491) with radius ~0.393 of the image width
  const W = globeImg.naturalWidth;
  const H = globeImg.naturalHeight;
  const cx = 0.498 * W;
  const cy = 0.491 * H;
  const r = 0.393 * W;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);
  ctx.drawImage(globeImg, cx - r, cy - r, r * 2, r * 2, 0, 0, size, size);
  const data = ctx.getImageData(0, 0, size, size).data;

  const cand: { x: number; y: number; lum: number; key: number }[] = [];
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const ux = ((px + 0.5) / size) * 2 - 1;
      const uy = ((py + 0.5) / size) * 2 - 1;
      if (ux * ux + uy * uy > 1) continue;
      const i = (py * size + px) * 4;
      const lum = (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
      const w = 0.12 + lum * lum * 1.6;
      cand.push({
        x: ux + (Math.random() - 0.5) * (2 / size),
        y: uy + (Math.random() - 0.5) * (2 / size),
        lum,
        key: Math.pow(Math.random(), 1 / w),
      });
    }
  }

  cand.sort((a, b) => b.key - a.key);
  const chosen = cand.slice(0, particles.length);
  for (let i = chosen.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chosen[i], chosen[j]] = [chosen[j], chosen[i]];
  }

  for (let i = 0; i < particles.length; i++) {
    const t = chosen[i % chosen.length];
    const p = particles[i];
    p.bx = t.x;
    p.by = t.y;
    p.gAlpha = Math.min(1, 0.14 + t.lum * 0.86);
    p.gRadius = Math.max(0.3, (0.3 + t.lum) * pointSpacing * 0.13);
  }
}

interface ParticlePortraitCanvasProps {
  imageSrc?: string;
  className?: string;
  pointSpacing?: number;
  mouseRadius?: number;
  pushStrength?: number;
  /** 0 = portrait, 1 = globe, 2 = India map, 3 = Goa map. Updated by scroll. */
  gatherRef?: React.MutableRefObject<number>;
  /** Image of the globe the particles form first. */
  globeSrc?: string;
  /** Image of India the particles form after the globe. */
  indiaSrc?: string;
  /** Image of Goa the particles form after India. */
  goaSrc?: string;
}

export function ParticlePortraitCanvas({
  imageSrc = "/images/portrait.png",
  className = "",
  pointSpacing = 6,
  mouseRadius = 140,
  gatherRef,
  globeSrc,
  indiaSrc,
  goaSrc,
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
              const sizeMultiplier = isRightSide ? 0.95 : 0.65;

              // Size circle based on brightness
              const baseRadius = Math.max(
                0.32,
                luminance * (pointSpacing * 0.25) * sizeMultiplier
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
            const baseRadius = Math.max(0.35, luminance * (pointSpacing * 0.23));
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

  // Setup canvas and load image with responsive ResizeObserver
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let isMounted = true;
    let loadedImg: HTMLImageElement | null = null;
    let globeImg = null as HTMLImageElement | null;
    let indiaImg = null as HTMLImageElement | null;
    let goaImg = null as HTMLImageElement | null;

    const applyGlobe = () => {
      if (globeImg && globeImg.complete && globeImg.naturalWidth > 0) {
        assignGlobeTargets(particlesRef.current, globeImg, pointSpacing);
      }
      if (indiaImg && indiaImg.complete && indiaImg.naturalWidth > 0) {
        assignIndiaTargets(particlesRef.current, indiaImg, pointSpacing);
      }
      if (goaImg && goaImg.complete && goaImg.naturalWidth > 0) {
        assignGoaTargets(particlesRef.current, goaImg, pointSpacing);
      }
    };

    const setupDimensionsAndParticles = () => {
      if (!isMounted || !canvas || !container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width === 0 || height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      if (loadedImg && loadedImg.complete && loadedImg.naturalWidth > 0) {
        initParticles(loadedImg, width, height);
      } else {
        generateProceduralParticles(width, height);
      }
      applyGlobe();
    };

    if (globeSrc) {
      const g = new Image();
      g.src = globeSrc;
      g.onload = () => {
        if (!isMounted) return;
        globeImg = g;
        applyGlobe();
      };
    }

    if (indiaSrc) {
      const g = new Image();
      g.src = indiaSrc;
      g.onload = () => {
        if (!isMounted) return;
        indiaImg = g;
        applyGlobe();
      };
    }

    if (goaSrc) {
      const g = new Image();
      g.src = goaSrc;
      g.onload = () => {
        if (!isMounted) return;
        goaImg = g;
        applyGlobe();
      };
    }

    if (imageSrc) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageSrc;
      img.onload = () => {
        if (!isMounted) return;
        loadedImg = img;
        setupDimensionsAndParticles();
      };
      img.onerror = () => {
        if (!isMounted) return;
        setupDimensionsAndParticles();
      };
    } else {
      setupDimensionsAndParticles();
    }

    const resizeObserver = new ResizeObserver(() => {
      setupDimensionsAndParticles();
    });
    resizeObserver.observe(container);

    return () => {
      isMounted = false;
      resizeObserver.disconnect();
    };
  }, [imageSrc, globeSrc, indiaSrc, goaSrc, pointSpacing, initParticles, generateProceduralParticles]);

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
      // Overdamped (no overshoot): particles ease into place without bouncing
      const springStiffness = 0.06;
      const damping = 0.6;

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

      // Scroll-driven stages: 0 = portrait, 1 = globe, 2 = India map, 3 = Goa map
      const stage = gatherRef?.current ?? 0;
      const smooth = (t: number) => {
        const c = Math.min(1, Math.max(0, t));
        return c * c * (3 - 2 * c);
      };
      const gather = smooth(stage); // portrait -> globe
      const toIndia = smooth(stage - 1); // globe -> India
      const toGoa = smooth(stage - 2); // India -> Goa
      const ballRadius = Math.min(width, height) * 0.26;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Blend look: portrait -> globe -> India
        const globeAlpha = p.gAlpha === undefined ? p.baseAlpha : p.baseAlpha + (p.gAlpha - p.baseAlpha) * gather;
        const globeRadius = p.gRadius === undefined ? p.baseRadius : p.baseRadius + (p.gRadius - p.baseRadius) * gather;
        const indiaAlpha = p.iAlpha === undefined ? globeAlpha : globeAlpha + (p.iAlpha - globeAlpha) * toIndia;
        const indiaRadius = p.iRadius === undefined ? globeRadius : globeRadius + (p.iRadius - globeRadius) * toIndia;
        const aimAlpha = p.goaAlpha === undefined ? indiaAlpha : indiaAlpha + (p.goaAlpha - indiaAlpha) * toGoa;
        const aimRadius = p.goaRadius === undefined ? indiaRadius : indiaRadius + (p.goaRadius - indiaRadius) * toGoa;

        if (!prefersReducedMotion) {
          // Fallback if the globe image isn't available: uniform spot inside the disc
          if (p.bx === undefined || p.by === undefined) {
            const a = Math.random() * Math.PI * 2;
            const r = Math.sqrt(Math.random());
            p.bx = r * Math.cos(a);
            p.by = r * Math.sin(a);
          }

          // 1. Mouse hover 3D organic displacement (clean forward/depth pop, no spinning/revolving)
          if (mouse.active && gather < 0.05) {
            const dx = p.originX - mouse.x;
            const dy = p.originY - mouse.y;
            const dist = Math.hypot(dx, dy);

            if (dist < mouseRadius && dist > 0) {
              const proximity = 1 - dist / mouseRadius;
              // Smooth cosine bell curve for localized softness
              const smoothProximity = 0.5 - 0.5 * Math.cos(proximity * Math.PI);

              // Directional, non-revolving 3D movement:
              // Gentle radial nudge outward and soft forward lift along Z
              const dirX = dist > 0.001 ? dx / dist : 0;
              const dirY = dist > 0.001 ? dy / dist : 0;

              // Moderate, gentle velocity impulse
              p.vx += dirX * smoothProximity * 0.45;
              p.vy += dirY * smoothProximity * 0.45;
              p.vz += smoothProximity * 2.2; // Pops smoothly forward along Z

              // Subtle brightness boost without blowing out
              p.alpha = Math.min(1.0, p.baseAlpha + smoothProximity * 0.35);
            } else {
              p.alpha += (aimAlpha - p.alpha) * 0.05;
            }
          } else {
            p.alpha += (aimAlpha - p.alpha) * 0.05;
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
              p.vz += waveFactor * 4;
              p.vx += (dx / (dist || 1)) * waveFactor * 0.8;
              p.vy += (dy / (dist || 1)) * waveFactor * 0.8;
            }
          }

          // 3. Gentle ambient 3D floating harmonic
          const ambientWaveX = Math.sin(time + p.noiseOffset) * 0.3;
          const ambientWaveY = Math.cos(time + p.noiseOffset * 1.3) * 0.3;
          const ambientWaveZ = Math.sin(time * 0.8 + p.phase) * 1.0;

          // 4. Harmonic restoring spring toward origin on all 3 dimensions (X, Y, Z)
          let targetX = p.originX + ambientWaveX;
          let targetY = p.originY + ambientWaveY;
          let targetZ = p.originZ + ambientWaveZ;

          if (gather > 0) {
            // Globe facing the viewer, centered on the canvas, with a slight bulge toward the camera
            const bx = p.bx!;
            const by = p.by!;
            const ballX = width / 2 + bx * ballRadius;
            const ballY = height / 2 + by * ballRadius;
            const ballZ = Math.sqrt(Math.max(0, 1 - bx * bx - by * by)) * ballRadius * 0.25;
            targetX += (ballX - targetX) * gather;
            targetY += (ballY - targetY) * gather;
            targetZ += (ballZ - targetZ) * gather;
          }

          if (toIndia > 0) {
            // India map: flat, same size/centre as the globe
            const mapX = width / 2 + (p.ix ?? p.bx!) * ballRadius;
            const mapY = height / 2 + (p.iy ?? p.by!) * ballRadius;
            targetX += (mapX - targetX) * toIndia;
            targetY += (mapY - targetY) * toIndia;
            targetZ += (0 - targetZ) * toIndia;
          }

          if (toGoa > 0) {
            // Goa map: same placement as India
            const goaX = width / 2 + (p.goaX ?? p.ix ?? p.bx!) * ballRadius;
            const goaY = height / 2 + (p.goaY ?? p.iy ?? p.by!) * ballRadius;
            targetX += (goaX - targetX) * toGoa;
            targetY += (goaY - targetY) * toGoa;
          }

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
        const projectedRadius = Math.max(0.3, aimRadius * scale);
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
  }, [mouseRadius, gatherRef]);

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
