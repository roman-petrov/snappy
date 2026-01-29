/* eslint-disable no-console */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
import type { Bot } from "gramio";

import { parseFeatureCallback, parseLanguageCallback } from "../keyboards";
import { t } from "../locales";
import { createPremiumPayment, gigaChatService } from "../services";
import { canMakeRequest, getUserLanguage, incrementRequestCount, setUserLanguage } from "../storage";
import { clearUserText, getUserText } from "./Messages";

export const registerCallbackHandlers = (bot: Bot) => {
  bot.on(`callback_query`, async context => {
    const userId = context.from.id;
    const { data } = context;

    if (!data) {
      await context.answerCallbackQuery();

      return;
    }

    // Обработка выбора языка
    const locale = getUserLanguage(userId);
    const selectedLanguage = parseLanguageCallback(data);
    if (selectedLanguage) {
      setUserLanguage(userId, selectedLanguage);
      await context.answerCallbackQuery();
      await context.send(t(selectedLanguage, `commands.language.changed`));

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

    // Обработка выбора функции улучшения
    const feature = parseFeatureCallback(data);
    if (feature) {
      await context.answerCallbackQuery();

      // Проверяем лимит запросов
      if (!canMakeRequest(userId)) {
        await context.send(t(locale, `features.limit`));

        return;
      }

      // Получаем сохраненный текст пользователя
      const userText = getUserText(userId);
      if (userText === undefined || userText === ``) {
        await context.send(t(locale, `features.error`));

        return;
      }

      // Показываем статус обработки
      await context.send(t(locale, `features.processing`));

      try {
        // Обрабатываем текст через GigaChat
        const processedText = await gigaChatService.processText(userText, feature);

        // Увеличиваем счетчик запросов
        incrementRequestCount(userId);

        // Отправляем результат
        await context.send(t(locale, `features.result`, { text: processedText }));

        // Очищаем сохраненный текст
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
