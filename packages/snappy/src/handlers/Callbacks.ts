/* eslint-disable no-console */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import type { Bot } from "gramio";

import { parseFeatureCallback } from "../keyboards";
import { t } from "../locales";
import { createPremiumPayment, gigaChatService } from "../services";
import { canMakeRequest, getUserLanguage, incrementRequestCount } from "../storage";
import { clearUserText, getUserText } from "./Messages";

export const registerCallbackHandlers = (bot: Bot) => {
  bot.on(`callback_query`, async context => {
    const userId = context.from.id;
    const locale = getUserLanguage(context.from.languageCode);
    const { data } = context;

    if (!data) {
      await context.answerCallbackQuery();

      return;
    }

    if (data === `premium:buy`) {
      try {
        const paymentUrl = await createPremiumPayment(userId);
        await context.answerCallbackQuery();
        await context.send(`💳 ${paymentUrl}`);
      } catch (error) {
        console.error(`Payment error:`, error);
        await context.answerCallbackQuery();
        await context.send(t(locale, `commands.premium.error`));
      }

      return;
    }

    const feature = parseFeatureCallback(data);
    if (feature !== undefined) {
      await context.answerCallbackQuery();

      if (!canMakeRequest(userId)) {
        await context.send(t(locale, `features.limit`));

        return;
      }

      const userText = getUserText(userId);
      if (userText === undefined || userText === ``) {
        await context.send(t(locale, `features.error`));

        return;
      }

      await context.send(t(locale, `features.processing`));

      try {
        const processedText = await gigaChatService.processText(userText, feature);

        incrementRequestCount(userId);

        await context.send(t(locale, `features.result`, { text: processedText }));

        clearUserText(userId);
      } catch (error) {
        console.error(`GigaChat processing error:`, error);
        await context.send(t(locale, `features.error`));
      }

      return;
    }

    await context.answerCallbackQuery();
  });
};

export const Callbacks = { registerCallbackHandlers };
