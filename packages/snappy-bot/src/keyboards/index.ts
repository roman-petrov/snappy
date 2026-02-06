import { type FeatureType, Prompts } from "@snappy/snappy";
import { InlineKeyboard } from "gramio";

import { type Locale, t } from "../locales";

const featurePrefix = `feature:`;
const featureCallbackData = (feature: FeatureType) => `${featurePrefix}${feature}`;

const featuresKeyboard = (localeKey: Locale) =>
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

const premiumKeyboard = (localeKey: Locale, premiumPrice: number) =>
  new InlineKeyboard().text(t(localeKey, `commands.premium.button`, { price: premiumPrice }), `premium:buy`);

const parseFeatureCallback = (data: string) => {
  if (!data.startsWith(featurePrefix)) {
    return undefined;
  }

  const key = data.slice(featurePrefix.length);
  const isFeature = (keyString: string): keyString is FeatureType => keyString in Prompts.systemPrompts;

  return isFeature(key) ? key : undefined;
};

export const Keyboards = { featuresKeyboard, parseFeatureCallback, premiumKeyboard };
