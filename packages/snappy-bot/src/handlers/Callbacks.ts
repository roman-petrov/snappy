/* eslint-disable no-console */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import type { Snappy } from "@snappy/snappy";
import type { Bot } from "gramio";

import type { SnappyBotConfig } from "../SnappyBot";

import { Keyboards } from "../keyboards";
import { t } from "../locales";
import { Payment } from "../services";
import { Storage } from "../storage";
import { Messages } from "./Messages";

const registerHandlers = (bot: Bot, snappy: Snappy, config: SnappyBotConfig) => {
  bot.on(`callback_query`, async context => {
    const userId = context.from.id;
    const localeKey = Storage.userLanguage(context.from.languageCode);
    const { data } = context;

    if (!data) {
      await context.answerCallbackQuery();

      return;
    }

    if (data === `premium:buy`) {
      try {
        const paymentUrl = await Payment.premiumPaymentUrl(userId, config);
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

      if (!Storage.canMakeRequest(userId, config)) {
        await context.send(t(localeKey, `features.limit`));

        return;
      }

      const text = Messages.userText(userId);
      if (text === undefined || text === ``) {
        await context.send(t(localeKey, `features.error`));

        return;
      }

      await context.send(t(localeKey, `features.processing`));

      try {
        const processedText = await snappy.processText(text, feature);

        Storage.incrementRequestCount(userId);

        await context.send(t(localeKey, `features.result`, { text: processedText }));

        Messages.clearUserText(userId);
      } catch (error) {
        console.error(`GigaChat processing error:`, error);
        await context.send(t(localeKey, `features.error`));
      }

      return;
    }

    await context.answerCallbackQuery();
  });
};

export const Callbacks = { registerHandlers };
