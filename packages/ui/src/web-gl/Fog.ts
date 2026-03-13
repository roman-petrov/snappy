/* eslint-disable @typescript-eslint/no-magic-numbers */
// cspell:words vanta lowlight midtone
/* eslint-disable functional/no-expression-statements */
import type { WebGlInterface } from "@snappy/browser";

import { Rgb } from "@snappy/core";

/**
 * ? Fog effect from Vanta.js: https://www.vantajs.com/?effect=fog
 */
export type FogOptions = {
  baseColor?: number;
  blurFactor?: number;
  highlightColor?: number;
  lowlightColor?: number;
  midtoneColor?: number;
  speed?: number;
  zoom?: number;
};

const fogDefaults: Required<
  Pick<FogOptions, `baseColor` | `blurFactor` | `highlightColor` | `lowlightColor` | `midtoneColor` | `speed` | `zoom`>
> = {
  baseColor: 0x0a_0a_0c_ff,
  blurFactor: 0.6,
  highlightColor: 0x1a_3d_42_ff,
  lowlightColor: 0x0a_0a_0c_ff,
  midtoneColor: 0x0d_1f_22_ff,
  speed: 1,
  zoom: 1.2,
};

export const Fog = (element: HTMLElement, options: FogOptions, webgl: WebGlInterface): void => {
  const config = {
    baseColor: options.baseColor ?? fogDefaults.baseColor,
    blurFactor: options.blurFactor ?? fogDefaults.blurFactor,
    highlightColor: options.highlightColor ?? fogDefaults.highlightColor,
    lowlightColor: options.lowlightColor ?? fogDefaults.lowlightColor,
    midtoneColor: options.midtoneColor ?? fogDefaults.midtoneColor,
    speed: options.speed ?? fogDefaults.speed,
    zoom: options.zoom ?? fogDefaults.zoom,
  };

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

  const baseRgb = Rgb.vec3(Rgb.rgba(config.baseColor));
  const lowlightRgb = Rgb.vec3(Rgb.rgba(config.lowlightColor));
  const midtoneRgb = Rgb.vec3(Rgb.rgba(config.midtoneColor));
  const highlightRgb = Rgb.vec3(Rgb.rgba(config.highlightColor));
  const resize = () => webgl.resizeCanvas(element.clientWidth, element.clientHeight, true);
  const advanceTime = webgl.createTimeDriver(0.01);

  const tick = () =>
    webgl.drawQuadFrame(() => {
      uniforms.resolution(webgl.canvas.width, webgl.canvas.height);
      uniforms.time(advanceTime(config.speed));
      uniforms.blurFactor(config.blurFactor);
      uniforms.zoom(config.zoom);
      uniforms.baseColor(baseRgb);
      uniforms.lowlightColor(lowlightRgb);
      uniforms.midtoneColor(midtoneRgb);
      uniforms.highlightColor(highlightRgb);
    });

  webgl.observeResize(element, resize, tick);
};

export { default as FogShader } from "./Fog.shader.glsl?raw";
