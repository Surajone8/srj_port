"use client";

import { useState, useCallback, useRef } from "react";
import { CanvasCoordinates } from "@/types";
import { CANVAS_DEFAULTS } from "@/constants";
import { clamp } from "@/lib/utils";

export interface UseCanvasPanZoomReturn {
  zoom: number;
  pan: CanvasCoordinates;
  isDragging: boolean;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  setPan: (pan: CanvasCoordinates | ((prev: CanvasCoordinates) => CanvasCoordinates)) => void;
  handleMouseDown: (e: React.MouseEvent) => void;
  handleMouseMove: (e: React.MouseEvent) => void;
  handleMouseUp: () => void;
  handleWheel: (e: React.WheelEvent) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  panToFrame: (x: number, y: number, targetZoom?: number) => void;
}

export function useCanvasPanZoom(
  initialZoom: number = CANVAS_DEFAULTS.DEFAULT_ZOOM,
  initialPan: CanvasCoordinates = CANVAS_DEFAULTS.INITIAL_PAN
): UseCanvasPanZoomReturn {
  const [zoom, setZoomState] = useState<number>(initialZoom);
  const [pan, setPanState] = useState<CanvasCoordinates>(initialPan);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const panStartRef = useRef<CanvasCoordinates>(initialPan);

  const setZoom = useCallback((newZoom: number | ((prev: number) => number)) => {
    setZoomState((prev) => {
      const target = typeof newZoom === "function" ? newZoom(prev) : newZoom;
      return clamp(target, CANVAS_DEFAULTS.MIN_ZOOM, CANVAS_DEFAULTS.MAX_ZOOM);
    });
  }, []);

  const setPan = useCallback((newPan: CanvasCoordinates | ((prev: CanvasCoordinates) => CanvasCoordinates)) => {
    setPanState((prev) => (typeof newPan === "function" ? newPan(prev) : newPan));
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Middle click (button 1) or space + left click for panning
      if (e.button === 1 || (e.button === 0 && e.altKey)) {
        e.preventDefault();
        setIsDragging(true);
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        panStartRef.current = pan;
      }
    },
    [pan]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPanState({
        x: panStartRef.current.x + dx,
        y: panStartRef.current.y + dy,
      });
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        // Pinch-to-zoom
        e.preventDefault();
        const zoomDelta = -e.deltaY * 0.005;
        setZoom((prev) => clamp(prev + zoomDelta, CANVAS_DEFAULTS.MIN_ZOOM, CANVAS_DEFAULTS.MAX_ZOOM));
      } else {
        // Trackpad 2-finger scroll panning
        setPanState((prev) => ({
          x: prev.x - e.deltaX,
          y: prev.y - e.deltaY,
        }));
      }
    },
    [setZoom]
  );

  const zoomIn = useCallback(() => {
    setZoom((z) => Math.min(z + CANVAS_DEFAULTS.ZOOM_STEP, CANVAS_DEFAULTS.MAX_ZOOM));
  }, [setZoom]);

  const zoomOut = useCallback(() => {
    setZoom((z) => Math.max(z - CANVAS_DEFAULTS.ZOOM_STEP, CANVAS_DEFAULTS.MIN_ZOOM));
  }, [setZoom]);

  const resetView = useCallback(() => {
    setZoomState(CANVAS_DEFAULTS.DEFAULT_ZOOM);
    setPanState(CANVAS_DEFAULTS.INITIAL_PAN);
  }, []);

  const panToFrame = useCallback(
    (frameX: number, frameY: number, targetZoom: number = 0.9) => {
      setZoomState(targetZoom);
      setPanState({
        x: 100 - frameX * targetZoom,
        y: 100 - frameY * targetZoom,
      });
    },
    []
  );

  return {
    zoom,
    pan,
    isDragging,
    setZoom,
    setPan,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleWheel,
    zoomIn,
    zoomOut,
    resetView,
    panToFrame,
  };
}
