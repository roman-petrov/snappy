/* eslint-disable no-bitwise */
export type RgbaVec = [number, number, number, number];

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

const vec3 = (v: RgbaVec): [number, number, number] => [v[r], v[g], v[b]];

export const Rgb = { a, b, g, r, rgba, vec3 } as const;
