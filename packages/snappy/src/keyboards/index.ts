import { InlineKeyboard } from "gramio";

import type { FeatureType } from "../prompts";

import { config } from "../config";
import { type Locale, t } from "../locales";

export const createFeaturesKeyboard = (locale: Locale) =>
  new InlineKeyboard()
    .text(t(locale, `features.style_business`), `feature:style_business`)
    .text(t(locale, `features.style_friendly`), `feature:style_friendly`)
    .row()
    .text(t(locale, `features.style_humorous`), `feature:style_humorous`)
    .text(t(locale, `features.style_selling`), `feature:style_selling`)
    .row()
    .text(t(locale, `features.style_neutral`), `feature:style_neutral`)
    .text(t(locale, `features.fix_errors`), `feature:fix_errors`)
    .row()
    .text(t(locale, `features.add_emoji`), `feature:add_emoji`)
    .text(t(locale, `features.shorten`), `feature:shorten`)
    .row()
    .text(t(locale, `features.expand`), `feature:expand`)
    .text(t(locale, `features.improve_readability`), `feature:improve_readability`);

export const createLanguageKeyboard = () =>
  new InlineKeyboard().text(`🇷🇺 Русский`, `lang:ru`).text(`🇬🇧 English`, `lang:en`);

export const createPremiumKeyboard = (locale: Locale) =>
  new InlineKeyboard().text(t(locale, `commands.premium.button`, { price: config.PREMIUM_PRICE }), `premium:buy`);

export const parseFeatureCallback = (data: string): FeatureType | null => {
  if (!data.startsWith(`feature:`)) {
    return null;
  }

  return data.replace(`feature:`, ``) as FeatureType;
};

export const parseLanguageCallback = (data: string): Locale | null => {
  if (!data.startsWith(`lang:`)) {
    return null;
  }

  const lang = data.replace(`lang:`, ``);

  return lang === `ru` || lang === `en` ? lang : null;
};
