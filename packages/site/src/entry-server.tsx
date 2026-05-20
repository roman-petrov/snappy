/* eslint-disable unicorn/filename-case */
/* eslint-disable functional/no-expression-statements */
import type { Locale } from "@snappy/intl";

import { $locale, $theme, type Language, type Theme } from "@snappy/ui";
import { renderApp } from "@snappy/ui/StartApp.server";

import { Landing } from "./components/Landing";
import { localeData } from "./locales";

export const getMeta = (locale: Locale) => {
  const { meta } = localeData[locale];

  return { ...meta, htmlLang: locale };
};

export const render = (locale: Language = `system`, theme: Theme = `system`) => {
  $locale.set(locale);
  $theme.set(theme);

  return renderApp(<Landing />);
};
