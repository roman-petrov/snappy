/* eslint-disable no-console */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import type { Bot } from "gramio";

import type { Storage } from "./Storage";
import type { UserTexts } from "./UserTexts";

import { Keyboards } from "./Keyboards";
import { Locale, t } from "./Locale";

export type CallbacksConfig = {
  freeRequestLimit: number;
  premiumPrice: number;
  storage: Storage;
  userTexts: UserTexts;
};

const register = (bot: Bot, config: CallbacksConfig) => {
  bot.on(`callback_query`, async context => {
    const telegramId = context.from.id;
    const telegramUsername = context.from.username;
    const localeKey = Locale.userLanguage(context.from.languageCode);
    const { data } = context;

    if (!data) {
      await context.answerCallbackQuery();

      return;
    }

    if (data === `premium:buy`) {
      try {
        const url = await config.storage.paymentUrl(telegramId);
        await context.answerCallbackQuery();
        await context.send(`💳 ${url}`);
      } catch (error) {
        console.error(`Payment error:`, error);
        await context.answerCallbackQuery();
        await context.send(t(localeKey, `commands.premium.error`));
      }

      return;
    }

    const feature = Keyboards.parseFeatureCallback(data);
    if (feature !== undefined) {
      await context.answerCallbackQuery();

      if (!(await config.storage.canMakeRequest(telegramId, config.freeRequestLimit, telegramUsername))) {
        await context.send(t(localeKey, `features.limit`));

        return;
      }

      const text = config.userTexts.get(telegramId);
      if (text === undefined || text === ``) {
        await context.send(t(localeKey, `features.error`));

        return;
      }

      await context.send(t(localeKey, `features.processing`));

      try {
        const processedText = await config.storage.process(telegramId, text, feature, telegramUsername);

        await context.send(t(localeKey, `features.result`, { text: processedText }));

        config.userTexts.clear(telegramId);
      } catch (error) {
        console.error(`GigaChat processing error:`, error);
        await context.send(t(localeKey, `features.error`));
      }

      return;
    }

    await context.answerCallbackQuery();
  });
};

export const Callbacks = { register };
