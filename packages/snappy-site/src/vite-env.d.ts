/// <reference types="vite/client" />

declare module "aos";

declare global {
  interface Window {
    THREE: { [key: string]: unknown; WebGLRenderer?: unknown };
    VANTA: { FOG: (options: Record<string, unknown>) => { destroy: () => void } };
  }
}
