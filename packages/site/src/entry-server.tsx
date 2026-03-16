/* eslint-disable unicorn/filename-case */
/* eslint-disable functional/no-expression-statements */
import { $locale, $theme, type Locale, renderApp, type ResolvedLocale, type Theme } from "@snappy/ui";

import { Landing } from "./components/Landing";
import { localeData } from "./locales";

export const getMeta = (locale: ResolvedLocale) => {
  const { meta } = localeData[locale];

  return { ...meta, htmlLang: locale };
};

export const render = (locale: Locale = `system`, theme: Theme = `system`) => {
  $locale.set(locale);
  $theme.set(theme);

  return renderApp(<Landing />);
};
