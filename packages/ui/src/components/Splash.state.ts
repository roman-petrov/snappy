import { WebGl } from "@snappy/browser";
import { _, Rgb } from "@snappy/core";
import { useLayoutEffect, useRef } from "react";

import type { SplashProps } from "./Splash";

import { Sparkle, SparkleShader } from "../web-gl";

export const useSplashState = ({ color, x, y }: SplashProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) {
      return _.noop;
    }
    const { a, b, g, r } = Rgb.rgba(color);

    const stop = WebGl.runLoop({ canvas, shader: SparkleShader }, webgl =>
      Sparkle(canvas, [r, g, b], a, { x, y }, webgl),
    );

    if (stop === undefined) {
      return _.noop;
    }

    return stop;
  }, [color, x, y]);

  return { canvasRef };
};
