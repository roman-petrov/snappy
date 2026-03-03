export type SiteLocaleKey = `en` | `ru`;

export const cookieName = `snappy-locale`;

const parseLocaleFromCookie = (cookieString: string | undefined): SiteLocaleKey => {
  if (cookieString === undefined) {
    return `ru`;
  }

  const match = cookieString
    .split(`;`)
    .map(s => s.trim())
    .find(s => s.startsWith(`${cookieName}=`));

  const value = match?.split(`=`)[1];

  return value === `en` || value === `ru` ? value : `ru`;
};

export const LocaleCookie = { cookieName, parseLocaleFromCookie };
