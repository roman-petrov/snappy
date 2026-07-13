import type { NavigationEdge, RouterPageState } from "@snappy/router";

import { describe, expect, it } from "vitest";

import { RouteStack } from "./RouteStack";

const { stage, tabIndex, tabRoot } = RouteStack;
const tabs = new Set([`/`, `tab-a`, `tab-b`]);
const flips = new Set([`flip/a`]);

const layerOf = (pattern: string) =>
  tabs.has(pattern) ? undefined : flips.has(pattern) ? (`flip` as const) : (`cover` as const);

const patterns = new Set([
  `/`,
  `cover/a`,
  `cover/b`,
  `entry/:key/leaf`,
  `entry/:key`,
  `flip/a`,
  `tab-a`,
  `tab-b/group/page`,
  `tab-b/section/detail`,
  `tab-b/section`,
  `tab-b`,
]);

const parent = (pattern: string): string => {
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

const state = (id: string): RouterPageState => ({ page: () => id, params: {} });

const pages: Record<string, RouterPageState> = {
  "/": state(`tab-root`),
  "/cover/a": state(`cover-a`),
  "/cover/b": state(`cover-b`),
  "/sample/x": state(`entry-mid`),
  "/sample/x/leaf": state(`entry-deep`),
  "/slot/y": state(`cover-flat`),
  "/tab-a": state(`tab-a`),
  "/tab-b": state(`tab-b`),
  "/tab-b/group/page": state(`cover-shallow`),
  "/tab-b/section": state(`cover-mid`),
  "/tab-b/section/detail": state(`cover-deep`),
};

const pathnamePattern: Record<string, string> = {
  "/": `/`,
  "/cover/a": `cover/a`,
  "/cover/b": `cover/b`,
  "/sample/x": `entry/:key`,
  "/sample/x/leaf": `entry/:key/leaf`,
  "/slot/y": `entry/:key`,
  "/tab-a": `tab-a`,
  "/tab-b": `tab-b`,
  "/tab-b/group/page": `tab-b/group/page`,
  "/tab-b/section": `tab-b/section`,
  "/tab-b/section/detail": `tab-b/section/detail`,
};

const stateAt = (pathname: string) => pages[pathname];
const patternAt = (pathname: string) => pathnamePattern[pathname] ?? pathname.replace(/^\//u, ``);

type CoverInput = Omit<Parameters<typeof stage>[0], `layerOf` | `parent` | `patternAt` | `stack` | `stateAt`> & {
  patternAt?: (pathname: string) => string;
  stack?: readonly NavigationEdge[];
  stateAt?: (pathname: string) => RouterPageState | undefined;
};

const cover = (input: CoverInput) =>
  stage({
    ...input,
    layerOf,
    parent,
    patternAt: input.patternAt ?? patternAt,
    stack: input.stack ?? [],
    stateAt: input.stateAt ?? stateAt,
  });

const edge = (from: string, to: string): NavigationEdge => ({ from, history: `push`, to });

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
      const current = state(`flip-a`);
      const result = cover({ current, path: `/flip/a`, pattern: `flip/a`, preserved: pages[`/tab-a`] });

      expect(result.preserved).toBeUndefined();
      expect(result.idle).toBe(current);
      expect(result.panes).toStrictEqual([]);
    });
  });

  describe(`flat cover`, () => {
    it(`uses root tab idle when opened from another tab`, () => {
      const result = cover({
        current: pages[`/slot/y`],
        path: `/slot/y`,
        pattern: `entry/:key`,
        preserved: pages[`/tab-a`],
        stack: [edge(`tab-a`, `entry/:key`)],
      });

      expect(result.idle).toBe(pages[`/`]);
      expect(result.preserved).toBe(pages[`/`]);
      expect(result.panes).toStrictEqual([{ pattern: `entry/:key`, state: pages[`/slot/y`] }]);
    });
  });

  describe(`prefixed covers`, () => {
    it(`uses owning tab idle for a shallow cover`, () => {
      const result = cover({
        current: pages[`/tab-b/group/page`],
        path: `/tab-b/group/page`,
        pattern: `tab-b/group/page`,
        preserved: pages[`/tab-a`],
        stack: [edge(`tab-a`, `tab-b/group/page`)],
      });

      expect(result.idle).toBe(pages[`/tab-b`]);
      expect(result.preserved).toBe(pages[`/tab-b`]);
      expect(result.panes).toStrictEqual([{ pattern: `tab-b/group/page`, state: pages[`/tab-b/group/page`] }]);
    });

    it(`builds a two-pane stack for nested covers`, () => {
      const tab = pages[`/tab-b`];

      const result = cover({
        current: pages[`/tab-b/section/detail`],
        path: `/tab-b/section/detail`,
        pattern: `tab-b/section/detail`,
        preserved: tab,
        stack: [edge(`tab-b`, `tab-b/section`), edge(`tab-b/section`, `tab-b/section/detail`)],
      });

      expect(result.idle).toBe(tab);
      expect(result.preserved).toBe(tab);
      expect(result.panes).toStrictEqual([
        { pattern: `tab-b/section`, state: pages[`/tab-b/section`] },
        { pattern: `tab-b/section/detail`, state: pages[`/tab-b/section/detail`] },
      ]);
    });

    it(`omits skipped ancestor covers when opened directly`, () => {
      const result = cover({
        current: pages[`/tab-b/section/detail`],
        path: `/tab-b/section/detail`,
        pattern: `tab-b/section/detail`,
        preserved: pages[`/tab-a`],
        stack: [edge(`tab-a`, `tab-b/section/detail`)],
      });

      expect(result.panes).toStrictEqual([{ pattern: `tab-b/section/detail`, state: pages[`/tab-b/section/detail`] }]);
    });

    it(`builds a two-pane stack for parameterized nested covers`, () => {
      const result = cover({
        current: pages[`/sample/x/leaf`],
        path: `/sample/x/leaf`,
        pattern: `entry/:key/leaf`,
        preserved: pages[`/`],
        stack: [edge(`/`, `entry/:key`), edge(`entry/:key`, `entry/:key/leaf`)],
      });

      expect(result.idle).toBe(pages[`/`]);
      expect(result.panes).toStrictEqual([
        { pattern: `entry/:key`, state: pages[`/sample/x`] },
        { pattern: `entry/:key/leaf`, state: pages[`/sample/x/leaf`] },
      ]);
    });
  });

  describe(`pane state resolution`, () => {
    it(`uses current for the active pane and stateAt for ancestors`, () => {
      const current = state(`active`);
      const mid = pages[`/tab-b/section`];

      const result = cover({
        current,
        path: `/tab-b/section/detail`,
        pattern: `tab-b/section/detail`,
        preserved: pages[`/tab-b`],
        stack: [edge(`tab-b`, `tab-b/section`), edge(`tab-b/section`, `tab-b/section/detail`)],
      });

      expect(result.panes).toStrictEqual([
        { pattern: `tab-b/section`, state: mid },
        { pattern: `tab-b/section/detail`, state: current },
      ]);
    });

    it(`omits panes when ancestor state is missing`, () => {
      const result = cover({
        current: pages[`/tab-b/section/detail`],
        path: `/tab-b/section/detail`,
        pattern: `tab-b/section/detail`,
        preserved: pages[`/tab-b`],
        stack: [edge(`tab-b/section`, `tab-b/section/detail`)],
        stateAt: pathname => (pathname === `/tab-b/section` ? undefined : stateAt(pathname)),
      });

      expect(result.panes).toStrictEqual([{ pattern: `tab-b/section/detail`, state: pages[`/tab-b/section/detail`] }]);
    });
  });

  describe(`sibling covers`, () => {
    it(`resolves ancestor pane state from canonical path`, () => {
      const result = cover({
        current: pages[`/cover/b`],
        path: `/cover/b`,
        pattern: `cover/b`,
        stack: [edge(`cover/a`, `cover/b`)],
      });

      expect(result.panes).toStrictEqual([
        { pattern: `cover/a`, state: pages[`/cover/a`] },
        { pattern: `cover/b`, state: pages[`/cover/b`] },
      ]);
    });
  });

  describe(`tab-root fallback`, () => {
    it(`falls back to previous preserved when tab-root state is missing`, () => {
      const previous = pages[`/tab-a`];

      const result = cover({
        current: pages[`/slot/y`],
        path: `/slot/y`,
        pattern: `entry/:key`,
        preserved: previous,
        stack: [edge(`tab-a`, `entry/:key`)],
        stateAt: () => undefined,
      });

      expect(result.idle).toBe(previous);
      expect(result.preserved).toBe(previous);
    });

    it(`falls back to current when tab-root and previous are missing`, () => {
      const current = pages[`/slot/y`];

      const result = cover({
        current,
        path: `/slot/y`,
        pattern: `entry/:key`,
        stack: [edge(`/`, `entry/:key`)],
        stateAt: () => undefined,
      });

      expect(result.idle).toBe(current);
      expect(result.preserved).toBe(current);
    });
  });
});

