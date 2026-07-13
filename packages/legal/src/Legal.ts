import type { Locale } from "@snappy/intl";

import privacyEn from "../content/privacy.en.html?raw";
import privacyRu from "../content/privacy.ru.html?raw";
import termsEn from "../content/terms.en.html?raw";
import termsRu from "../content/terms.ru.html?raw";

export type LegalVariant = `privacy` | `terms`;

const content = { privacy: { en: privacyEn, ru: privacyRu }, terms: { en: termsEn, ru: termsRu } } as const;
const body = (variant: LegalVariant, locale: Locale) => content[variant][locale];

export const Legal = { body };
