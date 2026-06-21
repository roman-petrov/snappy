import { describe, expect, it } from "vitest";

import { TabPagerLogic } from "./TabPager.logic";

const { chromeFrame, routeIndex } = TabPagerLogic;

describe(`routeIndex`, () => {
  const items = [{ id: `a` }, { id: `b` }];

  it(`resolves active and last tab`, () => {
    expect(routeIndex(items, `b`)).toBe(1);
    expect(routeIndex(items, undefined, `b`)).toBe(1);
    expect(routeIndex(items)).toBe(0);
  });
});

describe(`chromeFrame`, () => {
  it(`highlights the active tab`, () => {
    const result = chromeFrame([`var(--color-primary)`, `var(--color-success)`], `var(--color-backdrop)`, 0);

    expect(result.chromeColor).toContain(`var(--color-primary)`);
    expect(result.indicatorTints[0]?.opacity).toBe(1);
    expect(result.indicatorTints[1]?.opacity).toBe(0);
  });

  it(`interpolates between tabs`, () => {
    const result = chromeFrame([`var(--color-primary)`, `var(--color-success)`], `var(--color-backdrop)`, 0.5);

    expect(result.indicatorTints[0]?.opacity).toBe(0.5);
    expect(result.indicatorTints[1]?.opacity).toBe(0.5);
  });
});
