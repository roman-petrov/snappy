import { WebGl } from "@snappy/browser";
import { _ } from "@snappy/core";
import { useLayoutEffect, useRef } from "react";

import type { BusyShimmerOverlayProps } from "./BusyShimmerOverlay";

import { Theme } from "../core";
import { BusyShimmer, BusyShimmerShader } from "../web-gl";

const accentByTheme = { dark: 0x69_f4_f3_cc, light: 0x00_88_89_cc };

export const useBusyShimmerOverlayState = ({ accentColor, speed = 1 }: BusyShimmerOverlayProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (container === null) {
      return _.noop;
    }
    const color = accentColor ?? accentByTheme[Theme.effective()];
    const canvas = document.createElement(`canvas`);
    canvas.setAttribute(`aria-hidden`, `true`);
    const stop = WebGl.runLoop({ canvas, shader: BusyShimmerShader }, webgl => {
      webgl.canvas.style.display = `block`;
      webgl.canvas.style.position = `absolute`;
      webgl.canvas.style.inset = `0`;
      webgl.canvas.style.width = `100%`;
      webgl.canvas.style.height = `100%`;
      container.append(webgl.canvas);
      BusyShimmer(container, { accentColor: color, speed }, webgl);
    });

    return () => {
      stop?.();
    };
  }, [accentColor, speed]);

  return { containerRef };
};
