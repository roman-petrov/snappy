/* eslint-disable vitest/expect-expect */
import { render } from "@testing-library/react";
import { createElement, isValidElement } from "react";
import { MemoryRouter, Navigate, Route, Routes } from "react-router-dom";
import { describe, expect, expectTypeOf, it } from "vitest";

import { AppRoutes, type RouteParameters } from "./AppRoutes";

const StaticPage = () => <main />;
const IndexPage = () => <main data-testid="index" />;
const SinglePage = ({ id }: { id: string }) => <main>{id}</main>;

const PairPage = ({ first, second }: { first: string; second: string }) => (
  <main>
    {first}/{second}
  </main>
);

const PairXYPage = ({ left, right }: { left: string; right: string }) => (
  <main>
    {left}/{right}
  </main>
);

const BranchPage = ({ id }: { id: string }) => <main>{id}</main>;
const TrimPage = ({ id }: { id: string }) => <main data-id={id} data-testid="trim-page" />;

const TriplePage = ({ a, b, c }: { a: string; b: string; c: string }) => (
  <main>
    {a}/{b}/{c}
  </main>
);

const testStart = { index: StaticPage, public: () => [] as readonly string[], signIn: () => `/` };

const routes = AppRoutes(
  {
    branch: { edit: { page: BranchPage, path: `branch/:id` }, list: { page: StaticPage, path: `branches` } },
    group: { leaf: { page: StaticPage, path: `group/leaf` }, root: { page: StaticPage, path: `group` } },
    list: { page: StaticPage, path: `items` },
    pair: { page: PairPage, path: `alpha/:first/beta/:second` },
    signIn: { page: StaticPage, path: `login` },
    single: { page: SinglePage, path: `entry/:id` },
  },
  { index: IndexPage, public: r => [r.signIn, r.branch.list], signIn: r => r.signIn },
);

type Check<T extends true> = T;

type Equal<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;

void (true as Check<Equal<typeof routes.$.home, `/`>>);
void (true as Check<Equal<typeof routes.list, string>>);
void (true as Check<Equal<typeof routes.group.root, string>>);
void (true as Check<typeof routes.single extends (p: { id: string }) => string ? true : false>);
void (true as Check<typeof routes.pair extends (p: { first: string; second: string }) => string ? true : false>);
void (true as Check<Equal<RouteParameters<typeof routes.$.schema.single>, { id: string }>>);
void (true as Check<Equal<RouteParameters<typeof routes.$.schema.pair>, { first: string; second: string }>>);

