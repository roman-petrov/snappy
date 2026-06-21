/* eslint-disable functional/no-loop-statements */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
import { Dom } from "@snappy/browser";
import { _, type ReadonlyStore, Store } from "@snappy/core";

import type {
  HrefFrom,
  IndexTarget,
  PathsFrom,
  RouterBundle,
  RouterConfig,
  RouterInit,
  RouterRuntime,
  RouterRuntimeCurrent,
  RouterShell,
  RouterShellConfig,
  RoutesInput,
  TransitionCommit,
  TransitionFn,
} from "./RouterTypes";
import type { Go, GoOptions, Page, PageProps, RouterContextValue, RouterPageState } from "./Types";

type Compiled<I extends RoutesInput<I>> = {
  href: HrefFrom<PathsFrom<I>>;
  pages: Record<string, Page>;
  parents: Record<string, string>;
};

type Edge = { from: string; history: `push` | `replace`; to: string };

type HrefNode = ((parameters: PageProps) => string) | string | { readonly [key: string]: HrefNode };

type Location = { pathname: string; search: string };

type Match = { page: Page; params: PageProps; pattern: string };

type NavJob = { options: GoOptions & { pop?: boolean; syntheticBack?: boolean }; target: string };

type RouteLeaf = { page: Page; path: string };

type RouteNode = RouteLeaf | { readonly [key: string]: RouteNode };

type RuntimeState = {
  $context?: ReadonlyStore<RouterContextValue>;
  $location?: ReturnType<typeof Store<Location>>;
  $page?: ReadonlyStore<RouterPageState | undefined>;
  base: string;
  lastInit?: RouterInit;
  pending?: NavJob;
  ssr: boolean;
  stack: readonly Edge[];
  tail: Promise<void>;
  transition?: TransitionFn;
  unsubscribe?: () => void;
};

const home = `/` as const;
const parameter = /:(?<name>\w+)/gu;
const emptyRuntimeState = (): RuntimeState => ({ base: ``, ssr: false, stack: [], tail: Promise.resolve() });
const basePrefix = (base: string) => (base === `` || base === `/` ? `` : base.endsWith(`/`) ? base.slice(0, -1) : base);

const stripBase = (base: string, pathname: string) => {
  const pre = basePrefix(base);
  if (pre === ``) {
    return pathname === `` ? home : pathname;
  }
  if (pathname === pre || pathname.startsWith(`${pre}/`)) {
    const rest = pathname.slice(pre.length);

    return rest === `` ? home : rest;
  }

  return pathname;
};

const withBase = (base: string, path: string) => {
  const pre = basePrefix(base);
  const normalized = path.startsWith(`/`) ? path : `/${path}`;

  return pre === `` ? normalized : `${pre}${normalized}`;
};

const read = (base: string, frozen?: string): Location => {
  if (frozen !== undefined) {
    const url = new URL(frozen, `http://local`);

    return { pathname: url.pathname, search: url.search };
  }

  return { pathname: stripBase(base, window.location.pathname), search: window.location.search };
};

const isRouteLeaf = (value: RouteNode): value is RouteLeaf =>
  `path` in value && `page` in value && _.isString(value.path) && _.isFunction(value.page);

const hrefFor = (raw: string): HrefNode =>
  raw.includes(`:`)
    ? (parameters: PageProps) =>
        `/${raw}`.replaceAll(parameter, (_match, _capture, _offset, _string, groups: { name: string }) =>
          encodeURIComponent(parameters[groups.name] ?? ``),
        )
    : `/${raw}`;

const parentPattern = (pattern: string, patterns: readonly string[]): string => {
  if (pattern === home || !pattern.includes(`/`)) {
    return home;
  }

  const parent = pattern.slice(0, pattern.lastIndexOf(`/`));

  return patterns.includes(parent) ? parent : parentPattern(parent, patterns);
};

const pageParents = (pages: Record<string, Page>) => {
  const patterns = _.keys(pages);

  return _.fromEntries(patterns.map(pattern => [pattern, parentPattern(pattern, patterns)]));
};

const compileNode = (
  node: RouteNode,
): { href: HrefNode; pages: Record<string, Page>; parents: Record<string, string> } => {
  if (isRouteLeaf(node)) {
    const pages = { [node.path]: node.page };

    return { href: hrefFor(node.path), pages, parents: pageParents(pages) };
  }

  const children = _.entries(node).map(([key, value]) => [key, compileNode(value)] as const);
  const pages = _.fromEntries(children.flatMap(([, child]) => _.entries(child.pages)));

  return { href: _.fromEntries(children.map(([key, child]) => [key, child.href])), pages, parents: pageParents(pages) };
};

