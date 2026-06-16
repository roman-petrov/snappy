import type { RouterPageState } from "@snappy/router";

import { describe, expect, it } from "vitest";

import { RouteOverlay } from "./RouteOverlay";

describe(`stage`, () => {
  it(`builds a nested overlay stack with active top pane`, () => {
    const result = RouteOverlay.stage({
      current: { page: () => undefined, params: { id: `c` } },
      layerOf: () => `cover`,
      parent: p => (p === `a/b/c` ? `a/b` : p === `a/b` ? `a` : `/`),
      path: `/a/b/c`,
      pattern: `a/b/c`,
      stateAt: () => ({ page: () => undefined, params: {} }),
    });

    expect(result.panes.map(pane => pane.pattern)).toStrictEqual([`a`, `a/b`, `a/b/c`]);
    expect(result.panes.map(pane => pane.active)).toStrictEqual([false, false, true]);
    expect(result.panes.map(pane => pane.stacked)).toStrictEqual([false, false, true]);
    expect(result.open).toBe(true);
  });

  it(`resolves static ancestor paths`, () => {
    const requested: string[] = [];

    RouteOverlay.stage({
      current: { page: () => undefined, params: {} },
      layerOf: () => `cover`,
      parent: p => (p === `a/b/c` ? `a/b` : p === `a/b` ? `a` : `/`),
      path: `/a/b/c`,
      pattern: `a/b/c`,
      stateAt: pathname => {
        requested.push(pathname);

        return { page: () => undefined, params: {} };
      },
    });

    expect(requested).toStrictEqual([`/a`, `/a/b`]);
  });

  it(`keeps the current path for dynamic patterns`, () => {
    const result = RouteOverlay.stage({
      current: { page: () => undefined, params: {} },
      layerOf: p => (p === `x/:id` ? `cover` : undefined),
      parent: () => `list`,
      path: `/x/1`,
      pattern: `x/:id`,
      stateAt: () => ({ page: () => undefined, params: {} }),
    });

    expect(result.panes.map(pane => pane.pattern)).toStrictEqual([`x/:id`]);
    expect(result.panes[0]?.active).toBe(true);
    expect(result.panes[0]?.stacked).toBe(false);
  });

  it(`stops at the overlay root`, () => {
    expect(
      RouteOverlay.stage({
        current: { page: () => undefined, params: {} },
        layerOf: () => `cover`,
        parent: () => `/`,
        path: `/a`,
        pattern: `a`,
        stateAt: () => ({ page: () => undefined, params: {} }),
      }).panes.map(pane => pane.pattern),
    ).toStrictEqual([`a`]);
  });

  it(`returns empty panes on track layer`, () => {
    const result = RouteOverlay.stage({
      current: { page: () => undefined, params: { id: `feed` } },
      layerOf: () => undefined,
      parent: () => `/`,
      path: `/feed`,
      pattern: `feed`,
      stateAt: () => ({ page: () => undefined, params: {} }),
    });

    expect(result.panes).toStrictEqual([]);
    expect(result.open).toBe(false);
    expect(result.idle).toBeUndefined();
  });

  it(`preserves track page and exposes it as idle under cover`, () => {
    const idle: RouterPageState = { page: () => undefined, params: { id: `feed` } };

    const preserved = RouteOverlay.stage({
      current: idle,
      layerOf: p => (p === `feed` ? undefined : `cover`),
      parent: () => `/`,
      path: `/feed`,
      pattern: `feed`,
      stateAt: () => ({ page: () => undefined, params: {} }),
    });

    expect(preserved.preserved).toBe(idle);
    expect(
      RouteOverlay.stage({
        current: { page: () => undefined, params: { id: `settings` } },
        layerOf: () => `cover`,
        parent: p => (p === `a/b/c` ? `a/b` : p === `a/b` ? `a` : `/`),
        path: `/a/b/c`,
        pattern: `a/b/c`,
        preserved: preserved.preserved,
        stateAt: () => ({ page: () => undefined, params: {} }),
      }).idle,
    ).toBe(idle);
  });

  it(`clears preserved page on flip`, () => {
    const login: RouterPageState = { page: () => undefined, params: { id: `login` } };

    const flip = RouteOverlay.stage({
      current: login,
      layerOf: p => (p === `login` ? `flip` : undefined),
      parent: () => `/`,
      path: `/login`,
      pattern: `login`,
      preserved: { page: () => undefined, params: { id: `feed` } },
      stateAt: () => ({ page: () => undefined, params: {} }),
    });

    expect(flip.preserved).toBeUndefined();
    expect(flip.idle).toBe(login);
    expect(flip.panes).toStrictEqual([]);
  });
});
