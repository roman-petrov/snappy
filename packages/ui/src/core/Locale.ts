/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { $locale } from "../Store";

export const locales = [`en`, `ru`] as const;

export type Locale = (typeof locales)[number];

const apply = (locale: Locale) => (document.documentElement.lang = locale);

const init = (options?: { locale?: Locale; onLocaleChange?: (locale: Locale) => void; onRemount?: () => void }) => {
  if (options?.locale !== undefined) {
    $locale.set(options.locale);
  }
  $locale.subscribe((current, previous) => {
    apply(current);
    if (current === previous) {
      return;
    }
    options?.onLocaleChange?.(current);
    options?.onRemount?.();
  });
  apply($locale());
};

const toggle = () => $locale.set($locale() === `ru` ? `en` : `ru`);

export const Locale = { init, toggle };
