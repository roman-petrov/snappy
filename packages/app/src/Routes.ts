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
  agent: `agent`,
  balance: { topUp: `balance/top-up` },
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
  snappy: `snappy`,
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

type RoutesShape = AllNestedPaths &
  Omit<FlatRoutePaths, `agent`> & {
    readonly agent: (id: string) => string;
    readonly home: `/`;
    readonly segment: typeof segment;
  };

const routerOnlyKey = (key: string): key is RouterOnlyKey => key === `chat` || key === `wildcard`;

const branches = _.fromEntries(
  _.keys(segment).flatMap(key => {
    const value = segment[key];

    return isRecord(value) ? [[key, hrefDeep(value)]] : [];
  }),
);

const flatNav = _.fromEntries(
  _.keys(segment).flatMap(key => {
    const value = segment[key];

    return _.isString(value) && !routerOnlyKey(key) && !value.includes(`:`) ? [[key, toHref(value)]] : [];
  }),
);

const agent = (id: string) => `${toHref(segment.agent)}/${encodeURIComponent(id)}`;
const routesBuilt = { home: `/`, segment, ...branches, ...flatNav, agent };

export const Routes = routesBuilt as unknown as RoutesShape;