const parameters = (pattern: string, path: string): PageProps | undefined => {
  const parts = pattern.split(`/`);
  const segments = path.split(`/`);
  if (parts.length !== segments.length) {
    return undefined;
  }

  if (
    parts.some((part, index) => {
      const segment = segments[index];

      return segment === undefined || (!part.startsWith(`:`) && part !== segment);
    })
  ) {
    return undefined;
  }

  return _.fromEntries(
    parts.flatMap((part, index) => {
      if (!part.startsWith(`:`)) {
        return [];
      }

      const segment = segments[index];

      return segment === undefined ? [] : [[part.slice(1), decodeURIComponent(segment).trim()]];
    }),
  );
};

const match = (pages: Record<string, Page>, pathname: string): Match | undefined => {
  const path = pathname === home ? `` : pathname.startsWith(`/`) ? pathname.slice(1) : pathname;
  if (path === ``) {
    return undefined;
  }

  const exact = pages[path];
  if (exact !== undefined) {
    return { page: exact, params: {}, pattern: path };
  }

  return _.entries(pages)
    .map(([pattern, page]) => {
      if (!pattern.includes(`:`)) {
        return undefined;
      }

      const routeParameters = parameters(pattern, path);

      return routeParameters === undefined ? undefined : { page, params: routeParameters, pattern };
    })
    .filter((candidate): candidate is Match => candidate !== undefined)
    .toSorted((left, right) => right.pattern.length - left.pattern.length)[0];
};

const routePattern = (pages: Record<string, Page>, pathname: string) =>
  pathname === home ? home : (match(pages, pathname)?.pattern ?? pathname);

const routeTarget = (pathname: string, pages: Record<string, Page>, index?: IndexTarget) => {
  const route = match(pages, pathname);

  return { matched: pathname === home ? index : route?.page, params: route?.params ?? {}, route };
};

const nextRedirect = (pathname: string, pages: Record<string, Page>, index?: IndexTarget) => {
  const { matched, route } = routeTarget(pathname, pages, index);

  return pathname !== home && route === undefined
    ? home
    : matched !== undefined && _.isObject(matched) && `redirectTo` in matched
      ? matched.redirectTo
      : undefined;
};

const followRedirects = (pathname: string, pages: Record<string, Page>, index?: IndexTarget): string | undefined => {
  let current = pathname;

  for (let step = 0; step < 32; step += 1) {
    const redirect = nextRedirect(current, pages, index);
    if (redirect === undefined) {
      return current;
    }

    current = redirect;
  }

  return undefined;
};

const resolvePageState = (
  location: Location,
  pages: Record<string, Page>,
  index?: IndexTarget,
): RouterPageState | undefined => {
  const pathname = followRedirects(location.pathname, pages, index);
  if (pathname === undefined) {
    return undefined;
  }

  const { matched, params } = routeTarget(pathname, pages, index);

  return _.isFunction(matched) ? { page: matched, params } : undefined;
};

const stackOnCommit = (stackAfter: readonly Edge[], from: string, to: string, history: `push` | `replace`): Edge[] =>
  history === `push`
    ? [...stackAfter, { from, history: `push`, to }]
    : stackAfter.length === 0
      ? [{ from, history: `replace`, to }]
      : [...stackAfter.slice(0, -1), { from, history: `replace`, to }];

const writeHistory = (url: string, mode: `push` | `replace`) => {
  if (mode === `push`) {
    window.history.pushState(undefined, ``, url);
  } else {
    window.history.replaceState(undefined, ``, url);
  }
};

