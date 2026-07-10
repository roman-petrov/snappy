import { _ } from "@snappy/core";
import { useId } from "react";

import type { GlassProps } from "./Glass";

import { GlassLook } from "./GlassLook";

export const useGlassState = ({ look, ...rest }: GlassProps) => {
  const id = `glass-${useId().replaceAll(`:`, ``)}`;
  const relief = _.ssr ? 1 : window.devicePixelRatio * window.devicePixelRatio;
  const { blur, roughness, tint } = GlassLook[look];

  return { ...rest, blur, grain: roughness, id, relief, tint };
};
