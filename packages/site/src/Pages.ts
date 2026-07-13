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

type PageModule = { default: PageView };

type PageView = () => ReactNode;

const modules = import.meta.glob<PageModule>(`./pages/*.tsx`, { eager: true });
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
const moduleAt = (path: SitePath) => modules[entry(path).file] ?? notFound(path);
const view = (moduleObject: PageModule) => moduleObject.default;
const meta = (path: SitePath, locale: Locale): SitePageMeta => localeData[locale].meta[metaKey(path)];
const at = (path: SitePath) => view(moduleAt(path));

export type SitePath = (typeof paths)[number];

export const Pages = { at, meta, paths };