const createRuntime = ({
  index,
  pageParents: parents,
  pages,
}: {
  index?: IndexTarget;
  pageParents: Record<string, string>;
  pages: Record<string, Page>;
}): RouterRuntime => {
  let state = emptyRuntimeState();

  const patch = (update: Partial<RuntimeState>) => {
    state = { ...state, ...update };
  };

  const syncLocation = () => {
    if (state.$location === undefined) {
      return;
    }

    if (state.ssr) {
      state.$location.set(read(state.base));

      return;
    }

    const current = read(state.base);
    const pathname = followRedirects(current.pathname, pages, index);

    if (pathname !== undefined && pathname !== current.pathname) {
      writeHistory(withBase(state.base, pathname), `replace`);
    }

    state.$location.set(read(state.base));
  };

  const navigate = async (
    from: string,
    to: string,
    { instant = false, pop = false, replace = false, syntheticBack = false }: NavJob[`options`],
    url?: string,
  ) => {
    if (from === to) {
      return;
    }

    if (instant) {
      if (url !== undefined) {
        writeHistory(url, `replace`);
      }
      patch({ stack: [] });
      syncLocation();

      return;
    }

    if (replace && !syntheticBack && !pop) {
      if (url !== undefined) {
        writeHistory(url, `replace`);
      }
      syncLocation();

      return;
    }

    const top = state.stack.at(-1);
    const back = pop || syntheticBack || (from === top?.to && to === top.from);
    const stackAfter = back && from === top?.to && to === top.from ? state.stack.slice(0, -1) : state.stack;

    const commit: TransitionCommit = (history = `push`) => {
      if (back) {
        if (url !== undefined) {
          writeHistory(url, `replace`);
        }
        patch({ stack: stackAfter });
        syncLocation();

        return;
      }

      if (url === undefined) {
        syncLocation();

        return;
      }

      writeHistory(url, history);
      patch({ stack: stackOnCommit(stackAfter, from, to, history) });
      syncLocation();
    };

    if (state.transition === undefined) {
      commit();

      return;
    }

    await state.transition({ back, commit, from, to });
  };

  const execNav = async (target: string, options: NavJob[`options`] = {}) => {
    const url = withBase(state.base, target);
    const nextPath = stripBase(state.base, new URL(url, `http://local`).pathname);
    const from = routePattern(pages, state.$location?.().pathname ?? home);
    const to = routePattern(pages, nextPath);

    await navigate(from, to, options, url);
  };

  const drainPending = async (): Promise<void> => {
    const job = state.pending;
    if (job === undefined) {
      return;
    }

    patch({ pending: undefined });
    await execNav(job.target, job.options);
    await drainPending();
  };

  const goPath = async (target: string, options: NavJob[`options`] = {}) => {
    if (state.ssr) {
      return;
    }

    patch({ pending: { options, target }, tail: state.tail.then(drainPending) });
    await state.tail;
  };

  const go: Go = async (to, options) => {
    if (_.isNumber(to)) {
      if (to < 0 && !state.ssr) {
        if (navigation.canGoBack) {
          window.history.back();
        } else {
          const current = routePattern(pages, state.$location?.().pathname ?? home);
          const parent = parents[current] ?? home;
          const target = parent === current ? undefined : parent === home ? home : `/${parent}`;

          if (target !== undefined) {
            await goPath(target, { syntheticBack: true });
          }
        }
      }

      return;
    }

    await goPath(to, options);
  };

  const value = (location: Location): RouterContextValue => ({
    go,
    href: target => withBase(state.base, target),
    path: location.pathname,
    query: new URLSearchParams(location.search),
  });

  const current = (): RouterRuntimeCurrent => {
    if (state.$context === undefined || state.$page === undefined) {
      throw new Error(`Router is missing`);
    }

    return { $context: state.$context, $page: state.$page };
  };

  const dispose = () => {
    state.unsubscribe?.();
    state = emptyRuntimeState();
  };

  const init = ({ base: inputBase = ``, path, ssr: inputSsr = false, transition }: RouterInit): void => {
    if (
      state.lastInit?.base === inputBase &&
      state.lastInit.path === path &&
      state.lastInit.ssr === inputSsr &&
      state.lastInit.transition === transition
    ) {
      return;
    }

    dispose();

    const $location = Store(read(inputBase, path));

    patch({
      $context: $location.map(value),
      $location,
      $page: $location.map(location => resolvePageState(location, pages, index)),
      base: inputBase,
      lastInit: { base: inputBase, path, ssr: inputSsr, transition },
      ssr: inputSsr,
      transition,
    });

    if (inputSsr) {
      return;
    }

    syncLocation();

    patch({
      unsubscribe: Dom.subscribe(
        window,
        `popstate`,
        () => {
          void (async () => {
            if (state.$location === undefined) {
              return;
            }

            const from = routePattern(pages, state.$location().pathname);
            const to = routePattern(pages, read(state.base).pathname);

            if (from === to) {
              syncLocation();

              return;
            }

            await navigate(from, to, { pop: true });
          })();
        },
        { capture: true },
      ),
    });
  };

  return {
    current,
    dispose,
    init,
    parent: pattern => parents[pattern] ?? home,
    pattern: pathname => routePattern(pages, pathname),
    stateAt: pathname => resolvePageState({ pathname, search: `` }, pages, index),
  };
};

const compile = <const I extends RoutesInput<I>>(node: I): Compiled<I> => compileNode(node) as Compiled<I>;

export const RouterSsr = (config: RouterShellConfig): RouterShell => {
  const runtime = createRuntime({ index: undefined, pageParents: {}, pages: {} });
  runtime.init({ base: config.base, path: config.path, ssr: true });

  return { $: { home }, router: runtime };
};

export const Router = <const I extends RoutesInput<I>>(config: RouterConfig<I>): RouterBundle<PathsFrom<I>> => {
  const { href, pages, parents } = compile(config.routes);

  const index = _.isFunction(config.start.index)
    ? config.start.index
    : { redirectTo: config.start.index.redirect(href) };

  return {
    ...href,
    $: { home, index, publicPaths: config.start.public(href), signInPath: config.start.signIn(href) },
    router: createRuntime({ index, pageParents: parents, pages }),
  };
};

export type Router = typeof Router;
