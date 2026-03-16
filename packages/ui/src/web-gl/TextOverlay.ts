/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable functional/no-expression-statements */
import type { WebGlInterface } from "@snappy/browser";

import { Rgb } from "@snappy/core";

export type TextOverlayOptions = { accentColor?: number; speed?: number };

const defaultAccent = 0x00_88_89_b3;

export const TextOverlay = (element: HTMLElement, options: TextOverlayOptions, webgl: WebGlInterface): void => {
  const accent = Rgb.rgba(options.accentColor ?? defaultAccent);
  const speed = options.speed ?? 1;

  const uniforms = webgl.uniforms({
    accentAlpha: { name: `u_accentAlpha`, type: `1f` },
    time: { name: `u_time`, type: `1f` },
  });

  const resize = () => webgl.resizeCanvas(Math.max(1, element.clientWidth), Math.max(1, element.clientHeight));
  const advanceTime = webgl.createTimeDriver(0.016);

  const tick = () => {
    webgl.gl.clearColor(0, 0, 0, 0);
    webgl.gl.clear(webgl.gl.COLOR_BUFFER_BIT);
    webgl.gl.enable(webgl.gl.BLEND);
    webgl.gl.blendFunc(webgl.gl.ONE, webgl.gl.ONE_MINUS_SRC_ALPHA);
    webgl.drawQuadFrame(() => {
      uniforms.time(advanceTime(speed));
      uniforms.accentAlpha(accent[Rgb.a]);
    });
  };

  webgl.observeResize(element, resize, tick);
};

export { default as TextOverlayShader } from "./TextOverlay.shader.glsl?raw";
