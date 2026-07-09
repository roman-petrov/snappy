import { useId } from "react";

import type { GlassProps } from "./Glass";

export const useGlassState = ({ roughness, ...rest }: GlassProps) => {
  const id = `glass-${useId().replaceAll(`:`, ``)}`;
  const relief = typeof window === `undefined` ? 1 : window.devicePixelRatio * window.devicePixelRatio;

  return { ...rest, grain: roughness, id, relief };
};
