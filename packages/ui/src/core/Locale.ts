/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
import { effect } from "@preact/signals";

import { $locale } from "../Store";

export const locales = [`en`, `ru`] as const;

export type Locale = (typeof locales)[number];

const apply = (locale: Locale) => (document.documentElement.lang = locale);

const init = (options?: { locale?: Locale; onLocaleChange?: (locale: Locale) => void; onRemount?: () => void }) => {
  if (options?.locale !== undefined) {
    $locale.value = options.locale;
  }
  let previous = $locale.value;
  effect(() => {
    const current = $locale.value;
    apply(current);
    if (current !== previous) {
      options?.onLocaleChange?.(current);
      options?.onRemount?.();
      previous = current;
    }
  });
  apply($locale.value);
};

const toggle = () => {
  $locale.value = $locale.value === `ru` ? `en` : `ru`;
};

export const Locale = { init, toggle };
