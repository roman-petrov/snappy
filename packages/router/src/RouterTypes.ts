import type { ReadonlyStore } from "@snappy/core";

import type { Go, Page, RedirectTarget, RouterContextValue, RouterPageState } from "./Types";

export type HrefFrom<S> = Record<FlatKey<S>, string> & { readonly [K in BranchKey<S>]: HrefTree<S[K]> } & {
  readonly [K in DynamicKey<S>]: S[K] extends string ? (p: Record<PathParameter<S[K]>, string>) => string : never;
};

export type IndexTarget = Page | RedirectTarget;

export type NavigationEdge = { from: string; history: `push` | `replace`; to: string; toPath?: string };

export type PathParameters<P extends string> = Record<PathParameter<P>, string>;

export type PathsFrom<I> = {
  [K in keyof I]: I[K] extends { path: infer P extends string }
    ? P
    : I[K] extends Record<string, unknown>
      ? PathsFrom<I[K]>
      : never;
};

export type PathsMeta = {
  readonly home: `/`;
  readonly index: IndexTarget;
  readonly publicPaths: readonly string[];
  readonly signInPath: string;
};

export type RouterBundle<S> = HrefFrom<S> & { readonly $: PathsMeta; readonly router: RouterRuntime };

export type RouterConfig<I extends RoutesInput<I>> = { routes: I; start: StartConfig<HrefFrom<PathsFrom<I>>> };

export type RouterInit = { base?: string; path?: string; ssr?: boolean; transition?: TransitionFn };

export type RouterRuntime = {
  current: () => RouterRuntimeCurrent;
  dispose: () => void;
  go: Go;
  href: (path: string) => string;
  init: (input: RouterInit) => void;
  parent: (pattern: string) => string;
  pattern: (pathname: string) => string;
  stack: () => readonly NavigationEdge[];
  stateAt: (pathname: string) => RouterPageState | undefined;
};

export type RouterRuntimeCurrent = {
  $context: ReadonlyStore<RouterContextValue>;
  $page: ReadonlyStore<RouterPageState | undefined>;
};

export type RouterShell = { readonly $: { readonly home: `/` }; readonly router: RouterRuntime };

export type RouterShellConfig = { base?: string; path?: string; ssr: true };

export type RoutesInput<T> = {
  readonly [K in keyof T]: T[K] extends { page: infer F; path: infer P extends string }
    ? { readonly page: PageFor<P, F>; readonly path: P }
    : T[K] extends Record<string, unknown>
      ? RoutesInput<T[K]>
      : never;
};

export type StartConfig<R> = {
  index: IndexRedirect<R> | Page;
  public: (routes: R) => readonly string[];
  signIn: (routes: R) => string;
};

export type TransitionCommit = (history?: `push` | `replace` | `silent`) => void;

export type TransitionFn = (input: {
  back: boolean;
  commit: TransitionCommit;
  from: string;
  to: string;
}) => Promise<void>;

type BranchKey<S> = { [K in keyof S]: S[K] extends string ? never : K }[keyof S];

type DynamicKey<S> = {
  [K in keyof S]: S[K] extends string ? (S[K] extends `${string}:${string}` ? K : never) : never;
}[keyof S];

type DynamicPage<P extends string, F> = F extends (props: PathParameters<P>) => unknown
  ? keyof PathParameters<P> extends keyof NonNullable<Parameters<F>[0]>
    ? keyof NonNullable<Parameters<F>[0]> extends keyof PathParameters<P>
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

type StaticPage<F> = F extends () => unknown ? (Parameters<F> extends [] ? F : never) : never;
