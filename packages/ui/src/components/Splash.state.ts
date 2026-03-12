import { _, Rgb } from "@snappy/core";
import { useLayoutEffect, useRef } from "react";

import type { SplashProps } from "./Splash";

import { Sparkle, type SparkleBurst } from "../web-gl";

export const useSplashState = ({ color, x, y }: SplashProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return _.noop;
    }
    const { a, b, g, r } = Rgb.rgba(color);
    const webgl = Sparkle(canvas, [r, g, b], a);
    if (webgl === undefined) {
      return _.noop;
    }

    const startTime = performance.now();
    let rafId = 0;
    const burst: SparkleBurst = { id: 0, startTime, x, y };

    const tick = () => {
      const { height, width } = canvas.getBoundingClientRect();
      if (width <= 0 || height <= 0) {
        rafId = requestAnimationFrame(tick);

        return;
      }

      webgl.resize(width, height);
      const gl = canvas.getContext(`webgl2`) ?? undefined;
      if (gl !== undefined) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }

      webgl.drawBurst(burst, width, height);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      webgl.destroy();
    };
  }, [color, x, y]);

  return { canvasRef };
};
