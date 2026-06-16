/* eslint-disable vitest/expect-expect */
import { describe, expect, expectTypeOf, it, type MockInstance, vi } from "vitest";

import { Router, RouterSsr } from "./index";

type TransitionInput = { back: boolean; commit: (history?: `push` | `replace`) => void; from: string; to: string };

const { navTransition, testTransition } = vi.hoisted(() => ({
  navTransition: vi.fn(async ({ commit, from, to }: TransitionInput) => {
    const lateral = new Set([`peer-a`, `peer-b`]);
    commit(lateral.has(from) && lateral.has(to) ? `replace` : undefined);
    await Promise.resolve();
  }),
  testTransition: vi.fn(async ({ commit }: TransitionInput) => {
    commit();
    await Promise.resolve();
  }),
}));

const staticPage = () => `static`;
const indexPage = () => `index`;
const singlePage = ({ id }: { id: string }) => id;
const pairPage = ({ first, second }: { first: string; second: string }) => `${first}/${second}`;
const branchPage = ({ id }: { id: string }) => `branch/${id}`;
const trimPage = ({ id }: { id: string }) => id.trim();
const testStart = { index: indexPage, public: () => [] as readonly string[], signIn: () => `/` };

const routes = Router({
  routes: {
    branch: { edit: { page: branchPage, path: `branch/:id` }, list: { page: staticPage, path: `branches` } },
    group: { leaf: { page: staticPage, path: `group/leaf` }, root: { page: staticPage, path: `group` } },
    list: { page: staticPage, path: `items` },
    pair: { page: pairPage, path: `alpha/:first/beta/:second` },
    signIn: { page: staticPage, path: `login` },
    single: { page: singlePage, path: `entry/:id` },
  },
  start: { index: indexPage, public: r => [r.signIn, r.branch.list], signIn: r => r.signIn },
});

const runtime = Router({
  routes: {
    dynamic: { page: singlePage, path: `entry/:id` },
    list: { page: staticPage, path: `items` },
    page: { page: staticPage, path: `page-a` },
  },
  start: { index: staticPage, public: r => [r.list], signIn: r => r.list },
});

const nav = Router({
  routes: {
    peerA: { page: staticPage, path: `peer-a` },
    peerB: { page: staticPage, path: `peer-b` },
    stack: { page: singlePage, path: `stack/:id` },
    zone: {
      child: { page: staticPage, path: `zone-a/child` },
      nested: { page: staticPage, path: `zone-a/child/nested` },
      root: { page: staticPage, path: `zone-a` },
    },
  },
  start: testStart,
});

const initSsr = (router: typeof runtime.router, path: string, base = ``) => {
  router.init({ base, path, ssr: true, transition: testTransition });

  return router.current();
};

const lastNavTransition = () => {
  const call = vi.mocked(navTransition).mock.calls.at(-1)?.[0];

  return { back: call?.back, from: call?.from, to: call?.to };
};

type GoSession = {
  go: ReturnType<ReturnType<typeof runtime.router.current>[`$context`]>[`go`];
  pushState: MockInstance<HistoryWrite>;
  replaceState: MockInstance<HistoryWrite>;
};

type HistoryWrite = typeof window.history.pushState;

const lastHistoryUrl = (spy: MockInstance<HistoryWrite>) => spy.mock.calls.at(-1)?.[2];

const withGo = async (pathname: string, run: (session: GoSession) => Promise<void>) => {
  vi.mocked(navTransition).mockClear();
  const pushState = vi.spyOn(window.history, `pushState`);
  const replaceState = vi.spyOn(window.history, `replaceState`);
  window.history.replaceState(undefined, ``, pathname);
  nav.router.dispose();
  nav.router.init({ base: ``, ssr: false, transition: navTransition });

  const session: GoSession = { go: nav.router.current().$context().go, pushState, replaceState };

  try {
    await run(session);
  } finally {
    nav.router.dispose();
    pushState.mockRestore();
    replaceState.mockRestore();
    vi.stubGlobal(`navigation`, undefined);
  }
};

