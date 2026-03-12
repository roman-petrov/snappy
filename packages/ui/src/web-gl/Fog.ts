// cspell:words vanta lowlight midtone
/* eslint-disable no-bitwise */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */

import type { WebGlInterface } from "@snappy/browser";

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
  baseColor: 0x0a_0a_0c,
  blurFactor: 0.6,
  highlightColor: 0x1a_3d_42,
  lowlightColor: 0x0a_0a_0c,
  midtoneColor: 0x0d_1f_22,
  speed: 1,
  zoom: 1.2,
};

const byteMask = 0xff;

const hexToRgb = (hex: number): [number, number, number] => [
  ((hex >> 16) & byteMask) / byteMask,
  ((hex >> 8) & byteMask) / byteMask,
  (hex & byteMask) / byteMask,
];

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

  const baseRgb = hexToRgb(config.baseColor);
  const lowlightRgb = hexToRgb(config.lowlightColor);
  const midtoneRgb = hexToRgb(config.midtoneColor);
  const highlightRgb = hexToRgb(config.highlightColor);

  const resize = () => {
    const dpr = Math.min(devicePixelRatio, 2);
    const width = element.clientWidth;
    const height = element.clientHeight;
    webgl.canvas.width = Math.round(width * dpr);
    webgl.canvas.height = Math.round(height * dpr);
    webgl.canvas.style.width = `${width}px`;
    webgl.canvas.style.height = `${height}px`;
    webgl.gl.viewport(0, 0, webgl.canvas.width, webgl.canvas.height);
  };

  const state = { time: 0 };
  const timeStep = 0.01;

  const tick = () => {
    state.time += timeStep * config.speed;
    webgl.bindQuad(`a_uv`);
    uniforms.resolution(webgl.canvas.width, webgl.canvas.height);
    uniforms.time(state.time);
    uniforms.blurFactor(config.blurFactor);
    uniforms.zoom(config.zoom);
    uniforms.baseColor(baseRgb);
    uniforms.lowlightColor(lowlightRgb);
    uniforms.midtoneColor(midtoneRgb);
    uniforms.highlightColor(highlightRgb);
    webgl.drawQuad();
  };

  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(element);

  webgl.tick = tick;
  webgl.cleanup = () => {
    ro.disconnect();
    webgl.canvas.remove();
  };
};

export { default as FogShader } from "./Fog.shader.glsl?raw";
