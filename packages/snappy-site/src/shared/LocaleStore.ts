const STORAGE_KEY = `snappy-locale`;

export type LocaleKey = `en` | `ru`;

const readStored = (): LocaleKey => {
  if (typeof localStorage === `undefined`) {
    return `ru`;
  }
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored === `en` || stored === `ru` ? stored : `ru`;
};

let current: LocaleKey = readStored();

export const getLocale = (): LocaleKey => current;

export const setCurrentLocale = (next: LocaleKey): void => {
  current = next;
};
