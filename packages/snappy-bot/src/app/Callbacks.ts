/* eslint-disable no-console */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import type { Snappy } from "@snappy/snappy";
import type { YooKassa } from "@snappy/yoo-kassa";
import type { Bot } from "gramio";

import type { Storage } from "./Storage";

import { Keyboards } from "./Keyboards";
import { Locales, t } from "./locales";

export type CallbacksConfig = { freeRequestLimit: number; premiumPrice: number; storage: Storage; yooKassa: YooKassa };

const register = (bot: Bot, snappy: Snappy, config: CallbacksConfig) => {
  bot.on(`callback_query`, async context => {
    const userId = context.from.id;
    const localeKey = Locales.userLanguage(context.from.languageCode);
    const { data } = context;

    if (!data) {
      await context.answerCallbackQuery();

      return;
    }

    if (data === `premium:buy`) {
      try {
        const paymentUrl = await config.yooKassa.paymentUrl(
          userId,
          config.premiumPrice,
          `Snappy Bot - Premium подписка (30 дней)`,
        );
        await context.answerCallbackQuery();
        await context.send(`💳 ${paymentUrl}`);
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

      if (!config.storage.canMakeRequest(userId, config.freeRequestLimit)) {
        await context.send(t(localeKey, `features.limit`));

        return;
      }

      const text = config.storage.userText(userId);
      if (text === undefined || text === ``) {
        await context.send(t(localeKey, `features.error`));

        return;
      }

      await context.send(t(localeKey, `features.processing`));

      try {
        const processedText = await snappy.processText(text, feature);

        config.storage.incrementRequestCount(userId);

        await context.send(t(localeKey, `features.result`, { text: processedText }));

        config.storage.clearUserText(userId);
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
