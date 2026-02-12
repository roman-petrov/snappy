import { renderToString } from "react-dom/server";

import { Landing } from "./components/Landing";
import localeData from "./locales";
import { SiteLocaleStore } from "./SiteLocaleStore";

export type SiteLocaleKey = `en` | `ru`;

export type SiteMeta = { description: string; htmlLang: string; keywords: string; title: string }

export const getMeta = (locale: SiteLocaleKey): SiteMeta => {
  const {meta} = localeData[locale];

  return { ...meta, htmlLang: locale };
};

export const render = (locale: SiteLocaleKey = `ru`): string => {
  SiteLocaleStore.setServerLocale(locale);

  return renderToString(<Landing />);
};
