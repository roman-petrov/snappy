/* eslint-disable unicorn/filename-case */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { $locale } from "@snappy/ui";
import renderToString from "preact-render-to-string/jsx";

import type { SiteLocaleKey } from "./core";

import { Landing } from "./components/Landing";
import { localeData } from "./locales";

export const getMeta = (locale: SiteLocaleKey) => {
  const { meta } = localeData[locale];

  return { ...meta, htmlLang: locale };
};

export const render = (locale: SiteLocaleKey = `ru`) => {
  $locale.value = locale;

  return renderToString(<Landing />, {}, { pretty: true });
};
