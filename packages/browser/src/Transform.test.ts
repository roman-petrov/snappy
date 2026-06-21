import { describe, expect, it } from "vitest";

import { Transform } from "./Transform";

const { css } = Transform;

describe(`css`, () => {
  it(`formats translate`, () => {
    expect(css({ translateX: 100 })).toBe(`translateX(100px)`);
    expect(css({ translateY: -8 })).toBe(`translateY(-8px)`);
  });

  it(`formats rotate and scale`, () => {
    expect(css({ rotateY: 180, scale: 0.94 })).toBe(`rotateY(180deg) scale(0.94)`);
    expect(css({ rotateY: 0, scale: 1 })).toBe(`rotateY(0deg) scale(1)`);
  });

  it(`keeps transform order`, () => {
    expect(css({ rotateY: 90, scale: 0.5, translateX: 12 })).toBe(`translateX(12px) rotateY(90deg) scale(0.5)`);
  });
});
