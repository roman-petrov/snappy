/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { _ } from "@snappy/core";
import { type ComponentType, createElement, type ReactNode } from "react";
import { Navigate, useParams } from "react-router-dom";

export type RouteMeta<S> = {
  readonly home: `/`;
  readonly index: ReactNode;
  readonly pages: Record<string, ReactNode>;
  readonly publicPaths: readonly string[];
  readonly schema: S;
  readonly signInPath: string;
};

export type RouteParameters<P extends string> = Record<PathParameter<P>, string>;

export type StartAppRoutes = { readonly $: RouteMeta<unknown> };

type BranchKey<S> = { [K in keyof S]: S[K] extends string ? never : K }[keyof S];

type DynamicKey<S> = {
  [K in keyof S]: S[K] extends string ? (S[K] extends `${string}:${string}` ? K : never) : never;
}[keyof S];

type DynamicPage<P extends string, F> = F extends (props: RouteParameters<P>) => ReactNode
  ? RouteParameters<P> extends Parameters<F>[0]
    ? Parameters<F>[0] extends RouteParameters<P>
      ? F
      : never
    : never
  : never;

type FlatKey<S> = {
  [K in keyof S]: S[K] extends infer V
    ? V extends string
      ? V extends `${string}:${string}`
        ? never
        : K
      : never
    : never;
}[keyof S];

type HrefFrom<S> = Record<FlatKey<S>, string> & { readonly [K in BranchKey<S>]: HrefTree<S[K]> } & {
  readonly [K in DynamicKey<S>]: S[K] extends string ? (p: Record<PathParameter<S[K]>, string>) => string : never;
};

type HrefTree<T> = {
  readonly [K in keyof T]: T[K] extends string
    ? T[K] extends `${string}:${string}`
      ? (parameters: Record<PathParameter<T[K]>, string>) => string
      : string
    : HrefTree<T[K]>;
};

type IndexRedirect<R> = { readonly redirect: (routes: R) => string };

type PageFor<P extends string, F> = P extends `${string}:${string}` ? DynamicPage<P, F> : StaticPage<F>;

type PathParameter<P extends string> = P extends `${string}:${infer N}/${infer R}`
  ? N | PathParameter<R>
  : P extends `${string}:${infer N}`
    ? N
    : never;

type PathsFrom<I> = {
  [K in keyof I]: I[K] extends { path: infer P extends string }
    ? P
    : I[K] extends Record<string, unknown>
      ? PathsFrom<I[K]>
      : never;
};

type RouteLeaf<P extends string> = { readonly page: ComponentType; readonly path: P };

type RouteNode = Record<string, unknown> | RouteLeaf<string>;

type RoutesInput<T> = {
  readonly [K in keyof T]: T[K] extends { page: infer F; path: infer P extends string }
    ? { readonly page: PageFor<P, F>; readonly path: P }
    : T[K] extends Record<string, unknown>
      ? RoutesInput<T[K]>
      : never;
};

type RoutesWithStart<S> = HrefFrom<S> & { readonly $: RouteMeta<S> };

type StartConfig<R> = {
  index: (() => ReactNode) | IndexRedirect<R>;
  public: (routes: R) => readonly string[];
  signIn: (routes: R) => string;
};

type StaticPage<F> = F extends () => ReactNode ? (Parameters<F> extends [] ? F : never) : never;

export const AppRoutes = <const I extends RoutesInput<I>>(
  routes: I,
  start: StartConfig<HrefFrom<PathsFrom<I>>>,
): RoutesWithStart<PathsFrom<I>> => {
  const parameter = /:(?<name>\w+)/gu;

  const routeParameters = <P extends string>(pattern: P, raw: Record<string, string | undefined>): RouteParameters<P> =>
    _.fromEntries(
      [...pattern.matchAll(parameter)].flatMap(match =>
        match.groups?.[`name`] === undefined ? [] : [[match.groups[`name`], (raw[match.groups[`name`]] ?? ``).trim()]],
      ),
    ) as RouteParameters<P>;

  const isLeaf = (value: unknown): value is { page: ComponentType; path: string } =>
    _.isObject(value) &&
    !_.isArray(value) &&
    _.isString((value as { path?: unknown }).path) &&
    _.isFunction((value as { page?: unknown }).page);

  const dynamic = <P extends string>(pattern: P, page: ComponentType<RouteParameters<P>>) => {
    const DynamicRoute = () => createElement(page, routeParameters(pattern, useParams()));

    return createElement(DynamicRoute);
  };

  const mount = (pattern: string, page: ComponentType): ReactNode =>
    pattern.includes(`:`) ? dynamic(pattern, page as ComponentType<RouteParameters<string>>) : createElement(page);

  const pathsFromInput = (node: RouteNode): Record<string, unknown> | string =>
    isLeaf(node)
      ? node.path
      : _.fromEntries(_.entries(node).map(([key, value]) => [key, pathsFromInput(value as RouteNode)]));

  const pagesFromInput = (node: RouteNode): Record<string, ReactNode> => {
    if (isLeaf(node)) {
      return { [node.path]: mount(node.path, node.page) };
    }

    return _.fromEntries(_.entries(node).flatMap(([, value]) => _.entries(pagesFromInput(value as RouteNode))));
  };

  const schema = pathsFromInput(routes) as PathsFrom<I>;
  const to = (path: string) => `/${path}`;

  const record = (value: unknown): value is Record<string, unknown> =>
    value !== null && _.isObject(value) && !_.isArray(value);

  const path = (raw: string): ((parameters: Record<string, string>) => string) | string => {
    if (!raw.includes(`:`)) {
      return to(raw);
    }

    return (parameters: Record<string, string>) =>
      to(raw).replaceAll(parameter, (match, ...rest: unknown[]) => {
        const tail = rest.at(-1);
        const name = _.isObject(tail) && `name` in tail && _.isString(tail.name) ? tail.name : undefined;

        return name === undefined ? match : encodeURIComponent(parameters[name] ?? ``);
      });
  };

  const deep = (
    node: Record<string, unknown> | string,
  ): ((parameters: Record<string, string>) => string) | Record<string, unknown> | string =>
    _.isString(node)
      ? path(node)
      : _.fromEntries(_.entries(node).map(([key, value]) => [key, deep(record(value) ? value : (value as string))]));

  const links = _.fromEntries(
    _.keys(schema).flatMap((key): [string, unknown][] => {
      const routeKey = String(key);
      const value = schema[key];

      return record(value) ? [[routeKey, deep(value)]] : _.isString(value) ? [[routeKey, path(value)]] : [];
    }),
  );

  const href = { ...links } as HrefFrom<PathsFrom<I>>;
  const signInPath = start.signIn(href);
  const publicPaths = start.public(href);

  const indexRedirect = (
    value: StartConfig<HrefFrom<PathsFrom<I>>>[`index`],
  ): value is IndexRedirect<HrefFrom<PathsFrom<I>>> => _.isObject(value) && `redirect` in value;

  const index = indexRedirect(start.index)
    ? createElement(Navigate, { replace: true, to: start.index.redirect(href) })
    : createElement(start.index);

  return { ...href, $: { home: `/`, index, pages: pagesFromInput(routes), publicPaths, schema, signInPath } };
};