describe(`Router`, () => {
  it(`builds href tree`, () => {
    expect(routes.$.home).toBe(`/`);
    expect(routes.list).toBe(`/items`);
    expect(routes.group.root).toBe(`/group`);
    expect(routes.group.leaf).toBe(`/group/leaf`);
    expect(routes.branch.list).toBe(`/branches`);
    expect(routes.branch.edit({ id: `abc` })).toBe(`/branch/abc`);
    expect(routes.branch.edit({ id: `x/y` })).toBe(`/branch/x%2Fy`);
    expect(routes.single({ id: `x/y` })).toBe(`/entry/x%2Fy`);
    expect(routes.pair({ first: `1`, second: `2/3` })).toBe(`/alpha/1/beta/2%2F3`);
  });

  it(`resolves start config`, () => {
    expect(routes.$.signInPath).toBe(`/login`);
    expect(routes.$.publicPaths).toStrictEqual([`/login`, `/branches`]);
    expect(routes.$.index).toBe(indexPage);
  });

  it(`builds index redirect`, () => {
    const users = Router({
      routes: { list: { page: staticPage, path: `users` } },
      start: { index: { redirect: r => r.list }, public: () => [], signIn: () => `/` },
    });

    expect(users.$.index).toStrictEqual({ redirectTo: `/users` });
  });

  describe(`types`, () => {
    it(`infers static and nested paths`, () => {
      expectTypeOf(routes.$.home).toEqualTypeOf<`/`>();
      expectTypeOf(routes.list).toEqualTypeOf<string>();
      expectTypeOf(routes.group.root).toEqualTypeOf<string>();
      expectTypeOf(routes.group.leaf).toEqualTypeOf<string>();
      expectTypeOf(routes.branch.list).toEqualTypeOf<string>();
      expectTypeOf(routes.branch).toBeObject();
      expectTypeOf(routes.branch.edit).toBeFunction();
    });

    it(`infers dynamic path parameters`, () => {
      expectTypeOf(routes.single).toBeFunction();
      expectTypeOf(routes.single).parameters.toEqualTypeOf<[{ id: string }]>();
      expectTypeOf(routes.pair).parameters.toEqualTypeOf<[{ first: string; second: string }]>();
      expectTypeOf(routes.single).returns.toEqualTypeOf<string>();
      expectTypeOf(routes.branch.edit).toBeFunction();
      expectTypeOf(routes.branch.edit).parameters.toEqualTypeOf<[{ id: string }]>();
      expectTypeOf(routes.list).not.toBeFunction();
      expectTypeOf(routes.branch.list).not.toBeFunction();
    });

    it(`rejects missing dynamic parameters`, () => {
      // @ts-expect-error Property 'id' is missing
      const missing: Parameters<typeof routes.single>[0] = {};

      expect(missing).toStrictEqual({});
    });

    it(`rejects unknown dynamic parameters`, () => {
      // @ts-expect-error Object literal may only specify known properties
      routes.single({ extra: `b`, id: `a` });
      // @ts-expect-error Object literal may only specify known properties
      routes.branch.edit({ extra: `b`, id: `a` });
      // @ts-expect-error Object literal may only specify known properties
      routes.pair({ extra: `c`, first: `a`, second: `b` });
    });

    it(`rejects typo in index redirect`, () => {
      Router({
        routes: { list: { page: staticPage, path: `users` } },
        start: {
          // @ts-expect-error — unknown href key
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- compile-time href key check
          index: { redirect: r => r.lst },
          public: () => [],
          signIn: () => `/`,
        },
      });
    });
  });
});

describe(`pages`, () => {
  describe(`types`, () => {
    it(`rejects prop-less pages on dynamic routes`, () => {
      Router({
        routes: {
          // @ts-expect-error — dynamic route expects route parameters in page props
          dynamic: { page: staticPage, path: `row/:id` },
          entry: { page: singlePage, path: `entry/:id` },
          list: { page: staticPage, path: `items` },
        },
        start: testStart,
      });
    });

    it(`rejects prop-less pages on multi-parameter routes`, () => {
      Router({
        routes: {
          list: { page: staticPage, path: `items` },
          // @ts-expect-error — dynamic route expects route parameters in page props
          pair: { page: staticPage, path: `x/:left/y/:right` },
        },
        start: testStart,
      });
    });

    it(`rejects prop-less pages on triple-parameter routes`, () => {
      Router({
        routes: {
          list: { page: staticPage, path: `items` },
          // @ts-expect-error — dynamic route expects route parameters in page props
          triple: { page: staticPage, path: `p/:a/q/:b/r/:c` },
        },
        start: testStart,
      });
    });

    it(`rejects parameterized pages on static routes`, () => {
      Router({
        routes: {
          dynamic: { page: singlePage, path: `row/:id` },
          entry: { page: singlePage, path: `entry/:id` },
          // @ts-expect-error — static route expects a prop-less page function
          list: { page: singlePage, path: `items` },
        },
        start: testStart,
      });
    });

    it(`rejects page props that do not match path parameters`, () => {
      const agentPage = ({ agentId }: { agentId: string }) => agentId;

      Router({
        routes: {
          list: { page: staticPage, path: `items` },
          // @ts-expect-error — path parameter names must match page props
          row: { page: agentPage, path: `row/:id` },
        },
        start: testStart,
      });
    });
  });
});

