/* eslint-disable unicorn/filename-case */
/* eslint-disable functional/no-expression-statements */
import { renderToString } from "react-dom/server";

import { Landing } from "./components/Landing";
import { SiteLocaleStore } from "./core";
import localeData from "./locales";

export type SiteLocaleKey = `en` | `ru`;

export type SiteMeta = { description: string; htmlLang: string; keywords: string; title: string };

export const getMeta = (locale: SiteLocaleKey) => {
  const { meta } = localeData[locale];

  return { ...meta, htmlLang: locale };
};

export const render = (locale: SiteLocaleKey = `ru`) => {
  SiteLocaleStore.setServerLocale(locale);

  return renderToString(<Landing />);
};
