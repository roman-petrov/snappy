import { describe, expect, it } from "vitest";

import { Chrome } from "./Chrome";

const { blend, opacities } = Chrome;

describe(`blend`, () => {
  const accents = [`var(--color-primary)`, `var(--color-success)`] as const;

  it(`returns the active accent`, () => {
    expect(blend(accents, 0)).toBe(`var(--color-primary)`);
    expect(blend(accents, 1)).toBe(`var(--color-success)`);
  });

  it(`interpolates between accents`, () => {
    expect(blend(accents, 0.5)).toBe(`color-mix(in srgb, var(--color-primary) 50%, var(--color-success))`);
  });

  it(`falls back to surface when no slot is active`, () => {
    expect(blend(accents, 2)).toBe(`var(--color-surface)`);
  });
});

describe(`opacities`, () => {
  it(`returns opacity per slot`, () => {
    expect(opacities(2, 0.5)).toStrictEqual([0.5, 0.5]);
  });
});
