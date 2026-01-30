import { InlineKeyboard } from "gramio";

import { Config } from "../Config";
import { type Locale, t } from "../locales";

export const createFeaturesKeyboard = (locale: Locale) =>
  new InlineKeyboard()
    .text(t(locale, `features.styleBusiness`), `feature:styleBusiness`)
    .text(t(locale, `features.styleFriendly`), `feature:styleFriendly`)
    .row()
    .text(t(locale, `features.styleHumorous`), `feature:styleHumorous`)
    .text(t(locale, `features.styleSelling`), `feature:styleSelling`)
    .row()
    .text(t(locale, `features.styleNeutral`), `feature:styleNeutral`)
    .text(t(locale, `features.fixErrors`), `feature:fixErrors`)
    .row()
    .text(t(locale, `features.addEmoji`), `feature:addEmoji`)
    .text(t(locale, `features.shorten`), `feature:shorten`)
    .row()
    .text(t(locale, `features.expand`), `feature:expand`)
    .text(t(locale, `features.improveReadability`), `feature:improveReadability`);

export const createPremiumKeyboard = (locale: Locale) =>
  new InlineKeyboard().text(t(locale, `commands.premium.button`, { price: Config.PREMIUM_PRICE }), `premium:buy`);

export const parseFeatureCallback = (data: string) => {
  if (!data.startsWith(`feature:`)) {
    return undefined;
  }

  const feature = data.replace(`feature:`, ``);

  if (
    feature === `addEmoji` ||
    feature === `expand` ||
    feature === `fixErrors` ||
    feature === `improveReadability` ||
    feature === `shorten` ||
    feature === `styleBusiness` ||
    feature === `styleFriendly` ||
    feature === `styleHumorous` ||
    feature === `styleNeutral` ||
    feature === `styleSelling`
  ) {
    return feature;
  }

  return undefined;
};

