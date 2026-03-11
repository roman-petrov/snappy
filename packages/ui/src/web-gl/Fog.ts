// cspell:words vanta lowlight midtone
/* eslint-disable no-bitwise */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */

/**
 * ? Fog effect from Vanta.js: https://www.vantajs.com/?effect=fog
 */
import { WebGl } from "@snappy/browser";

import { FogShaders } from "./Fog.shaders";

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

export const Fog = (
  element: HTMLElement,
  {
    baseColor = fogDefaults.baseColor,
    blurFactor = fogDefaults.blurFactor,
    highlightColor = fogDefaults.highlightColor,
    lowlightColor = fogDefaults.lowlightColor,
    midtoneColor = fogDefaults.midtoneColor,
    speed = fogDefaults.speed,
    zoom = fogDefaults.zoom,
  }: FogOptions = {},
) => {
  const config = { baseColor, blurFactor, highlightColor, lowlightColor, midtoneColor, speed, zoom };
  const effectRef = { current: undefined as undefined | { destroy: () => void } };

  const start = () => {
    const canvas = document.createElement(`canvas`);
    canvas.setAttribute(`aria-hidden`, `true`);

    const initResult = WebGl.init(canvas, FogShaders.vertex, FogShaders.fragment, { alpha: false, antialias: false });
    if (initResult === undefined) {
      return;
    }
    const { gl, program } = initResult;
    element.append(canvas);

    const quadBuffer = WebGl.quadBuffer(gl, `uv`);

    const uniforms = WebGl.uniforms(gl, program, {
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
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const state = { rafId: 0, time: 0 };
    const timeStep = 0.01;

    const tick = () => {
      state.time += timeStep * config.speed;
      WebGl.bindQuad(gl, program, quadBuffer, `a_uv`);
      uniforms.resolution(canvas.width, canvas.height);
      uniforms.time(state.time);
      uniforms.blurFactor(config.blurFactor);
      uniforms.zoom(config.zoom);
      uniforms.baseColor(baseRgb);
      uniforms.lowlightColor(lowlightRgb);
      uniforms.midtoneColor(midtoneRgb);
      uniforms.highlightColor(highlightRgb);
      WebGl.drawQuad(gl);
      state.rafId = requestAnimationFrame(tick);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(element);
    state.rafId = requestAnimationFrame(tick);

    const destroy = () => {
      cancelAnimationFrame(state.rafId);
      ro.disconnect();
      WebGl.release(gl, program, quadBuffer);
      canvas.remove();
    };

    effectRef.current = { destroy };
  };

  const stop = () => {
    if (effectRef.current !== undefined) {
      effectRef.current.destroy();
      effectRef.current = undefined;
    }
  };

  return { start, stop };
};

export type Fog = ReturnType<typeof Fog>;
