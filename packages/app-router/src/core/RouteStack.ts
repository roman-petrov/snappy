import type { RouterPageState } from "@snappy/router";

export type OverlayPane = { pattern: string; state: RouterPageState };

export type RouteLayer = `cover` | `flip`;

export type RouteLayerOf = (pattern: string) => RouteLayer | undefined;

type StageInput = {
  current: RouterPageState | undefined;
  layerOf?: RouteLayerOf;
  parent: (pattern: string) => string;
  path: string;
  pattern: string;
  preserved?: RouterPageState;
  stateAt: (pathname: string) => RouterPageState | undefined;
};

const stage = ({ current, layerOf, parent, path, pattern, preserved: previous, stateAt }: StageInput) => {
  const layer = layerOf?.(pattern);
  const preserved = layer === `flip` ? undefined : layer === undefined && current !== undefined ? current : previous;
  const idle = layer === undefined ? undefined : layer === `cover` ? preserved : current;

  if (layer !== `cover`) {
    return { idle, panes: [], preserved };
  }

  const coverPatterns = (stack: string): string[] => {
    if (layerOf?.(stack) !== `cover`) {
      return [];
    }

    const ancestor = parent(stack);
    const root = ancestor === stack || ancestor === `/` || layerOf(ancestor) !== `cover`;

    return root ? [stack] : [...coverPatterns(ancestor), stack];
  };

  const parts = path === `/` ? [] : path.replace(/^\//u, ``).split(`/`);

  const items = coverPatterns(pattern).flatMap(stackPattern => {
    const pathname = stackPattern.includes(`:`)
      ? path
      : stackPattern === `/`
        ? `/`
        : `/${parts.slice(0, stackPattern.split(`/`).length).join(`/`)}`;

    const state = stackPattern === pattern && current !== undefined ? current : stateAt(pathname);

    return state === undefined ? [] : [{ pattern: stackPattern, state }];
  });

  return { idle, panes: items, preserved };
};

export const RouteStack = { stage };
