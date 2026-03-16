/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable id-length */
/* eslint-disable init-declarations */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-expression-statements */
let currentLocale: string | undefined;

const normalizeLocale = (raw: string): string => {
  const trimmed = raw.trim();
  if (trimmed === ``) {
    return `en-US`;
  }
  const key = trimmed.replaceAll(`_`, `-`).toLowerCase();
  if (key === `en` || key === `en-us`) {
    return `en-US`;
  }
  if (key === `ru` || key === `ru-ru`) {
    return `ru-RU`;
  }

  return trimmed;
};

const setLocale = (value: string) => {
  currentLocale = normalizeLocale(value);
};

const getLocale = (): string => normalizeLocale(currentLocale ?? `en-US`);
const resolveLocale = (locale?: string) => (locale === undefined ? getLocale() : normalizeLocale(locale));
const dateFormats = { default: { dateStyle: `short` } } as const;
const numberFormats = { default: {} } as const;
const priceFormats = { default: { currency: `RUB`, style: `currency` } } as const;

const timeFormats = {
  default: { hour: `2-digit`, minute: `2-digit` },
  hms: { hour: `2-digit`, hour12: false, minute: `2-digit`, second: `2-digit`, timeZone: `UTC` },
} as const;

export type DateFormat = keyof typeof dateFormats;

export type NumberFormat = keyof typeof numberFormats;

export type PriceFormat = keyof typeof priceFormats;

export type TimeFormat = keyof typeof timeFormats;

const date = (value: number, format: DateFormat = `default`, locale?: string) =>
  new Intl.DateTimeFormat(resolveLocale(locale), dateFormats[format]).format(value);

const time = (value: number, format: TimeFormat = `default`, locale?: string): string =>
  new Intl.DateTimeFormat(resolveLocale(locale), timeFormats[format]).format(value);

const number = (value: number, format: NumberFormat = `default`, locale?: string) =>
  new Intl.NumberFormat(resolveLocale(locale), numberFormats[format]).format(value);

const price = (value: number, format: PriceFormat = `default`, locale?: string) =>
  new Intl.NumberFormat(resolveLocale(locale), priceFormats[format]).format(value);

export const i = { date, getLocale, number, price, setLocale, time };
