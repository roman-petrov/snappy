import { InlineKeyboard } from "gramio";

import { AppConfiguration } from "../AppConfiguration";
import { type Locale, t } from "../locales";
import { type FeatureType, systemPrompts } from "../prompts";

const featurePrefix = `feature:`;
const createFeatureCallback = (feature: FeatureType) => `${featurePrefix}${feature}`;

export const createFeaturesKeyboard = (locale: Locale) =>
  new InlineKeyboard()
    .text(t(locale, `features.styleBusiness`), createFeatureCallback(`styleBusiness`))
    .text(t(locale, `features.styleFriendly`), createFeatureCallback(`styleFriendly`))
    .row()
    .text(t(locale, `features.styleHumorous`), createFeatureCallback(`styleHumorous`))
    .text(t(locale, `features.styleSelling`), createFeatureCallback(`styleSelling`))
    .row()
    .text(t(locale, `features.styleNeutral`), createFeatureCallback(`styleNeutral`))
    .text(t(locale, `features.fixErrors`), createFeatureCallback(`fixErrors`))
    .row()
    .text(t(locale, `features.addEmoji`), createFeatureCallback(`addEmoji`))
    .text(t(locale, `features.shorten`), createFeatureCallback(`shorten`))
    .row()
    .text(t(locale, `features.expand`), createFeatureCallback(`expand`))
    .text(t(locale, `features.improveReadability`), createFeatureCallback(`improveReadability`));

export const createPremiumKeyboard = (locale: Locale) =>
  new InlineKeyboard().text(
    t(locale, `commands.premium.button`, { price: AppConfiguration.premiumPrice }),
    `premium:buy`,
  );

export const parseFeatureCallback = (data: string): FeatureType | undefined => {
  if (!data.startsWith(featurePrefix)) {
    return undefined;
  }

  const key = data.slice(featurePrefix.length);
  const isFeature = (keyString: string): keyString is FeatureType => keyString in systemPrompts;

  return isFeature(key) ? key : undefined;
};

export const Keyboards = { createFeaturesKeyboard, createPremiumKeyboard, parseFeatureCallback };
