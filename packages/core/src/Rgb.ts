/* eslint-disable no-bitwise */
export type Rgba = { a: number; b: number; g: number; r: number };

const mask = 0xff;

const rgba = (value: number) => ({
  a: (value & mask) / mask,
  b: ((value >>> 8) & mask) / mask,
  g: ((value >>> 16) & mask) / mask,
  r: (value >>> 24) / mask,
});

export const Rgb = { rgba };
