type RouteAt = (pathname: string) => unknown;

const base = (root: string) => (root === `/` ? `` : root.endsWith(`/`) ? root.slice(0, -1) : root);

const fromClick = (event: MouseEvent, prefix: string, routeAt: RouteAt) => {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.altKey ||
    event.ctrlKey ||
    event.shiftKey
  ) {
    return undefined;
  }

  const anchor = event.target instanceof Element ? event.target.closest(`a`) : undefined;
  if (!(anchor instanceof HTMLAnchorElement)) {
    return undefined;
  }

  const raw = anchor.getAttribute(`href`);
  if (raw === null || raw === `` || raw.startsWith(`#`) || raw.startsWith(`mailto:`) || raw.startsWith(`tel:`)) {
    return undefined;
  }
  if (anchor.hasAttribute(`download`) || (anchor.target !== `` && anchor.target !== `_self`)) {
    return undefined;
  }

  const { origin, pathname: hrefPath, search } = new URL(anchor.href, window.location.href);
  if (origin !== window.location.origin) {
    return undefined;
  }

  const internal =
    prefix === ``
      ? hrefPath === ``
        ? `/`
        : hrefPath
      : hrefPath === prefix || hrefPath.startsWith(`${prefix}/`)
        ? hrefPath.slice(prefix.length) || `/`
        : hrefPath;
  if (routeAt(internal) === undefined) {
    return undefined;
  }

  return `${internal}${search}`;
};

export const AnchorNavigation = { base, fromClick };
