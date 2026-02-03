/* eslint-disable no-console */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import type { Bot } from "gramio";

import { parseFeatureCallback } from "../keyboards";
import { t } from "../locales";
import { gigaChatService, premiumPaymentUrl } from "../services";
import { canMakeRequest, incrementRequestCount, userLanguage } from "../storage";
import { clearUserText, userText } from "./Messages";

export const registerCallbackHandlers = (bot: Bot) => {
  bot.on(`callback_query`, async context => {
    const userId = context.from.id;
    const localeKey = userLanguage(context.from.languageCode);
    const { data } = context;

    if (!data) {
      await context.answerCallbackQuery();

      return;
    }

    if (data === `premium:buy`) {
      try {
        const paymentUrl = await premiumPaymentUrl(userId);
        await context.answerCallbackQuery();
        await context.send(`💳 ${paymentUrl}`);
      } catch (error) {
        console.error(`Payment error:`, error);
        await context.answerCallbackQuery();
        await context.send(t(localeKey, `commands.premium.error`));
      }

      return;
    }

    const feature = parseFeatureCallback(data);
    if (feature !== undefined) {
      await context.answerCallbackQuery();

      if (!canMakeRequest(userId)) {
        await context.send(t(localeKey, `features.limit`));

        return;
      }

      const text = userText(userId);
      if (text === undefined || text === ``) {
        await context.send(t(localeKey, `features.error`));

        return;
      }

      await context.send(t(localeKey, `features.processing`));

      try {
        const processedText = await gigaChatService.processText(text, feature);

        incrementRequestCount(userId);

        await context.send(t(localeKey, `features.result`, { text: processedText }));

        clearUserText(userId);
      } catch (error) {
        console.error(`GigaChat processing error:`, error);
        await context.send(t(localeKey, `features.error`));
      }

      return;
    }

    await context.answerCallbackQuery();
  });
};

export const Callbacks = { registerCallbackHandlers };
