import { renderToString } from "react-dom/server";

import localeData from "./locales";
import { Landing } from "./Landing";
import { SiteLocaleStore } from "./SiteLocaleStore";

export type SiteLocaleKey = `en` | `ru`;

export type SiteMeta = { description: string; htmlLang: string; keywords: string; title: string };

export const getMeta = (locale: SiteLocaleKey): SiteMeta => {
  const meta = localeData[locale].meta;
  return { ...meta, htmlLang: locale };
};

export const render = (locale: SiteLocaleKey = `ru`): string => {
  SiteLocaleStore.setServerLocale(locale);
  return renderToString(<Landing />);
};