describe(`tabIndex`, () => {
  const trackAt = (pattern: string) => {
    if (pattern === `/`) {
      return 0;
    }

    if (pattern === `tab-a`) {
      return 1;
    }

    if (pattern === `tab-b`) {
      return 2;
    }

    return undefined;
  };

  it(`returns tab index from a direct cover open`, () => {
    expect(tabIndex(`tab-b/group/page`, [edge(`tab-a`, `tab-b/group/page`)], trackAt)).toBe(1);
  });

  it(`walks through nested covers to the tab`, () => {
    expect(
      tabIndex(
        `tab-b/section/detail`,
        [edge(`tab-b`, `tab-b/section`), edge(`tab-b/section`, `tab-b/section/detail`)],
        trackAt,
      ),
    ).toBe(2);
  });

  it(`returns undefined when stack is empty`, () => {
    expect(tabIndex(`tab-b/group/page`, [], trackAt)).toBeUndefined();
  });
});

describe(`tabRoot`, () => {
  it(`resolves the owning tab for a nested cover`, () => {
    expect(tabRoot(`tab-b/section/detail`, layerOf, parent)).toBe(`tab-b`);
  });

  it(`returns the tab pattern unchanged`, () => {
    expect(tabRoot(`tab-a`, layerOf, parent)).toBe(`tab-a`);
  });
});
