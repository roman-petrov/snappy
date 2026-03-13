import { WebGl } from "@snappy/browser";
import { _ } from "@snappy/core";
import { useLayoutEffect, useRef } from "react";

import type { TextOverlayEffectProps } from "./TextOverlayEffect";

import { $theme } from "../Store";
import { TextOverlay, TextOverlayShader } from "../web-gl";

const accentByTheme = { dark: 0x69_f4_f3_cc, light: 0x00_88_89_cc };

export const useTextOverlayEffectState = ({ accentColor, speed = 1 }: TextOverlayEffectProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (container === null) {
      return _.noop;
    }
    const color = accentColor ?? accentByTheme[$theme.value];
    const canvas = document.createElement(`canvas`);
    canvas.setAttribute(`aria-hidden`, `true`);
    const stop = WebGl.runLoop({ canvas, shader: TextOverlayShader }, webgl => {
      webgl.canvas.style.display = `block`;
      webgl.canvas.style.position = `absolute`;
      webgl.canvas.style.inset = `0`;
      webgl.canvas.style.width = `100%`;
      webgl.canvas.style.height = `100%`;
      container.append(webgl.canvas);
      TextOverlay(container, { accentColor: color, speed }, webgl);
    });

    return () => {
      stop?.();
    };
  }, [accentColor, speed]);

  return { containerRef };
};
