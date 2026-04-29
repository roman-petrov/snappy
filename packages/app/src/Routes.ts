/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { _ } from "@snappy/core";

const toHref = (segment: string) => `/${segment}`;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  value !== null && _.isObject(value) && !_.isArray(value);

const hrefDeep = (node: Record<string, unknown> | string): Record<string, unknown> | string =>
  _.isString(node)
    ? toHref(node)
    : _.fromEntries(
        _.entries(node).map(([key, value]) => [key, hrefDeep(isRecord(value) ? value : (value as string))]),
      );

const segment = {
  balance: { low: `balance/low`, topUp: `balance/top-up` },
  feed: `feed`,
  forgotPassword: `forgot-password`,
  login: `login`,
  register: `register`,
  resetPassword: `reset-password`,
  settings: {
    aiTunnel: `settings/ai-tunnel`,
    language: `settings/language`,
    models: { chat: `settings/models/chat`, image: `settings/models/image`, speech: `settings/models/speech` },
    root: `settings`,
    theme: `settings/theme`,
  },
  wildcard: `*`,
} as const;

type AllNestedPaths = { readonly [K in BranchKey]: HrefTree<(typeof segment)[K]> };

type BranchKey = { [K in keyof typeof segment]: (typeof segment)[K] extends string ? never : K }[keyof typeof segment];

type FlatRouteKey = {
  [K in keyof typeof segment]: (typeof segment)[K] extends infer V
    ? V extends string
      ? K extends RouterOnlyKey
        ? never
        : V extends `${string}:${string}`
          ? never
          : K
      : never
    : never;
}[keyof typeof segment];

type FlatRoutePaths = Record<FlatRouteKey, string>;

type HrefTree<T> = { readonly [K in keyof T]: T[K] extends string ? string : HrefTree<T[K]> };

type RouterOnlyKey = `chat` | `wildcard`;

type RoutesShape = AllNestedPaths & FlatRoutePaths & { readonly home: `/`; readonly segment: typeof segment };

const routerOnlyKey = (key: string): key is RouterOnlyKey => key === `chat` || key === `wildcard`;

const branches = _.fromEntries(
  _.keys(segment).flatMap(key => {
    const value = segment[key];
    if (!isRecord(value)) {
      return [];
    }

    return [[key, hrefDeep(value)]];
  }),
);

const flatNav = _.fromEntries(
  _.keys(segment).flatMap(key => {
    const value = segment[key];
    if (!_.isString(value) || routerOnlyKey(key) || value.includes(`:`)) {
      return [];
    }

    return [[key, toHref(value)]];
  }),
);

const routesBuilt = { home: `/`, segment, ...branches, ...flatNav };

export const Routes = routesBuilt as unknown as RoutesShape;
