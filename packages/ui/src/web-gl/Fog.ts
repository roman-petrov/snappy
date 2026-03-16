/* eslint-disable @typescript-eslint/no-magic-numbers */
// cspell:words vanta lowlight midtone
/* eslint-disable functional/no-expression-statements */
import type { WebGlInterface } from "@snappy/browser";

import { Rgb } from "@snappy/core";

/**
 * ? Fog effect from Vanta.js: https://www.vantajs.com/?effect=fog
 */
export type FogOptions = {
  baseColor: number;
  blurFactor: number;
  highlightColor: number;
  lowlightColor: number;
  midtoneColor: number;
  speed: number;
  zoom: number;
};

export const Fog = (
  element: HTMLElement,
  { baseColor, blurFactor, highlightColor, lowlightColor, midtoneColor, speed, zoom }: FogOptions,
  webgl: WebGlInterface,
): void => {
  element.append(webgl.canvas);

  const uniforms = webgl.uniforms({
    baseColor: { name: `u_baseColor`, type: `3fv` },
    blurFactor: { name: `u_blurFactor`, type: `1f` },
    highlightColor: { name: `u_highlightColor`, type: `3fv` },
    lowlightColor: { name: `u_lowlightColor`, type: `3fv` },
    midtoneColor: { name: `u_midtoneColor`, type: `3fv` },
    resolution: { name: `u_resolution`, type: `2f` },
    time: { name: `u_time`, type: `1f` },
    zoom: { name: `u_zoom`, type: `1f` },
  });

  const resize = () => webgl.resizeCanvas(element.clientWidth, element.clientHeight, true);
  const advanceTime = webgl.createTimeDriver(0.01);

  const tick = () =>
    webgl.drawQuadFrame(() => {
      uniforms.resolution(webgl.canvas.width, webgl.canvas.height);
      uniforms.time(advanceTime(speed));
      uniforms.blurFactor(blurFactor);
      uniforms.zoom(zoom);
      uniforms.baseColor(Rgb.vec3(Rgb.rgba(baseColor)));
      uniforms.lowlightColor(Rgb.vec3(Rgb.rgba(lowlightColor)));
      uniforms.midtoneColor(Rgb.vec3(Rgb.rgba(midtoneColor)));
      uniforms.highlightColor(Rgb.vec3(Rgb.rgba(highlightColor)));
    });

  webgl.observeResize(element, resize, tick);
};

export { default as FogShader } from "./Fog.shader.glsl?raw";
