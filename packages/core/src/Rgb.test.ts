import { describe, expect, it } from "vitest";

import { Rgb } from "./Rgb";

const { css, mix, parse, rgba, vec3 } = Rgb;

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

describe(`parse`, () => {
  it(`parses an rgb() string`, () => {
    expect(parse(`rgb(18, 52, 86)`)).toStrictEqual([18, 52, 86]);
  });

  it(`ignores the alpha channel in rgba()`, () => {
    expect(parse(`rgba(10, 20, 30, 0.5)`)).toStrictEqual([10, 20, 30]);
  });

  it(`defaults missing channels to zero`, () => {
    expect(parse(`rgb()`)).toStrictEqual([0, 0, 0]);
  });
});

describe(`mix`, () => {
  it(`interpolates each channel`, () => {
    expect(mix([0, 0, 0], [10, 20, 30], 0.5)).toStrictEqual([5, 10, 15]);
  });

  it(`returns the endpoints at t = 0 and t = 1`, () => {
    expect(mix([1, 2, 3], [4, 5, 6], 0)).toStrictEqual([1, 2, 3]);
    expect(mix([1, 2, 3], [4, 5, 6], 1)).toStrictEqual([4, 5, 6]);
  });
});

describe(`css`, () => {
  it(`formats a rounded rgb() string`, () => {
    expect(css([18.4, 52.6, 86])).toBe(`rgb(18 53 86)`);
  });
});
