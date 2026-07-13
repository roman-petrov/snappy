import type { Locale } from "@snappy/intl";
import type { ReactNode } from "react";

import { _ } from "@snappy/core";

import type { SitePageMeta } from "./SitePage";

import { localeData } from "./locales";

type MetaKey = keyof (typeof localeData)[`en`][`meta`];

const isMetaKey = (key: string): key is MetaKey => key in localeData.en.meta;

const metaKey = (path: SitePath): MetaKey => {
  const key = path === `/` ? `index` : path.slice(1);

  return isMetaKey(key) ? key : `index`;
};

type PageLoader = () => Promise<PageModule>;

type PageModule = { default: PageView };

type PageView = () => ReactNode;

const modules: Record<string, PageLoader | PageModule> = import.meta.env.SSR
  ? import.meta.glob<PageModule>(`./pages/*.tsx`, { eager: true })
  : import.meta.glob<PageModule>(`./pages/*.tsx`);

const name = (file: string) => /\/(?<n>\w+)\.tsx$/u.exec(file)?.groups?.[`n`] ?? ``;
const route = (n: string) => (n === `Index` ? `/` : `/${_.kebabCase(n)}`);
const entries = _.keys(modules).map(file => ({ file, path: route(name(file)) }));

const paths = entries
  .map(({ path }) => path)
  .toSorted((left, right) => (left === `/` ? -1 : right === `/` ? 1 : left.localeCompare(right)));

const notFound = (path: SitePath): never => {
  throw new Error(`Page not found: ${path}`);
};

const entry = (path: SitePath) => entries.find(item => item.path === path) ?? notFound(path);
const isLoader = (value: PageLoader | PageModule): value is PageLoader => _.isFunction(value);
const valueAt = (path: SitePath) => modules[entry(path).file] ?? notFound(path);
const view = (moduleObject: PageModule) => moduleObject.default;

const moduleSync = (path: SitePath): PageModule => {
  const value = valueAt(path);

  return isLoader(value) ? notFound(path) : value;
};

const moduleAsync = async (path: SitePath): Promise<PageModule> => {
  const value = valueAt(path);

  return isLoader(value) ? value() : notFound(path);
};

const meta = (path: SitePath, locale: Locale): SitePageMeta => localeData[locale].meta[metaKey(path)];
const at = (path: SitePath) => view(moduleSync(path));
const load = async (path: SitePath) => view(import.meta.env.SSR ? moduleSync(path) : await moduleAsync(path));

export type SitePath = (typeof paths)[number];

export const Pages = { at, load, meta, paths };
