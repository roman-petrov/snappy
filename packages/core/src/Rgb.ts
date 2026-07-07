/* eslint-disable no-bitwise */
import { _ } from "./_";

export type RgbaVec = [number, number, number, number];

export type RgbVec = [number, number, number];

const r = 0;
const g = 1;
const b = 2;
const a = 3;
const mask = 0xff;

const rgba = (value: number): RgbaVec => [
  (value >>> 24) / mask,
  ((value >>> 16) & mask) / mask,
  ((value >>> 8) & mask) / mask,
  (value & mask) / mask,
];

const vec3 = (v: RgbaVec): RgbVec => [v[r], v[g], v[b]];

const parse = (value: string): RgbVec => {
  const [x = 0, y = 0, z = 0] = (value.match(/[\d.]+/gu) ?? []).map(Number);

  return [x, y, z];
};

const mix = (from: RgbVec, to: RgbVec, t: number): RgbVec => [
  _.lerp(from[r], to[r], t),
  _.lerp(from[g], to[g], t),
  _.lerp(from[b], to[b], t),
];

const css = (v: RgbVec) => `rgb(${Math.round(v[r])} ${Math.round(v[g])} ${Math.round(v[b])})`;

export const Rgb = { a, b, css, g, mix, parse, r, rgba, vec3 } as const;
