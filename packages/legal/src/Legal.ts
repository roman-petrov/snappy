import { i, type Locale } from "@snappy/intl";

import privacyEn from "../content/privacy.en.html?raw";
import privacyRu from "../content/privacy.ru.html?raw";
import termsEn from "../content/terms.en.html?raw";
import termsRu from "../content/terms.ru.html?raw";

export type LegalVariant = `privacy` | `terms`;

const content = { privacy: { en: privacyEn, ru: privacyRu }, terms: { en: termsEn, ru: termsRu } } as const;
const updated = { privacy: `2026-07-03`, terms: `2026-07-22` } as const;

const updatedAt = (variant: LegalVariant, locale: Locale) => {
  const iso = updated[variant];
  const stamp = Date.parse(`${iso}T12:00:00`);

  return `<time datetime="${iso}">${i.date(stamp, `long`, locale)}</time>`;
};

const body = (variant: LegalVariant, locale: Locale) =>
  content[variant][locale].replaceAll(`{UPDATED_AT}`, updatedAt(variant, locale));

export const Legal = { body };
