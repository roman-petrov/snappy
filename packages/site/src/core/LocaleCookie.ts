export type SiteLocaleKey = `en` | `ru`;

const name = `snappy-locale`;

const parse = (cookieString: string | undefined): SiteLocaleKey => {
  if (cookieString === undefined) {
    return `ru`;
  }

  const match = cookieString
    .split(`;`)
    .map(s => s.trim())
    .find(s => s.startsWith(`${name}=`));

  const value = match?.split(`=`)[1];

  return value === `en` || value === `ru` ? value : `ru`;
};

export const LocaleCookie = { name, parse };
