import type { Bot } from 'gramio';
import { t } from '../locales/index';
import {
  getUserLanguage,
  setUserLanguage,
  canMakeRequest,
  incrementRequestCount,
} from '../storage/index';
import {
  parseFeatureCallback,
  parseLanguageCallback,
} from '../keyboards/index';
import { getUserText, clearUserText } from './messages';
import { gigaChatService } from '../services/gigachat';
import { createPremiumPayment } from '../services/payment';

export const registerCallbackHandlers = (bot: Bot) => {
  bot.on('callback_query', async (context) => {
    const userId = context.from?.id;
    const data = context.data;

    if (!userId || !data) {
      await context.answerCallbackQuery();
      return;
    }

    const locale = getUserLanguage(userId);

    // Обработка выбора языка
    const selectedLanguage = parseLanguageCallback(data);
    if (selectedLanguage) {
      setUserLanguage(userId, selectedLanguage);
      await context.answerCallbackQuery();
      await context.send(t(selectedLanguage, 'commands.language.changed'));
      return;
    }

    // Обработка покупки премиума
    if (data === 'premium:buy') {
      try {
        const paymentUrl = await createPremiumPayment(userId);
        await context.answerCallbackQuery();
        await context.send(`💳 ${paymentUrl}`);
      } catch (error) {
        console.error('Payment error:', error);
        await context.answerCallbackQuery();
        await context.send(t(locale, 'commands.premium.error'));
      }
      return;
    }

    // Обработка выбора функции улучшения
    const feature = parseFeatureCallback(data);
    if (feature) {
      await context.answerCallbackQuery();

      // Проверяем лимит запросов
      if (!canMakeRequest(userId)) {
        await context.send(t(locale, 'features.limit'));
        return;
      }

      // Получаем сохраненный текст пользователя
      const userText = getUserText(userId);
      if (!userText) {
        await context.send(t(locale, 'features.error'));
        return;
      }

      // Показываем статус обработки
      await context.send(t(locale, 'features.processing'));

      try {
        // Обрабатываем текст через GigaChat
        const processedText = await gigaChatService.processText(userText, feature);

        // Увеличиваем счетчик запросов
        incrementRequestCount(userId);

        // Отправляем результат
        await context.send(t(locale, 'features.result', { text: processedText }));

        // Очищаем сохраненный текст
        clearUserText(userId);
      } catch (error) {
        console.error('GigaChat processing error:', error);
        await context.send(t(locale, 'features.error'));
      }

      return;
    }

    await context.answerCallbackQuery();
  });
};
