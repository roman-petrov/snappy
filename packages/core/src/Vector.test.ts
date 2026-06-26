import { describe, expect, it } from "vitest";

import { Vector } from "./Vector";

const { abs, axis, cosineSimilarity, delta, dot, from, horizontal, l2Norm, max, sub, vertical } = Vector;

describe(`from`, () => {
  it(`builds a 2D vector`, () => {
    expect(from(3, -4)).toStrictEqual({ x: 3, y: -4 });
  });
});

describe(`sub`, () => {
  it(`subtracts component-wise`, () => {
    expect(sub(from(8, 6), from(3, 4))).toStrictEqual({ x: 5, y: 2 });
  });
});

describe(`delta`, () => {
  it(`returns displacement from origin to point`, () => {
    expect(delta(from(10, 20), 14, 17)).toStrictEqual({ x: 4, y: -3 });
  });
});

describe(`abs`, () => {
  it(`returns component magnitudes`, () => {
    expect(abs(from(-3, 4))).toStrictEqual({ x: 3, y: 4 });
  });
});

describe(`max`, () => {
  it(`returns component-wise maximum`, () => {
    expect(max(from(5, 2), from(3, 8))).toStrictEqual({ x: 5, y: 8 });
  });
});

describe(`axis`, () => {
  it(`returns pending below threshold`, () => {
    expect(axis(from(3, 3), 4)).toBe(`pending`);
  });

  it(`prefers horizontal on equal axes by default`, () => {
    expect(axis(from(8, 8), 4)).toBe(`horizontal`);
  });

  it(`prefers vertical on equal axes when tied to scroll`, () => {
    expect(axis(from(8, 8), 4, `vertical`)).toBe(`vertical`);
  });

  it(`returns vertical when y dominates`, () => {
    expect(axis(from(2, 10), 4)).toBe(`vertical`);
  });
});

describe(`horizontal`, () => {
  it(`requires slop and ratio`, () => {
    expect(horizontal(from(12, 0), 12, 3)).toBe(true);
    expect(horizontal(from(36, 10), 12, 3)).toBe(true);
    expect(horizontal(from(12, 5), 12, 3)).toBe(false);
    expect(horizontal(from(8, 0), 12, 3)).toBe(false);
  });
});

describe(`vertical`, () => {
  it(`requires slop and ratio`, () => {
    expect(vertical(from(0, 12), 12, 3)).toBe(true);
    expect(vertical(from(4, 36), 12, 3)).toBe(true);
    expect(vertical(from(5, 12), 12, 3)).toBe(true);
    expect(vertical(from(40, 12), 12, 3)).toBe(false);
    expect(vertical(from(0, 8), 12, 3)).toBe(false);
  });
});

describe(`dot`, () => {
  it(`returns undefined for empty operands`, () => {
    expect(dot([], [])).toBeUndefined();
  });

  it(`computes inner product`, () => {
    expect(dot([1, 2, 3], [4, 5, 6])).toBe(32);
    expect(dot([2, -1], [3, 4])).toBe(2);
  });
});

describe(`l2Norm`, () => {
  it(`is zero for an empty vector`, () => {
    expect(l2Norm([])).toBe(0);
  });

  it(`returns Euclidean length`, () => {
    expect(l2Norm([3, 4])).toBe(5);
    expect(l2Norm([1, 0, 0])).toBe(1);
  });
});

describe(`cosineSimilarity`, () => {
  it(`returns 0 for length mismatch or empty operands`, () => {
    expect(cosineSimilarity([], [])).toBe(0);
    expect(cosineSimilarity([1], [1, 2])).toBe(0);
  });

  it(`returns 1 for same direction`, () => {
    expect(cosineSimilarity([1, 0], [2, 0])).toBe(1);
    expect(cosineSimilarity([3, 4], [6, 8])).toBe(1);
  });

  it(`returns 0 for orthogonal vectors`, () => {
    expect(cosineSimilarity([1, 0], [0, 1])).toBe(0);
  });
});
