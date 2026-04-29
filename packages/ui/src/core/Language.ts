/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
import { i, type Locale } from "@snappy/intl";

import { $locale } from "../Store";

const values = [`en`, `ru`, `system`] as const;
const key = `snappy-locale`;

export type Language = `system` | Locale;

const resolvedFromSystem = () =>
  typeof navigator !== `undefined` && navigator.language.startsWith(`ru`) ? `ru` : `en`;

const locale = () => {
  const v = $locale();

  return v === `system` ? resolvedFromSystem() : v;
};

const resolve = (value: Language | undefined) => (value === `en` || value === `ru` ? value : `ru`);

const apply = () => {
  document.documentElement.lang = locale();
};

const init = (options?: { onRemount?: () => void }) => {
  let previous: Locale = locale();
  $locale.subscribe(() => {
    const current = locale();
    i.setLocale(current);
    apply();
    if (current !== previous) {
      options?.onRemount?.();
      previous = current;
    }
  });
  i.setLocale(locale());
  apply();
};

const toggle = () => {
  $locale.set(locale() === `ru` ? `en` : `ru`);
};

export const Language = { init, key, locale, resolve, toggle, values };
