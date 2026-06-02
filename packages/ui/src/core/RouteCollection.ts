/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { _ } from "@snappy/core";

type BranchKey<S> = { [K in keyof S]: S[K] extends string ? never : K }[keyof S];

type DynamicKey<S> = {
  [K in keyof S]: S[K] extends string ? (S[K] extends `${string}:${string}` ? K : never) : never;
}[keyof S];

type FlatKey<S> = {
  [K in keyof S]: S[K] extends infer V
    ? V extends string
      ? V extends `${string}:${string}`
        ? never
        : K
      : never
    : never;
}[keyof S];

type HrefTree<T> = { readonly [K in keyof T]: T[K] extends string ? string : HrefTree<T[K]> };

type PathParameter<P extends string> = P extends `${string}:${infer N}/${infer R}`
  ? N | PathParameter<R>
  : P extends `${string}:${infer N}`
    ? N
    : never;

type RoutesFrom<S> = Record<FlatKey<S>, string> & { readonly $: S; readonly home: `/` } & {
  readonly [K in BranchKey<S>]: HrefTree<S[K]>;
} & { readonly [K in DynamicKey<S>]: S[K] extends string ? (p: Record<PathParameter<S[K]>, string>) => string : never };

export const RouteCollection = <const S extends Record<string, Record<string, unknown> | string>>(
  segment: S,
): RoutesFrom<S> => {
  const parameter = /:(?<name>\w+)/gu;
  const to = (path: string) => `/${path}`;

  const record = (value: unknown): value is Record<string, unknown> =>
    value !== null && _.isObject(value) && !_.isArray(value);

  const deep = (node: Record<string, unknown> | string): Record<string, unknown> | string =>
    _.isString(node)
      ? to(node)
      : _.fromEntries(_.entries(node).map(([key, value]) => [key, deep(record(value) ? value : (value as string))]));

  const paths = _.fromEntries(
    _.keys(segment).flatMap((key): [string, unknown][] => {
      const routeKey = String(key);
      const value = segment[key];

      return record(value)
        ? [[routeKey, deep(value)]]
        : _.isString(value)
          ? value.includes(`:`)
            ? [
                [
                  routeKey,
                  (p: Record<string, string>) =>
                    to(value).replaceAll(parameter, (match, ...rest: unknown[]) => {
                      const tail = rest.at(-1);
                      const name = _.isObject(tail) && `name` in tail && _.isString(tail.name) ? tail.name : undefined;

                      return name === undefined ? match : encodeURIComponent(p[name] ?? ``);
                    }),
                ],
              ]
            : [[routeKey, to(value)]]
          : [];
    }),
  );

  return { $: segment, home: `/`, ...paths } as RoutesFrom<S>;
};
