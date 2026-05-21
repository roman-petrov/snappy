/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
import type { Language as CoreLanguage } from "@snappy/ui-core";

import { i, type Locale } from "@snappy/intl";

import { $locale } from "../Store";

export type Language = CoreLanguage;

const values = [`en`, `ru`, `system`] as const;

const resolvedFromSystem = () =>
  typeof navigator !== `undefined` && navigator.language.startsWith(`ru`) ? `ru` : `en`;

const locale = () => {
  const v = $locale();

  return v === `system` ? resolvedFromSystem() : v;
};

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

export const Language = { init, locale, toggle, values };
