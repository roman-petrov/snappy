import { describe, expect, it } from "vitest";

import { TabPagerLogic } from "./TabPager.logic";

const {
  axisLock,
  chrome,
  clampOffset,
  fromDrag,
  fromDragProgress,
  fromIndex,
  fromTranslate,
  routeIndex,
  settleRatio,
  shouldSettle,
  snapTarget,
  toIndex,
  toTranslate,
  velocity,
} = TabPagerLogic;

describe(`axisLock`, () => {
  it(`returns pending below threshold`, () => {
    expect(axisLock(3, 3)).toBe(`pending`);
  });

  it(`returns horizontal when dx dominates`, () => {
    expect(axisLock(10, 2)).toBe(`horizontal`);
  });

  it(`returns vertical when dy dominates`, () => {
    expect(axisLock(2, 10)).toBe(`vertical`);
  });
});

describe(`clampOffset`, () => {
  const width = 100;
  const count = 3;

  it(`allows full drag to adjacent tabs`, () => {
    expect(clampOffset(80, width, 1, count)).toBe(80);
    expect(clampOffset(-80, width, 1, count)).toBe(-80);
  });

  it(`clamps at first tab boundary`, () => {
    expect(clampOffset(50, width, 0, count)).toBe(0);
  });

  it(`clamps at last tab boundary`, () => {
    expect(clampOffset(-50, width, 2, count)).toBe(0);
  });
});

describe(`snapTarget`, () => {
  const width = 100;
  const count = 3;

  it(`snaps to previous tab past threshold`, () => {
    expect(snapTarget(1, 20, width, count)).toBe(0);
  });

  it(`snaps to next tab past threshold`, () => {
    expect(snapTarget(1, -20, width, count)).toBe(2);
  });

  it(`stays on current tab below threshold`, () => {
    expect(snapTarget(1, 10, width, count)).toBe(1);
    expect(snapTarget(1, -10, width, count)).toBe(1);
  });

  it(`respects bounds`, () => {
    expect(snapTarget(0, 60, width, count)).toBe(0);
    expect(snapTarget(2, -60, width, count)).toBe(2);
  });

  it(`uses velocity for fling`, () => {
    expect(snapTarget(1, -5, width, count, -0.08)).toBe(2);
    expect(snapTarget(1, 5, width, count, 0.08)).toBe(0);
  });
});

describe(`fromTranslate`, () => {
  it(`maps translateX to progress`, () => {
    expect(fromTranslate(0, 100, 3)).toBeCloseTo(0);
    expect(fromTranslate(-100, 100, 3)).toBe(0.5);
    expect(fromTranslate(-200, 100, 3)).toBe(1);
  });
});

describe(`toTranslate`, () => {
  it(`maps progress to translateX`, () => {
    expect(toTranslate(0, 100, 3)).toBeCloseTo(0);
    expect(toTranslate(0.5, 100, 3)).toBe(-100);
    expect(toTranslate(1, 100, 3)).toBe(-200);
  });
});

describe(`fromIndex`, () => {
  it(`maps tab index to progress`, () => {
    expect(fromIndex(0, 3)).toBe(0);
    expect(fromIndex(1, 3)).toBe(0.5);
    expect(fromIndex(2, 3)).toBe(1);
  });
});

describe(`toIndex`, () => {
  it(`maps progress to fractional tab index`, () => {
    expect(toIndex(0, 3)).toBe(0);
    expect(toIndex(0.5, 3)).toBe(1);
    expect(toIndex(1, 3)).toBe(2);
  });
});

describe(`fromDragProgress`, () => {
  it(`maps drag position to progress`, () => {
    expect(fromDragProgress(1, 0, 100, 3)).toBe(0.5);
    expect(fromDragProgress(1, 50, 100, 3)).toBeCloseTo(0.25);
  });
});

describe(`fromDrag`, () => {
  it(`maps tab position to translateX`, () => {
    expect(fromDrag(1, 0, 100, 3)).toBe(-100);
    expect(fromDrag(1, 50, 100, 3)).toBe(-50);
  });
});

describe(`roundtrip`, () => {
  it(`keeps content and progress aligned`, () => {
    const width = 320;
    const count = 3;
    const progress = 0.35;
    const x = toTranslate(progress, width, count);

    expect(fromTranslate(x, width, count)).toBeCloseTo(progress);
    expect(toIndex(fromTranslate(x, width, count), count)).toBeCloseTo(toIndex(progress, count));
  });
});

describe(`routeIndex`, () => {
  const items = [{ id: `a` }, { id: `b` }];

  it(`prefers activeId`, () => {
    expect(routeIndex(items, `b`)).toBe(1);
  });

  it(`falls back to lastId`, () => {
    expect(routeIndex(items, undefined, `b`)).toBe(1);
  });

  it(`returns zero when ids are missing`, () => {
    expect(routeIndex(items)).toBe(0);
  });
});

describe(`chrome`, () => {
  it(`derives bar index and tints`, () => {
    const result = chrome([`primary`, `success`], undefined, 0, 2);

    expect(result.barIndex).toBe(0);
    expect(result.panelTints[0]?.opacity).toBe(1);
    expect(result.panelTints[1]?.opacity).toBe(0);
  });

  it(`uses barOffset when present`, () => {
    expect(chrome([`primary`, `success`], 0.5, 0, 2).barIndex).toBe(0.5);
  });
});

describe(`velocity`, () => {
  it(`computes speed from pointer samples`, () => {
    expect(velocity({ sample: 0, time: 0, value: 0 }, 100, 100)).toStrictEqual({ sample: 100, time: 100, value: 1 });
  });

  it(`keeps previous value when dt is zero`, () => {
    expect(velocity({ sample: 0, time: 50, value: 2 }, 10, 50)).toStrictEqual({ sample: 10, time: 50, value: 2 });
  });
});

describe(`settleRatio`, () => {
  it(`ramps from zero to one`, () => {
    expect(settleRatio(0, 0)).toBe(0);
    expect(settleRatio(130, 0)).toBeCloseTo(0.5);
    expect(settleRatio(1000, 0)).toBe(1);
  });
});

describe(`shouldSettle`, () => {
  it(`skips tiny deltas`, () => {
    expect(shouldSettle(0.5, 0.5005)).toBe(false);
    expect(shouldSettle(0, 0.5)).toBe(true);
  });
});
