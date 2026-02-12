const STORAGE_KEY = `snappy-locale`;

export type LocaleKey = `en` | `ru`;

const readStored = (): LocaleKey => {
  if (typeof localStorage === `undefined`) return `ru`;
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === `en` || stored === `ru` ? stored : `ru`;
};

const getLocale = (): LocaleKey => {
  const locale = readStored();
  if (typeof document !== `undefined`) document.documentElement.lang = locale;
  return locale;
};

const setLocale = (next: LocaleKey): void => {
  localStorage.setItem(STORAGE_KEY, next);
  if (typeof document !== `undefined`) {
    document.documentElement.lang = next;
    location.reload();
  }
};

export const LocaleStore = { getLocale, setLocale };
