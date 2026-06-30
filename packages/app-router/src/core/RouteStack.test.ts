import type { RouterPageState } from "@snappy/router";

import { describe, expect, it } from "vitest";

import { RouteStack } from "./RouteStack";

const { stage } = RouteStack;
const tabs = new Set([`/`, `module-b`, `tab-a`]);
const flips = new Set([`auth/sign-in`]);

const layerOf = (pattern: string) =>
  tabs.has(pattern) ? undefined : flips.has(pattern) ? (`flip` as const) : (`cover` as const);

const patterns = new Set([
  `/`,
  `auth/sign-in`,
  `item/:id/leaf`,
  `item/:id`,
  `module-b/group/page`,
  `module-b/section/detail`,
  `module-b/section`,
  `module-b`,
  `tab-a`,
]);

const parentPattern = (pattern: string): string => {
  if (pattern === `/` || !pattern.includes(`/`)) {
    return `/`;
  }

  let candidate = pattern.slice(0, pattern.lastIndexOf(`/`));

  while (candidate.length > 0) {
    if (patterns.has(candidate)) {
      return candidate;
    }

    candidate = candidate.slice(0, candidate.lastIndexOf(`/`));
  }

  return `/`;
};

const parent = parentPattern;
const state = (id: string): RouterPageState => ({ page: () => id, params: {} });

const pages: Record<string, RouterPageState> = {
  "/": state(`home`),
  "/entry/foo": state(`cover-mid`),
  "/entry/foo/leaf": state(`cover-deep`),
  "/item/x": state(`cover-flat`),
  "/module-b": state(`tab-module`),
  "/module-b/group/page": state(`cover-shallow`),
  "/module-b/section": state(`cover-mid`),
  "/module-b/section/detail": state(`cover-deep`),
  "/tab-a": state(`tab-a`),
};

const stateAt = (pathname: string) => pages[pathname];

type CoverInput = Omit<Parameters<typeof stage>[0], `layerOf` | `parent` | `stateAt`> & {
  stateAt?: (pathname: string) => RouterPageState | undefined;
};

const cover = (input: CoverInput) => stage({ ...input, layerOf, parent, stateAt: input.stateAt ?? stateAt });

describe(`stage`, () => {
  describe(`tab pages`, () => {
    it(`preserves current state and emits no panes`, () => {
      const current = pages[`/tab-a`];
      const result = cover({ current, path: `/tab-a`, pattern: `tab-a`, preserved: pages[`/`] });

      expect(result.preserved).toBe(current);
      expect(result.idle).toBeUndefined();
      expect(result.panes).toStrictEqual([]);
    });
  });

  describe(`flip pages`, () => {
    it(`clears preserved stack and uses current as idle`, () => {
      const current = state(`sign-in`);
      const result = cover({ current, path: `/auth/sign-in`, pattern: `auth/sign-in`, preserved: pages[`/tab-a`] });

      expect(result.preserved).toBeUndefined();
      expect(result.idle).toBe(current);
      expect(result.panes).toStrictEqual([]);
    });
  });

  describe(`flat cover (parent resolves to home tab)`, () => {
    it(`uses home tab idle when opened from another tab`, () => {
      const result = cover({
        current: pages[`/item/x`],
        path: `/item/x`,
        pattern: `item/:id`,
        preserved: pages[`/tab-a`],
      });

      expect(result.idle).toBe(pages[`/`]);
      expect(result.preserved).toBe(pages[`/`]);
      expect(result.panes).toStrictEqual([{ pattern: `item/:id`, state: pages[`/item/x`] }]);
    });
  });

  describe(`prefixed module covers`, () => {
    it(`uses module tab idle for a shallow cover`, () => {
      const result = cover({
        current: pages[`/module-b/group/page`],
        path: `/module-b/group/page`,
        pattern: `module-b/group/page`,
        preserved: pages[`/tab-a`],
      });

      expect(result.idle).toBe(pages[`/module-b`]);
      expect(result.preserved).toBe(pages[`/module-b`]);
      expect(result.panes).toStrictEqual([{ pattern: `module-b/group/page`, state: pages[`/module-b/group/page`] }]);
    });

    it(`builds a two-pane stack for nested covers`, () => {
      const tab = pages[`/module-b`];

      const result = cover({
        current: pages[`/module-b/section/detail`],
        path: `/module-b/section/detail`,
        pattern: `module-b/section/detail`,
        preserved: tab,
      });

      expect(result.idle).toBe(tab);
      expect(result.preserved).toBe(tab);
      expect(result.panes).toStrictEqual([
        { pattern: `module-b/section`, state: pages[`/module-b/section`] },
        { pattern: `module-b/section/detail`, state: pages[`/module-b/section/detail`] },
      ]);
    });

    it(`builds a two-pane stack for parameterized nested covers`, () => {
      const result = cover({
        current: pages[`/entry/foo/leaf`],
        path: `/entry/foo/leaf`,
        pattern: `item/:id/leaf`,
        preserved: pages[`/`],
      });

      expect(result.idle).toBe(pages[`/`]);
      expect(result.panes).toStrictEqual([
        { pattern: `item/:id`, state: pages[`/entry/foo`] },
        { pattern: `item/:id/leaf`, state: pages[`/entry/foo/leaf`] },
      ]);
    });
  });

  describe(`pane state resolution`, () => {
    it(`uses current for the active pane and stateAt for ancestors`, () => {
      const current = state(`active`);
      const mid = pages[`/module-b/section`];

      const result = cover({
        current,
        path: `/module-b/section/detail`,
        pattern: `module-b/section/detail`,
        preserved: pages[`/module-b`],
      });

      expect(result.panes).toStrictEqual([
        { pattern: `module-b/section`, state: mid },
        { pattern: `module-b/section/detail`, state: current },
      ]);
    });

    it(`omits panes when ancestor state is missing`, () => {
      const result = cover({
        current: pages[`/module-b/section/detail`],
        path: `/module-b/section/detail`,
        pattern: `module-b/section/detail`,
        preserved: pages[`/module-b`],
        stateAt: pathname => (pathname === `/module-b/section` ? undefined : stateAt(pathname)),
      });

      expect(result.panes).toStrictEqual([
        { pattern: `module-b/section/detail`, state: pages[`/module-b/section/detail`] },
      ]);
    });
  });

  describe(`tab-root fallback`, () => {
    it(`falls back to previous preserved when tab-root state is missing`, () => {
      const previous = pages[`/tab-a`];

      const result = cover({
        current: pages[`/item/x`],
        path: `/item/x`,
        pattern: `item/:id`,
        preserved: previous,
        stateAt: () => undefined,
      });

      expect(result.idle).toBe(previous);
      expect(result.preserved).toBe(previous);
    });

    it(`falls back to current when tab-root and previous are missing`, () => {
      const current = pages[`/item/x`];
      const result = cover({ current, path: `/item/x`, pattern: `item/:id`, stateAt: () => undefined });

      expect(result.idle).toBe(current);
      expect(result.preserved).toBe(current);
    });
  });
});
