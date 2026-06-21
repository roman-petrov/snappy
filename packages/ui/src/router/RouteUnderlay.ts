import type { RouteLayer } from "./RouteOverlay";

export type RouteUnderlay = { contentDimmed: boolean; exiting: boolean; shellPassive: boolean };

const entering = (scope?: string) => scope === `overlay-forward` || scope === `overlay-push`;
const exiting = (scope?: string) => scope === `overlay-back` || scope === `overlay-pop`;

const stage = (layer: RouteLayer | undefined, scope?: string): RouteUnderlay => ({
  contentDimmed: (layer === `cover` && !entering(scope)) || exiting(scope),
  exiting: exiting(scope),
  shellPassive: layer === `cover` || scope !== undefined,
});

export const RouteUnderlay = { stage };
