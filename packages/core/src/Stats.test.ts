import { describe, expect, it } from "vitest";

import { Stats } from "./Stats";

const { max, mean, sum } = Stats;

describe(`max`, () => {
  it(`returns undefined for an empty array`, () => {
    expect(max([])).toBeUndefined();
  });

  it(`finds maximum in numeric array`, () => {
    expect(max([1, 2, 42, 3, 4, 5])).toBe(42);
  });

  it(`works for all-negative arrays`, () => {
    expect(max([-10, -3, -7])).toBe(-3);
  });
});

describe(`mean`, () => {
  it(`returns undefined for an empty array`, () => {
    expect(mean([])).toBeUndefined();
  });

  it(`returns arithmetic mean`, () => {
    expect(mean([1, 2, 3, 4])).toBe(2.5);
    expect(mean([10])).toBe(10);
  });
});

describe(`sum`, () => {
  it(`returns undefined for an empty array`, () => {
    expect(sum([])).toBeUndefined();
  });

  it(`returns the sum of elements`, () => {
    expect(sum([1, 2, 3])).toBe(6);
    expect(sum([10, -10, 10])).toBe(10);
    expect(sum([0, 0, 0])).toBe(0);
  });

  it(`returns the single element for one-item array`, () => {
    expect(sum([5])).toBe(5);
    expect(sum([-5])).toBe(-5);
  });

  it(`handles floating point numbers`, () => {
    expect(sum([1.5, 2.5, 3.5])).toBe(7.5);
  });
});
