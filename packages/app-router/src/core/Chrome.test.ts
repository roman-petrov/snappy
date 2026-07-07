import { describe, expect, it } from "vitest";

import { Chrome } from "./Chrome";

const { active } = Chrome;

describe(`active`, () => {
  const accents = [`var(--color-primary)`, `var(--color-success)`] as const;

  it(`marks a single slot fully active`, () => {
    expect(active(accents, 0)).toStrictEqual([{ accent: `var(--color-primary)`, opacity: 1 }]);
    expect(active(accents, 1)).toStrictEqual([{ accent: `var(--color-success)`, opacity: 1 }]);
  });

  it(`splits opacity between neighbors mid-swipe`, () => {
    expect(active(accents, 0.5)).toStrictEqual([
      { accent: `var(--color-primary)`, opacity: 0.5 },
      { accent: `var(--color-success)`, opacity: 0.5 },
    ]);
  });

  it(`is empty when no slot overlaps`, () => {
    expect(active(accents, 2)).toStrictEqual([]);
  });
});
