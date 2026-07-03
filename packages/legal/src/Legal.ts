import type { Locale } from "@snappy/intl";

import privacyEn from "../content/privacy.en.html?raw";
import privacyRu from "../content/privacy.ru.html?raw";
import termsEn from "../content/terms.en.html?raw";
import termsRu from "../content/terms.ru.html?raw";
import { localeData } from "./locales";

export type LegalRoute = `/${LegalVariant}`;

export type LegalVariant = `privacy` | `terms`;

const content = { privacy: { en: privacyEn, ru: privacyRu }, terms: { en: termsEn, ru: termsRu } } as const;
const body = (variant: LegalVariant, locale: Locale) => content[variant][locale];
const title = (variant: LegalVariant, locale: Locale) => localeData[locale][variant].title;

const page = (variant: LegalVariant, locale: Locale) => ({
  body: body(variant, locale),
  ...localeData[locale][variant],
});

const variant = (path: string): LegalVariant | undefined =>
  path === `/privacy` ? `privacy` : path === `/terms` ? `terms` : undefined;

const route = (pathname: string, prefix = ``): LegalRoute | undefined => {
  const normalized = prefix && pathname.startsWith(prefix) ? pathname.slice(prefix.length) || `/` : pathname;
  const resolved = variant(normalized);

  return resolved === undefined ? undefined : `/${resolved}`;
};

export const Legal = { body, page, route, title, variant };