describe(`AppRoutes`, () => {
  it(`exposes home and raw segment tree`, () => {
    expect(routes.$.home).toBe(`/`);
    expect(routes.$.schema).toStrictEqual({
      branch: { edit: `branch/:id`, list: `branches` },
      group: { leaf: `group/leaf`, root: `group` },
      list: `items`,
      pair: `alpha/:first/beta/:second`,
      signIn: `login`,
      single: `entry/:id`,
    });
  });

  it(`builds flat paths`, () => {
    expect(routes.list).toBe(`/items`);
  });

  it(`builds nested paths`, () => {
    expect(routes.group.root).toBe(`/group`);
    expect(routes.group.leaf).toBe(`/group/leaf`);
    expect(routes.branch.list).toBe(`/branches`);
  });

  it(`builds nested dynamic paths with encoded parameters`, () => {
    expect(routes.branch.edit({ id: `abc` })).toBe(`/branch/abc`);
    expect(routes.branch.edit({ id: `x/y` })).toBe(`/branch/x%2Fy`);
  });

  it(`builds dynamic paths with encoded parameters`, () => {
    expect(routes.single({ id: `x/y` })).toBe(`/entry/x%2Fy`);
    expect(routes.pair({ first: `1`, second: `2/3` })).toBe(`/alpha/1/beta/2%2F3`);
  });

  it(`resolves start config`, () => {
    expect(routes.$.signInPath).toBe(`/login`);
    expect(routes.$.publicPaths).toStrictEqual([`/login`, `/branches`]);
    expect(isValidElement(routes.$.index)).toBe(true);
  });

  it(`builds index redirect from start config`, () => {
    const collection = AppRoutes(
      { list: { page: StaticPage, path: `users` } },
      { index: { redirect: r => r.list }, public: () => [], signIn: () => `/` },
    );

    expect(collection.$.index).toStrictEqual(createElement(Navigate, { replace: true, to: `/users` }));
  });

  it(`trims dynamic route parameters before passing to page`, () => {
    const collection = AppRoutes({ single: { page: TrimPage, path: `entry/:id` } }, testStart);

    const { getByTestId } = render(
      <MemoryRouter initialEntries={[`/entry/%20abc%20`]}>
        <Routes>
          <Route element={collection.$.pages[`entry/:id`]} path="/entry/:id" />
        </Routes>
      </MemoryRouter>,
    );

    expect(getByTestId(`trim-page`).getAttribute(`data-id`)).toBe(`abc`);
  });

  it(`exposes pages keyed by route pattern`, () => {
    expect(Object.keys(routes.$.pages).toSorted()).toStrictEqual([
      `alpha/:first/beta/:second`,
      `branch/:id`,
      `branches`,
      `entry/:id`,
      `group`,
      `group/leaf`,
      `items`,
      `login`,
    ]);
    expect(isValidElement(routes.$.pages[`items`])).toBe(true);
    expect(isValidElement(routes.$.pages[`entry/:id`])).toBe(true);
  });

  describe(`types`, () => {
    it(`infers static and nested paths`, () => {
      expectTypeOf(routes.$.home).toEqualTypeOf<`/`>();
      expectTypeOf(routes.list).toEqualTypeOf<string>();
      expectTypeOf(routes.group.root).toEqualTypeOf<string>();
      expectTypeOf(routes.group.leaf).toEqualTypeOf<string>();
      expectTypeOf(routes.branch.list).toEqualTypeOf<string>();
      expectTypeOf(routes.$.schema.branch.edit).toEqualTypeOf<`branch/:id`>();
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

    it(`rejects missing dynamic parameters at compile time`, () => {
      // @ts-expect-error Property 'id' is missing
      const missing: Parameters<typeof routes.single>[0] = {};

      expect(missing).toStrictEqual({});
    });

    it(`rejects unknown dynamic parameters at compile time`, () => {
      // @ts-expect-error Object literal may only specify known properties
      routes.single({ extra: `b`, id: `a` });
      // @ts-expect-error Object literal may only specify known properties
      routes.branch.edit({ extra: `b`, id: `a` });
      // @ts-expect-error Object literal may only specify known properties
      routes.pair({ extra: `c`, first: `a`, second: `b` });

      expect(true).toBe(true);
    });
  });
});

describe(`pages`, () => {
  describe(`types`, () => {
    it(`accepts matching components`, () => {
      expectTypeOf(
        AppRoutes(
          {
            dynamic: { page: SinglePage, path: `row/:id` },
            entry: { page: SinglePage, path: `entry/:id` },
            list: { page: StaticPage, path: `items` },
          },
          testStart,
        ),
      )
        .toHaveProperty(`$`)
        .toHaveProperty(`pages`);
    });

    it(`accepts multi-parameter components`, () => {
      expectTypeOf(
        AppRoutes(
          {
            list: { page: StaticPage, path: `items` },
            pair: { page: PairXYPage, path: `x/:left/y/:right` },
            triple: { page: TriplePage, path: `p/:a/q/:b/r/:c` },
          },
          testStart,
        ),
      )
        .toHaveProperty(`$`)
        .toHaveProperty(`pages`);
    });

    it(`rejects prop-less components on dynamic routes at compile time`, () => {
      AppRoutes(
        {
          // @ts-expect-error — dynamic route expects route parameters in page props
          dynamic: { page: StaticPage, path: `row/:id` },
          entry: { page: SinglePage, path: `entry/:id` },
          list: { page: StaticPage, path: `items` },
        },
        testStart,
      );
    });

    it(`rejects prop-less components on multi-parameter routes at compile time`, () => {
      AppRoutes(
        {
          list: { page: StaticPage, path: `items` },
          // @ts-expect-error — dynamic route expects route parameters in page props
          pair: { page: StaticPage, path: `x/:left/y/:right` },
          // @ts-expect-error — dynamic route expects route parameters in page props
          triple: { page: StaticPage, path: `p/:a/q/:b/r/:c` },
        },
        testStart,
      );
    });

    it(`rejects parameterized components on static routes at compile time`, () => {
      AppRoutes(
        {
          dynamic: { page: SinglePage, path: `row/:id` },
          entry: { page: SinglePage, path: `entry/:id` },
          // @ts-expect-error — static route expects () => ReactNode
          list: { page: SinglePage, path: `items` },
        },
        testStart,
      );
    });

    it(`rejects component props that do not match path parameters at compile time`, () => {
      const AgentPage = ({ agentId }: { agentId: string }) => <main>{agentId}</main>;

      AppRoutes(
        {
          list: { page: StaticPage, path: `items` },
          // @ts-expect-error — path parameter names must match page props
          row: { page: AgentPage, path: `row/:id` },
        },
        testStart,
      );
    });
  });
});
