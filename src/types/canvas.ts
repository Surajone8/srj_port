export interface CanvasCoordinates {
  x: number;
  y: number;
}

export interface CanvasDimensions {
  width: number;
  height: number;
}

export interface ArtboardFrameMeta {
  id: string;
  name: string;
  badge?: string;
  order: number;
  x: number;
  y: number;
  width: number;
  height: number;
  autoLayout?: {
    direction: "vertical" | "horizontal";
    padding: number | [number, number] | [number, number, number, number];
    gap: number;
  };
}

export interface PrototypeConnection {
  id: string;
  fromFrameId: string;
  fromElementId?: string;
  toFrameId: string;
  trigger: "click" | "hover" | "drag";
  animation: "smart-animate" | "instant" | "dissolve" | "slide-in";
  durationMs: number;
}

export type CanvasViewMode = "canvas" | "present" | "inspect";

export interface CanvasViewportState {
  zoom: number;
  pan: CanvasCoordinates;
  selectedFrameId: string | null;
  activeMode: CanvasViewMode;
}
