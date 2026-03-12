/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import type { WebGlInterface } from "@snappy/browser";

import { _, Easing } from "@snappy/core";

const expandDurationMs = 300;

export type SparkleColor = [number, number, number];

export type SparkleOrigin = { x: number; y: number };

export const Sparkle = (
  canvas: HTMLCanvasElement,
  color: SparkleColor,
  opacity: number,
  origin: SparkleOrigin,
  webgl: WebGlInterface,
): void => {
  const { gl } = webgl;

  const uniforms = webgl.uniforms({
    color: { name: `u_color`, type: `3fv` },
    expand: { name: `u_expand`, type: `1f` },
    grainScale: { name: `u_grainScale`, type: `1f` },
    opacity: { name: `u_opacity`, type: `1f` },
    origin: { name: `u_origin`, type: `2f` },
    resolution: { name: `u_resolution`, type: `2f` },
    time: { name: `u_time`, type: `1f` },
  });

  const burst = { startTime: performance.now(), x: origin.x, y: origin.y };

  const resize = (width: number, height: number) => {
    const dpr = window.devicePixelRatio;
    const viewportWidth = Math.round(width * dpr);
    const viewportHeight = Math.round(height * dpr);
    if (canvas.width !== viewportWidth || canvas.height !== viewportHeight) {
      canvas.width = viewportWidth;
      canvas.height = viewportHeight;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }
    gl.viewport(0, 0, viewportWidth, viewportHeight);
  };

  const tick = () => {
    const { height, width } = canvas.getBoundingClientRect();
    if (width <= 0 || height <= 0) {
      return;
    }

    resize(width, height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const now = performance.now();
    const elapsed = now - burst.startTime;
    const rawExpand = Math.min(elapsed / expandDurationMs, 1);
    const expand = Easing.easeInAccel(rawExpand);

    webgl.bindQuad(`a_uv`);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const grainSizeCss = 4;
    const grainScale = 1 / (grainSizeCss * window.devicePixelRatio);
    uniforms.resolution(canvas.width, canvas.height);
    uniforms.origin(burst.x / width, 1 - burst.y / height);
    uniforms.grainScale(grainScale);
    uniforms.color(color);
    uniforms.expand(expand);
    uniforms.opacity(opacity);
    uniforms.time(elapsed / _.second);

    webgl.drawQuad();
  };

  webgl.tick = tick;
};

export { default as SparkleShader } from "./Sparkle.shader.glsl?raw";
