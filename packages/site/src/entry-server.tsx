/* eslint-disable unicorn/filename-case */
/* eslint-disable functional/no-expression-statements */
import type { Locale } from "@snappy/intl";

import { $locale, $theme, type Language, type Theme } from "@snappy/ui";
import { renderSite } from "@snappy/ui/StartApp.server";

import { SiteHeader, SiteShell } from "./components";
import { Pages, type SitePath } from "./Pages";

export const getMeta = (path: SitePath, locale: Locale) => ({ ...Pages.meta(path, locale), htmlLang: locale });

export const render = (path: SitePath, locale: Language = `system`, theme: Theme = `system`) => {
  $locale.set(locale);
  $theme.set(theme);
  const View = Pages.at(path);

  return renderSite(<SiteShell view={View} />, { header: <SiteHeader />, path });
};

export { Pages as pages } from "./Pages";
