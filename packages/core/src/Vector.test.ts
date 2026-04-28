import { describe, expect, it } from "vitest";

import { Vector } from "./Vector";

const { cosineSimilarity, dot, l2Norm } = Vector;

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
