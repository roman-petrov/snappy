import type { NavigationEdge, RouterPageState } from "@snappy/router";

export type OverlayPane = { pattern: string; state: RouterPageState };

export type RouteLayer = `cover` | `flip`;

export type RouteLayerOf = (pattern: string) => RouteLayer | undefined;

type StageInput = {
  current: RouterPageState | undefined;
  layerOf?: RouteLayerOf;
  parent: (pattern: string) => string;
  path: string;
  pattern: string;
  patternAt: (pathname: string) => string;
  preserved?: RouterPageState;
  stack: readonly NavigationEdge[];
  stateAt: (pathname: string) => RouterPageState | undefined;
};

const edgeTo = (cursor: string, edges: readonly NavigationEdge[]) => edges.findLast(edge => edge.to === cursor);

const stackAncestors = (
  cursor: string,
  edges: readonly NavigationEdge[],
  include: (from: string) => boolean,
): readonly string[] => {
  const edge = edgeTo(cursor, edges);

  return edge === undefined || !include(edge.from) ? [] : [...stackAncestors(edge.from, edges, include), edge.from];
};

const tabRoot = (
  routePattern: string,
  layerOf: RouteLayerOf | undefined,
  parent: (pattern: string) => string,
): string => {
  if (layerOf?.(routePattern) === undefined) {
    return routePattern;
  }

  const ancestor = parent(routePattern);

  return ancestor === routePattern ? routePattern : tabRoot(ancestor, layerOf, parent);
};

const tabIndex = (
  cursor: string,
  edges: readonly NavigationEdge[],
  trackAt: (pattern: string) => number | undefined,
): number | undefined => {
  const edge = edgeTo(cursor, edges);

  if (edge === undefined) {
    return undefined;
  }

  const slot = trackAt(edge.from);

  return slot ?? tabIndex(edge.from, edges, trackAt);
};

const coverChain = (routePattern: string, edges: readonly NavigationEdge[], layerOf?: RouteLayerOf) =>
  layerOf?.(routePattern) === `cover`
    ? [...stackAncestors(routePattern, edges, from => layerOf(from) === `cover`), routePattern]
    : [];

const pathnameAt = (routePattern: string, path: string, patternAt: (pathname: string) => string) => {
  if (routePattern === `/`) {
    return `/`;
  }

  const parts = path === `/` ? [] : path.replace(/^\//u, ``).split(`/`);
  const truncated = `/${parts.slice(0, routePattern.split(`/`).length).join(`/`)}`;

  return patternAt(truncated) === routePattern ? truncated : `/${routePattern}`;
};

const pathAt = (
  routePattern: string,
  path: string,
  stack: readonly NavigationEdge[],
  patternAt: (pathname: string) => string,
) =>
  routePattern === `/`
    ? `/`
    : (stack.findLast(edge => edge.to === routePattern)?.toPath ?? pathnameAt(routePattern, path, patternAt));

const stage = ({
  current,
  layerOf,
  parent,
  path,
  pattern,
  patternAt,
  preserved: previous,
  stack,
  stateAt,
}: StageInput) => {
  const layer = layerOf?.(pattern);
  const tabRootState = stateAt(pathAt(tabRoot(pattern, layerOf, parent), path, stack, patternAt));

  const preserved =
    layer === `flip`
      ? undefined
      : layer === undefined && current !== undefined
        ? current
        : layer === `cover`
          ? (tabRootState ?? previous ?? current)
          : previous;

  const idle = layer === undefined ? undefined : layer === `cover` ? preserved : current;

  if (layer !== `cover`) {
    return { idle, panes: [], preserved };
  }

  const panes = coverChain(pattern, stack, layerOf).flatMap(stackPattern => {
    const state =
      stackPattern === pattern && current !== undefined
        ? current
        : stateAt(pathAt(stackPattern, path, stack, patternAt));

    return state === undefined ? [] : [{ pattern: stackPattern, state }];
  });

  return { idle, panes, preserved };
};

export const RouteStack = { stage, tabIndex, tabRoot };
