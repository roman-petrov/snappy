import { InlineKeyboard } from "gramio";

import { AppConfiguration } from "../AppConfiguration";
import { type Locale, t } from "../locales";
import { type FeatureType, systemPrompts } from "../prompts";

const featurePrefix = `feature:`;
const featureCallbackData = (feature: FeatureType) => `${featurePrefix}${feature}`;

export const featuresKeyboard = (localeKey: Locale) =>
  new InlineKeyboard()
    .text(t(localeKey, `features.styleBusiness`), featureCallbackData(`styleBusiness`))
    .text(t(localeKey, `features.styleFriendly`), featureCallbackData(`styleFriendly`))
    .row()
    .text(t(localeKey, `features.styleHumorous`), featureCallbackData(`styleHumorous`))
    .text(t(localeKey, `features.styleSelling`), featureCallbackData(`styleSelling`))
    .row()
    .text(t(localeKey, `features.styleNeutral`), featureCallbackData(`styleNeutral`))
    .text(t(localeKey, `features.fixErrors`), featureCallbackData(`fixErrors`))
    .row()
    .text(t(localeKey, `features.addEmoji`), featureCallbackData(`addEmoji`))
    .text(t(localeKey, `features.shorten`), featureCallbackData(`shorten`))
    .row()
    .text(t(localeKey, `features.expand`), featureCallbackData(`expand`))
    .text(t(localeKey, `features.improveReadability`), featureCallbackData(`improveReadability`));

export const premiumKeyboard = (localeKey: Locale) =>
  new InlineKeyboard().text(
    t(localeKey, `commands.premium.button`, { price: AppConfiguration.premiumPrice }),
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

export const Keyboards = { featuresKeyboard, parseFeatureCallback, premiumKeyboard };
