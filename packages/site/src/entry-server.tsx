/* eslint-disable unicorn/filename-case */
/* eslint-disable functional/no-expression-statements */
import { $locale } from "@snappy/ui";
import { renderToString } from "react-dom/server";

import type { SiteLocaleKey } from "./core";

import { Landing } from "./components/Landing";
import { localeData } from "./locales";

export const getMeta = (locale: SiteLocaleKey) => {
  const { meta } = localeData[locale];

  return { ...meta, htmlLang: locale };
};

export const render = (locale: SiteLocaleKey = `ru`) => {
  $locale.set(locale);

  return renderToString(<Landing />);
};
