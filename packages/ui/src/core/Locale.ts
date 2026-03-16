/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
import { i } from "@snappy/intl";

import { $locale } from "../Store";

const locales = [`en`, `ru`, `system`] as const;
const key = `snappy-locale`;

export type Locale = (typeof locales)[number];

export type ResolvedLocale = `en` | `ru`;

const resolvedFromSystem = () =>
  typeof navigator !== `undefined` && navigator.language.startsWith(`ru`) ? `ru` : `en`;

const effective = (): ResolvedLocale => {
  const v = $locale();

  return v === `system` ? resolvedFromSystem() : v;
};

const resolve = (value: Locale | undefined) => (value === `en` || value === `ru` ? value : `ru`);

const apply = () => {
  document.documentElement.lang = effective();
};

const init = (options?: { onRemount?: () => void }) => {
  let previous: ResolvedLocale = effective();
  $locale.subscribe(() => {
    const current = effective();
    i.setLocale(current);
    apply();
    if (current !== previous) {
      options?.onRemount?.();
      previous = current;
    }
  });
  i.setLocale(effective());
  apply();
};

const toggle = () => {
  $locale.set(effective() === `ru` ? `en` : `ru`);
};

export const Locale = { effective, init, key, resolve, toggle, values: locales };
