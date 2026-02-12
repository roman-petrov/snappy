const cookieName = `snappy-locale`;

export type SiteLocaleKey = `en` | `ru`;

const parseCookie = (): SiteLocaleKey => {
  if (typeof document === `undefined`) {
    return `ru`;
  }
  const match = document.cookie
    .split(`;`)
    .map(s => s.trim())
    .find(s => s.startsWith(`${cookieName}=`));

  const value = match?.split(`=`)[1];

  return value === `en` || value === `ru` ? value : `ru`;
};

export const SiteLocaleStore = (() => {
  let serverLocale: SiteLocaleKey | undefined;

  const setServerLocale = (locale: SiteLocaleKey): void => {
    serverLocale = locale;
  };

  const getSiteLocale = (): SiteLocaleKey => {
    if (typeof window === `undefined`) {
      return serverLocale ?? `ru`;
    }
    const locale = parseCookie();
    document.documentElement.lang = locale;

    return locale;
  };

  const setSiteLocale = (next: SiteLocaleKey): void => {
    if (typeof document === `undefined`) {
      return;
    }
    document.cookie = `${cookieName}=${next}; path=/; max-age=31536000`;
    document.documentElement.lang = next;
    location.reload();
  };

  return { getSiteLocale, setServerLocale, setSiteLocale };
})();
