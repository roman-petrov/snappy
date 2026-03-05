/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable unicorn/no-document-cookie */
import { _ } from "@snappy/core";
import { $locale } from "@snappy/ui";

import { localeData, makeT } from "../locales";
import { LocaleCookie, type SiteLocaleKey } from "./LocaleCookie";

const maxAgeSeconds = _.day.seconds * _.daysInYear;

const get = (): SiteLocaleKey => {
  if (typeof window !== `undefined`) {
    const locale = LocaleCookie.parse(document.cookie);
    $locale.set(locale);
    document.documentElement.lang = locale;

    return locale;
  }

  return $locale();
};

const set = (next: SiteLocaleKey) => {
  $locale.set(next);
  document.cookie = `${LocaleCookie.name}=${next}; path=/; max-age=${maxAgeSeconds}`;
  document.documentElement.lang = next;
  location.reload();
};

const localeKeys = Object.keys(localeData) as SiteLocaleKey[];

export const t = makeT(get as () => SiteLocaleKey);

export const Locale = { get, localeKeys, locales: localeData, set };

export type { SiteLocaleKey } from "./LocaleCookie";
