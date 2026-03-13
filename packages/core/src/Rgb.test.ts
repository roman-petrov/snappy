import { describe, expect, it } from "vitest";

import { Rgb } from "./Rgb";

const { rgba, vec3 } = Rgb;

describe(`rgba`, () => {
  it(`returns [r, g, b, a] vector`, () => {
    expect(rgba(0xff_00_00_00)).toStrictEqual([1, 0, 0, 0]);
    expect(rgba(0x00_ff_00_00)).toStrictEqual([0, 1, 0, 0]);
    expect(Rgb.rgba(0x00_00_ff_00)).toStrictEqual([0, 0, 1, 0]);
    expect(rgba(0x00_00_00_ff)).toStrictEqual([0, 0, 0, 1]);
  });

  it(`parses 0xRRGGBBAA format`, () => {
    const v = rgba(0x0a_0a_0c_ff);

    expect(v[0]).toBeCloseTo(0.0392, 3);
    expect(v[1]).toBeCloseTo(0.0392, 3);
    expect(v[2]).toBeCloseTo(0.0471, 3);
    expect(v[3]).toBe(1);
  });
});

describe(`vec3`, () => {
  it(`returns first 3 components`, () => {
    expect(vec3([0.1, 0.2, 0.3, 0.4])).toStrictEqual([0.1, 0.2, 0.3]);
  });
});
