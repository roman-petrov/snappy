/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { WebGl } from "@snappy/browser";
import { _, Easing } from "@snappy/core";

import { SparkleShaders } from "./Sparkle.shaders";

const expandDurationMs = 300;

export type SparkleBurst = { id: number; releaseTime?: number; startTime: number; x: number };

export type SparkleColor = [number, number, number];

export const Sparkle = (canvas: HTMLCanvasElement, color: SparkleColor) => {
  const initResult = WebGl.init(canvas, SparkleShaders.vertex, SparkleShaders.fragment, {
    alpha: true,
    premultipliedAlpha: false,
  });
  if (initResult === undefined) {
    return undefined;
  }
  const { gl, program } = initResult;
  const quadBuffer = WebGl.quadBuffer(gl, `ndc`);

  const uniforms = WebGl.uniforms(gl, program, {
    color: { name: `u_color`, type: `3fv` },
    expand: { name: `u_expand`, type: `1f` },
    origin: { name: `u_origin`, type: `2f` },
    resolution: { name: `u_resolution`, type: `2f` },
    time: { name: `u_time`, type: `1f` },
  });

  const destroy = () => WebGl.release(gl, program, quadBuffer);

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

  const drawBurst = (burst: SparkleBurst, width: number) => {
    if (burst.releaseTime !== undefined) {
      return burst.id;
    }
    const now = performance.now();
    const elapsed = now - burst.startTime;
    const expandDuration = expandDurationMs;
    const rawExpand = Math.min(elapsed / expandDuration, 1);
    const expand = Easing.easeOutExpo(rawExpand);

    WebGl.bindQuad(gl, program, quadBuffer, `a_position`);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    uniforms.resolution(canvas.width, canvas.height);
    uniforms.origin(burst.x / width, 0);
    uniforms.color(color);
    uniforms.expand(expand);
    uniforms.time(elapsed / _.second);

    WebGl.drawQuad(gl);

    return undefined;
  };

  return { destroy, drawBurst, resize };
};

export type Sparkle = ReturnType<typeof Sparkle>;
