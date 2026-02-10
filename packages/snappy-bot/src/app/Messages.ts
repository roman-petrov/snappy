/* eslint-disable functional/no-expression-statements */
import type { Bot } from "gramio";

import type { UserTexts } from "./UserTexts";

import { Keyboards } from "./Keyboards";
import { Locale, t } from "./Locale";

const register = (bot: Bot, userTexts: UserTexts) => {
  bot.on(`message`, async context => {
    const userId = context.from.id;
    const { text } = context;

    if (text === undefined || text === ``) {
      return;
    }

    if (text.startsWith(`/`)) {
      return;
    }

    const localeKey = Locale.userLanguage(context.from.languageCode);

    userTexts.set(userId, text);

    await context.send(t(localeKey, `features.choose`), { reply_markup: Keyboards.featuresKeyboard(localeKey) });
  });
};

export const Messages = { register };
