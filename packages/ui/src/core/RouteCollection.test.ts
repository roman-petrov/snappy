/* eslint-disable vitest/expect-expect */
import { describe, expect, expectTypeOf, it } from "vitest";

import { RouteCollection } from "./RouteCollection";

const routes = RouteCollection({
  duo: `alpha/:first/beta/:second`,
  entry: `entry/:id`,
  group: { leaf: `group/leaf`, root: `group` },
  list: `items`,
} as const);

type Check<T extends true> = T;

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

void (true as Check<Equal<typeof routes.home, `/`>>);
void (true as Check<Equal<typeof routes.list, string>>);
void (true as Check<Equal<typeof routes.group.root, string>>);
void (true as Check<typeof routes.entry extends (p: { id: string }) => string ? true : false>);
void (true as Check<typeof routes.duo extends (p: { first: string; second: string }) => string ? true : false>);

describe(`RouteCollection`, () => {
  it(`exposes home and raw segment tree`, () => {
    expect(routes.home).toBe(`/`);
    expect(routes.$).toStrictEqual({
      duo: `alpha/:first/beta/:second`,
      entry: `entry/:id`,
      group: { leaf: `group/leaf`, root: `group` },
      list: `items`,
    });
  });

  it(`builds flat paths`, () => {
    expect(routes.list).toBe(`/items`);
  });

  it(`builds nested paths`, () => {
    expect(routes.group.root).toBe(`/group`);
    expect(routes.group.leaf).toBe(`/group/leaf`);
  });

  it(`builds dynamic paths with encoded parameters`, () => {
    expect(routes.entry({ id: `x/y` })).toBe(`/entry/x%2Fy`);
    expect(routes.duo({ first: `1`, second: `2/3` })).toBe(`/alpha/1/beta/2%2F3`);
  });

  describe(`types`, () => {
    it(`infers static and nested paths`, () => {
      expectTypeOf(routes.home).toEqualTypeOf<`/`>();
      expectTypeOf(routes.list).toEqualTypeOf<string>();
      expectTypeOf(routes.group.root).toEqualTypeOf<string>();
      expectTypeOf(routes.group.leaf).toEqualTypeOf<string>();
      expectTypeOf(routes.$.list).toEqualTypeOf<`items`>();
    });

    it(`infers dynamic path parameters`, () => {
      expectTypeOf(routes.entry).toBeFunction();
      expectTypeOf(routes.entry).parameters.toEqualTypeOf<[{ id: string }]>();
      expectTypeOf(routes.duo).parameters.toEqualTypeOf<[{ first: string; second: string }]>();
      expectTypeOf(routes.entry).returns.toEqualTypeOf<string>();
      expectTypeOf(routes.list).not.toBeFunction();
    });

    it(`rejects missing dynamic parameters at compile time`, () => {
      // @ts-expect-error Property 'id' is missing
      const missing: Parameters<typeof routes.entry>[0] = {};

      expect(missing).toStrictEqual({});
    });

    it(`rejects unknown dynamic parameters at compile time`, () => {
      // @ts-expect-error Object literal may only specify known properties
      routes.entry({ extra: `b`, id: `a` });

      expect(true).toBe(true);
    });
  });
});
