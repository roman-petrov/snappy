import { describe, expect, it } from "vitest";

import { Tags } from "./Tags";

describe(`Tags`, () => {
  it(`resolves flat leaves`, () => {
    expect(Tags({ group: [`one`, `two`] } as const)).toStrictEqual({ group: { one: `group.one`, two: `group.two` } });
  });

  it(`resolves mixed branches`, () => {
    expect(Tags({ alpha: [`x`, `y`], beta: { gamma: [`z`] } } as const)).toStrictEqual({
      alpha: { x: `alpha.x`, y: `alpha.y` },
      beta: { gamma: { z: `beta.gamma.z` } },
    });
  });

  it(`resolves deep nesting`, () => {
    expect(Tags({ a: { b: { c: [`d`] } } } as const)).toStrictEqual({ a: { b: { c: { d: `a.b.c.d` } } } });
  });

  it(`resolves parallel nested groups`, () => {
    expect(Tags({ a: { x: [`1`] }, b: { y: [`2`] } } as const)).toStrictEqual({
      a: { x: { 1: `a.x.1` } },
      b: { y: { 2: `b.y.2` } },
    });
  });

  it(`prefixes sibling groups independently`, () => {
    expect(Tags({ left: [`item`], right: [`item`] } as const)).toStrictEqual({
      left: { item: `left.item` },
      right: { item: `right.item` },
    });
  });

  it(`preserves leaf key names in path`, () => {
    expect(Tags({ outer: [`inner-key`] } as const)).toStrictEqual({ outer: { "inner-key": `outer.inner-key` } });
  });

  it(`resolves empty leaf list`, () => {
    expect(Tags({ group: [] } as const)).toStrictEqual({ group: {} });
  });
});
