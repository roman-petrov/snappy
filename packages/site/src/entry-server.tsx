/* eslint-disable unicorn/filename-case */
/* eslint-disable functional/no-expression-statements */
import type { Locale } from "@snappy/intl";

import { Legal, type LegalVariant } from "@snappy/legal";
import { $locale, $theme, type Language, type Theme } from "@snappy/ui";
import { renderSite } from "@snappy/ui/StartApp.server";

import { SiteHeader } from "./components/SiteHeader";
import { localeData } from "./locales";
import { Pages, type SitePath } from "./Pages";

const legalMeta = (variant: LegalVariant, locale: Locale) => {
  const { description, keywords, title } = Legal.page(variant, locale);

  return { description, keywords, title: `${title} — Snappy` };
};

const pageMeta = (path: SitePath, locale: Locale) => {
  const variant = Legal.variant(path);

  return variant === undefined ? localeData[locale].meta : legalMeta(variant, locale);
};

export const getMeta = (path: SitePath, locale: Locale) => ({ ...pageMeta(path, locale), htmlLang: locale });

export const render = (path: SitePath, locale: Language = `system`, theme: Theme = `system`) => {
  $locale.set(locale);
  $theme.set(theme);

  return renderSite(Pages.view(path), { header: <SiteHeader />, path });
};

export { Pages as pages } from "./Pages";
