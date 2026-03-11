/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */

import { _ } from "@snappy/core";

const quadVertexCount = 6;
const quadUv = new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]);
const quadNdc = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);

const shader = (gl: WebGL2RenderingContext, type: number, source: string): undefined | WebGLShader => {
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

const init = (
  canvas: HTMLCanvasElement,
  vertex: string,
  fragment: string,
  contextOptions?: WebGLContextAttributes,
): undefined | { gl: WebGL2RenderingContext; program: WebGLProgram } => {
  const gl = canvas.getContext(`webgl2`, contextOptions ?? undefined);
  if (gl === null) {
    return undefined;
  }
  const vs = shader(gl, gl.VERTEX_SHADER, vertex);
  const fs = shader(gl, gl.FRAGMENT_SHADER, fragment);
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

const quadBuffer = (gl: WebGL2RenderingContext, layout: `ndc` | `uv`): WebGLBuffer => {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, layout === `uv` ? quadUv : quadNdc, gl.STATIC_DRAW);

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

export const WebGl = { bindQuad, drawQuad, init, quadBuffer, release, uniforms };
