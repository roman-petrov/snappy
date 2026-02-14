/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable init-declarations */
/* eslint-disable unicorn/no-document-cookie */
import { LocaleCookie, type SiteLocaleKey } from "./LocaleCookie";

export const SiteLocaleStore = (() => {
  let serverLocale: SiteLocaleKey | undefined;

  const setServerLocale = (locale: SiteLocaleKey): void => {
    serverLocale = locale;
  };

  const getSiteLocale = (): SiteLocaleKey => {
    if (typeof window === `undefined`) {
      return serverLocale ?? `ru`;
    }

    const locale = LocaleCookie.parseLocaleFromCookie(document.cookie);
    document.documentElement.lang = locale;

    return locale;
  };

  const setSiteLocale = (next: SiteLocaleKey): void => {
    if (typeof document === `undefined`) {
      return;
    }
    document.cookie = `${LocaleCookie.cookieName}=${next}; path=/; max-age=31536000`;
    document.documentElement.lang = next;
    location.reload();
  };

  return { getSiteLocale, setServerLocale, setSiteLocale };
})();

export { type SiteLocaleKey } from "./LocaleCookie";