describe(`router`, () => {
  describe(`pattern`, () => {
    it(`maps pathname to route pattern`, () => {
      expect(runtime.router.pattern(`/`)).toBe(`/`);
      expect(runtime.router.pattern(`/items`)).toBe(`items`);
      expect(runtime.router.pattern(`/entry/42`)).toBe(`entry/:id`);
      expect(runtime.router.pattern(`/missing`)).toBe(`/missing`);
    });
  });

  describe(`page`, () => {
    it(`resolves matched route and index`, () => {
      expect(initSsr(runtime.router, `/page-a`).$page()).toStrictEqual({ page: staticPage, params: {} });
      expect(initSsr(runtime.router, `/`).$page()).toStrictEqual({ page: staticPage, params: {} });
    });

    it(`parses dynamic params`, () => {
      const trackedPage = vi.fn(({ id }: { id: string }) => id);
      const tracked = Router({ routes: { single: { page: trackedPage, path: `entry/:id` } }, start: testStart });

      expect(initSsr(tracked.router, `/entry/42`).$page()).toStrictEqual({ page: trackedPage, params: { id: `42` } });
    });

    it(`trims params and prefers longest match`, () => {
      const app = Router({
        routes: {
          edit: { page: singlePage, path: `post/:id/edit` },
          show: { page: singlePage, path: `post/:id` },
          single: { page: trimPage, path: `entry/:id` },
        },
        start: testStart,
      });

      expect(initSsr(app.router, `/entry/%20abc%20`).$page()).toStrictEqual({ page: trimPage, params: { id: `abc` } });
      expect(initSsr(app.router, `/post/42/edit`).$page()).toStrictEqual({ page: singlePage, params: { id: `42` } });
    });

    it(`redirects unknown paths and index target`, () => {
      expect(initSsr(runtime.router, `/missing`).$page()).toStrictEqual({ page: staticPage, params: {} });

      const redirect = Router({
        routes: { list: { page: staticPage, path: `items` } },
        start: { index: { redirect: r => r.list }, public: r => [r.list], signIn: r => r.list },
      });

      expect(initSsr(redirect.router, `/`).$page()).toStrictEqual({ page: staticPage, params: {} });
    });

    it(`follows redirects in client mode`, async () => {
      window.history.replaceState(undefined, ``, `/missing`);
      runtime.router.init({ base: ``, ssr: false });

      await vi.waitFor(() => expect(window.location.pathname).toBe(`/`));

      runtime.router.dispose();
    });

    it(`resolves frozen ssr path with base`, () => {
      const app = Router({
        routes: { list: { page: staticPage, path: `items` } },
        start: { index: staticPage, public: r => [r.list], signIn: r => r.list },
      });

      app.router.init({ base: `/app`, path: `/items?tab=1`, ssr: true });

      expect(app.router.current().$page()).toStrictEqual({ page: staticPage, params: {} });
      expect(app.router.current().$context().path).toBe(`/items`);
      expect(app.router.current().$context().query.get(`tab`)).toBe(`1`);
    });
  });

  describe(`context`, () => {
    it(`exposes path, href with base, and query`, () => {
      const app = Router({
        routes: { list: { page: staticPage, path: `items` }, signIn: { page: staticPage, path: `login` } },
        start: { index: staticPage, public: r => [r.list], signIn: r => r.signIn },
      });

      window.history.replaceState(undefined, ``, `/app/items?tab=1`);
      app.router.init({ base: `/app`, ssr: false });

      const context = app.router.current().$context();

      expect(context.path).toBe(`/items`);
      expect(context.href(`/login`)).toBe(`/app/login`);
      expect(context.query.get(`tab`)).toBe(`1`);

      app.router.dispose();
    });
  });

  describe(`init`, () => {
    it(`throws before init`, () => {
      const fresh = Router({ routes: { list: { page: staticPage, path: `items` } }, start: testStart });

      expect(() => fresh.router.current()).toThrow(`Router is missing`);
    });

    it(`is idempotent for identical init`, () => {
      initSsr(runtime.router, `/page-a`);
      const { $page } = runtime.router.current();
      initSsr(runtime.router, `/page-a`);

      expect(runtime.router.current().$page).toBe($page);
    });

    it(`recreates store when path changes`, () => {
      initSsr(runtime.router, `/page-a`);
      const { $page: before } = runtime.router.current();

      initSsr(runtime.router, `/items`);

      expect(runtime.router.current().$page).not.toBe(before);
      expect(runtime.router.current().$page()).toStrictEqual({ page: staticPage, params: {} });
    });

    it(`noops go in ssr mode`, async () => {
      nav.router.init({ base: ``, path: `/peer-a`, ssr: true });
      const pushState = vi.spyOn(window.history, `pushState`);

      await nav.router.current().$context().go(`/peer-b`);

      expect(pushState).not.toHaveBeenCalled();
      expect(navTransition).not.toHaveBeenCalled();

      pushState.mockRestore();
      nav.router.dispose();
    });
  });

  describe(`shell`, () => {
    it(`creates ssr shell instance`, () => {
      const shell = RouterSsr({ base: ``, path: `/`, ssr: true });

      expect(shell.$.home).toBe(`/`);
      expect(shell.router.pattern(`/`)).toBe(`/`);
    });
  });

  describe(`go`, () => {
    it(`noops on same route`, async () => {
      await withGo(`/peer-a`, async ({ go }) => {
        await go(`/peer-a`);

        expect(navTransition).not.toHaveBeenCalled();
        expect(window.location.pathname).toBe(`/peer-a`);
      });
    });

    it(`uses transition history replace`, async () => {
      await withGo(`/peer-a`, async ({ go, pushState, replaceState }) => {
        await go(`/peer-b`);

        expect(lastHistoryUrl(replaceState)).toBe(`/peer-b`);
        expect(pushState).not.toHaveBeenCalled();
        expect(lastNavTransition()).toStrictEqual({ back: false, from: `peer-a`, to: `peer-b` });
        expect(window.location.pathname).toBe(`/peer-b`);
      });
    });

    it(`pushes when transition uses push`, async () => {
      await withGo(`/peer-a`, async ({ go, pushState }) => {
        await go(`/stack/1`);

        expect(lastHistoryUrl(pushState)).toBe(`/stack/1`);
        expect(lastNavTransition()).toStrictEqual({ back: false, from: `peer-a`, to: `stack/:id` });
        expect(window.location.pathname).toBe(`/stack/1`);
      });
    });

    it(`skips transition on explicit replace`, async () => {
      await withGo(`/peer-a`, async ({ go }) => {
        await go(`/peer-b`, { replace: true });

        expect(navTransition).not.toHaveBeenCalled();
        expect(window.location.pathname).toBe(`/peer-b`);
      });
    });

    it(`navigates with base prefix`, async () => {
      const app = Router({
        routes: { list: { page: staticPage, path: `items` }, signIn: { page: staticPage, path: `login` } },
        start: { index: staticPage, public: r => [r.list], signIn: r => r.signIn },
      });

      window.history.replaceState(undefined, ``, `/app/items`);
      app.router.init({ base: `/app`, ssr: false });
      const pushState = vi.spyOn(window.history, `pushState`);

      await app.router.current().$context().go(`/login`);

      expect(lastHistoryUrl(pushState)).toBe(`/app/login`);
      expect(window.location.pathname).toBe(`/app/login`);

      pushState.mockRestore();
      app.router.dispose();
    });

    it.each([
      [`/peer-a`, `/zone-a`, { back: false, from: `peer-a`, to: `zone-a` }],
      [`/zone-a`, `/peer-a`, { back: false, from: `zone-a`, to: `peer-a` }],
      [`/peer-b`, `/peer-a`, { back: false, from: `peer-b`, to: `peer-a` }],
    ])(`calls transition from %s to %s`, async (from, to, transition) => {
      await withGo(from, async ({ go }) => {
        await go(to);

        expect(lastNavTransition()).toStrictEqual(transition);
      });
    });

    it(`detects back when returning to previous route`, async () => {
      await withGo(`/zone-a`, async ({ go }) => {
        await go(`/peer-a`);
        await go(`/zone-a`);

        expect(lastNavTransition()).toStrictEqual({ back: true, from: `peer-a`, to: `zone-a` });
        expect(window.location.pathname).toBe(`/zone-a`);
      });
    });

    it(`updates url when reversing replace navigation`, async () => {
      const tabTransition = async ({ commit, from, to }: TransitionInput) => {
        const lateral = [`feed`, `agents`, `/`];
        const fromTab = lateral.indexOf(from);
        const toTab = lateral.indexOf(to);
        commit(fromTab !== -1 && toTab !== -1 && fromTab !== toTab ? `replace` : `push`);
        await Promise.resolve();
      };

      const tabs = Router({
        routes: { agents: { page: staticPage, path: `agents` }, feed: { page: staticPage, path: `feed` } },
        start: { index: staticPage, public: r => [r.feed], signIn: r => r.feed },
      });

      window.history.replaceState(undefined, ``, `/`);
      tabs.router.init({ base: ``, ssr: false, transition: tabTransition });
      await tabs.router.current().$context().go(`/feed`);

      expect(window.location.pathname).toBe(`/feed`);

      await tabs.router.current().$context().go(`/`);

      expect(window.location.pathname).toBe(`/`);

      tabs.router.dispose();
    });

    it(`animates browser back as pop`, async () => {
      await withGo(`/peer-a`, async ({ go }) => {
        await go(`/stack/1`);
        vi.mocked(navTransition).mockClear();
        window.history.back();

        await vi.waitFor(() =>
          expect(navTransition).toHaveBeenCalledWith(
            expect.objectContaining({ back: true, from: `stack/:id`, to: `peer-a` }),
          ),
        );

        expect(lastNavTransition()).toStrictEqual({ back: true, from: `stack/:id`, to: `peer-a` });
        expect(window.location.pathname).toBe(`/peer-a`);
      });
    });

    it(`uses history.back when navigation.canGoBack`, async () => {
      await withGo(`/peer-a`, async ({ go }) => {
        vi.stubGlobal(`navigation`, { canGoBack: true });
        const back = vi.spyOn(window.history, `back`);
        await go(-1);

        expect(back).toHaveBeenCalledWith();
        expect(navTransition).not.toHaveBeenCalled();

        back.mockRestore();
      });
    });

    it(`noops synthetic back at home`, async () => {
      await withGo(`/`, async ({ go, replaceState }) => {
        vi.stubGlobal(`navigation`, { canGoBack: false });
        replaceState.mockClear();
        await go(-1);

        expect(replaceState).not.toHaveBeenCalled();
        expect(navTransition).not.toHaveBeenCalled();
        expect(window.location.pathname).toBe(`/`);
      });
    });

    it(`synthetic-replaces to parent when history is empty`, async () => {
      await withGo(`/zone-a/child`, async ({ go, replaceState }) => {
        vi.stubGlobal(`navigation`, { canGoBack: false });
        await go(-1);

        expect(lastHistoryUrl(replaceState)).toBe(`/zone-a`);
        expect(lastNavTransition()).toStrictEqual({ back: true, from: `zone-a/child`, to: `zone-a` });
        expect(window.location.pathname).toBe(`/zone-a`);
      });
    });

    it(`synthetic-back walks parent chain`, async () => {
      await withGo(`/zone-a/child/nested`, async ({ go }) => {
        vi.stubGlobal(`navigation`, { canGoBack: false });
        await go(-1);

        expect(window.location.pathname).toBe(`/zone-a/child`);
      });
    });

    it(`skips transition without transition config`, async () => {
      vi.mocked(navTransition).mockClear();
      const bare = Router({
        routes: { peerA: { page: staticPage, path: `peer-a` }, peerB: { page: staticPage, path: `peer-b` } },
        start: testStart,
      });

      window.history.replaceState(undefined, ``, `/peer-a`);
      bare.router.init({ base: ``, ssr: false });
      await bare.router.current().$context().go(`/peer-b`);

      expect(navTransition).not.toHaveBeenCalled();
      expect(window.location.pathname).toBe(`/peer-b`);

      bare.router.dispose();
    });
  });
});
