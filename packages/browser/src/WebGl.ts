/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */

import { _ } from "@snappy/core";

const quadVertexCount = 6;
const quadUv = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]);

const vertexShaderSource = `#version 300 es
in vec2 a_uv;
out vec2 v_uv;
void main() {
  v_uv = a_uv;
  gl_Position = vec4(2.0 * a_uv - 1.0, 0.0, 1.0);
}
`;

const compileShader = (gl: WebGL2RenderingContext, type: number, source: string): undefined | WebGLShader => {
  const s = gl.createShader(type);
  if (s === null) {
    return undefined;
  }
  gl.shaderSource(s, source);
  gl.compileShader(s);
  if (gl.getShaderParameter(s, gl.COMPILE_STATUS) === false) {
    gl.deleteShader(s);

    return undefined;
  }

  return s;
};

const defaultContextOptions: WebGLContextAttributes = { alpha: true, premultipliedAlpha: true };

const init = (
  canvas: HTMLCanvasElement,
  shader: string,
): undefined | { gl: WebGL2RenderingContext; program: WebGLProgram } => {
  const gl = canvas.getContext(`webgl2`, defaultContextOptions);
  if (gl === null) {
    return undefined;
  }
  const vs = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, shader);
  if (vs === undefined || fs === undefined) {
    if (vs !== undefined) {
      gl.deleteShader(vs);
    }
    if (fs !== undefined) {
      gl.deleteShader(fs);
    }

    return undefined;
  }
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  return { gl, program };
};

const quadBuffer = (gl: WebGL2RenderingContext): WebGLBuffer => {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, quadUv, gl.STATIC_DRAW);

  return buffer;
};

const bindQuad = (gl: WebGL2RenderingContext, prog: WebGLProgram, buffer: WebGLBuffer, attribName: string): void => {
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  const loc = gl.getAttribLocation(prog, attribName);
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
};

const drawQuad = (gl: WebGL2RenderingContext): void => {
  gl.drawArrays(gl.TRIANGLES, 0, quadVertexCount);
};

const release = (gl: WebGL2RenderingContext, prog?: WebGLProgram, buffer?: WebGLBuffer): void => {
  if (prog !== undefined) {
    gl.deleteProgram(prog);
  }
  if (buffer !== undefined) {
    gl.deleteBuffer(buffer);
  }
};

export type UniformsApi<S extends UniformSchema> = { [K in keyof S]: UniformSetter<S[K][`type`]> };

export type UniformSchema = Record<string, UniformSpec>;

export type UniformSpec = { name: string; type: `1f` | `2f` | `3fv` | `4f` };

type UniformSetter<T extends UniformSpec[`type`]> = T extends `1f`
  ? (x: number) => void
  : T extends `2f`
    ? (x: number, y: number) => void
    : T extends `3fv`
      ? (v: Vec3) => void
      : T extends `4f`
        ? (x: number, y: number, z: number, w: number) => void
        : never;

type Vec3 = [number, number, number] | Float32Array;

const withLoc = (loc: undefined | WebGLUniformLocation, fn: (loc: WebGLUniformLocation) => void) => {
  if (loc !== undefined) {
    fn(loc);
  }
};

const uniformSetters = {
  "1f": (gl: WebGL2RenderingContext, loc: undefined | WebGLUniformLocation) => (x: number) =>
    withLoc(loc, uniformLoc => gl.uniform1f(uniformLoc, x)),
  "2f": (gl: WebGL2RenderingContext, loc: undefined | WebGLUniformLocation) => (x: number, y: number) =>
    withLoc(loc, uniformLoc => gl.uniform2f(uniformLoc, x, y)),
  "3fv": (gl: WebGL2RenderingContext, loc: undefined | WebGLUniformLocation) => (v: Vec3) =>
    withLoc(loc, uniformLoc => gl.uniform3fv(uniformLoc, v)),
  "4f":
    (gl: WebGL2RenderingContext, loc: undefined | WebGLUniformLocation) =>
    (x: number, y: number, z: number, alpha: number) =>
      withLoc(loc, uniformLoc => gl.uniform4f(uniformLoc, x, y, z, alpha)),
};

const uniforms = <S extends UniformSchema>(
  gl: WebGL2RenderingContext,
  prog: WebGLProgram,
  schema: S,
): UniformsApi<S> => {
  const locations: Partial<Record<keyof S, undefined | WebGLUniformLocation>> = {};
  for (const [key, spec] of _.entries(schema)) {
    const loc = gl.getUniformLocation(prog, spec.name);
    locations[key] = loc ?? undefined;
  }

  return _.fromEntries(
    _.entries(schema).map(([key, spec]) => [key, uniformSetters[spec.type](gl, locations[key])] as const),
  ) as UniformsApi<S>;
};

export type WebGlInterface = {
  bindQuad: (attribName: string) => void;
  canvas: HTMLCanvasElement;
  cleanup?: () => void;
  drawQuad: () => void;
  gl: WebGL2RenderingContext;
  release: () => void;
  tick?: () => void;
  uniforms: <S extends UniformSchema>(schema: S) => UniformsApi<S>;
};

export type WebGlRunLoopParameters = { canvas: HTMLCanvasElement; shader: string };

const createInterface = (
  initResult: { gl: WebGL2RenderingContext; program: WebGLProgram },
  canvas: HTMLCanvasElement,
): WebGlInterface => {
  const { gl, program } = initResult;
  const buffer = quadBuffer(gl);

  return {
    bindQuad: (attribName: string) => bindQuad(gl, program, buffer, attribName),
    canvas,
    drawQuad: () => drawQuad(gl),
    gl,
    release: () => release(gl, program, buffer),
    uniforms: <S extends UniformSchema>(schema: S) => uniforms(gl, program, schema),
  };
};

/** Starts an animation loop; returns a function to stop it and cancel the current frame. */
const startLoop = (tick: () => void): (() => void) => {
  const state = { rafId: 0, stopped: false };

  const wrapped = () => {
    if (state.stopped) {
      return;
    }
    tick();
    state.rafId = requestAnimationFrame(wrapped);
  };

  state.rafId = requestAnimationFrame(wrapped);

  return () => {
    state.stopped = true;
    cancelAnimationFrame(state.rafId);
  };
};

const runLoop = (
  parameters: WebGlRunLoopParameters,
  create: (webgl: WebGlInterface) => void,
): (() => void) | undefined => {
  const initResult = init(parameters.canvas, parameters.shader);
  if (initResult === undefined) {
    return undefined;
  }

  const webgl = createInterface(initResult, parameters.canvas);
  create(webgl);
  if (webgl.tick === undefined) {
    return undefined;
  }

  const stop = startLoop(webgl.tick);

  return () => {
    stop();
    webgl.cleanup?.();
    webgl.release();
  };
};

export const WebGl = { bindQuad, drawQuad, init, quadBuffer, release, runLoop, uniforms };
