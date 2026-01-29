import type { Bot } from "gramio";
import { t } from "../locales/index";
import { getUserLanguage } from "../storage/index";
import { createFeaturesKeyboard } from "../keyboards/index";

// Временное хранилище текстов пользователей (in-memory)
const userTexts = new Map<number, string>();

export const registerMessageHandlers = (bot: Bot) => {
  bot.on(`message`, async context => {
    const userId = context.from?.id;
    const text = context.text;

    if (!userId || !text) return;

    // Игнорируем команды
    if (text.startsWith(`/`)) return;

    const locale = getUserLanguage(userId);

    // Сохраняем текст пользователя
    userTexts.set(userId, text);

    // Показываем клавиатуру с функциями
    await context.send(t(locale, `features.choose`), { reply_markup: createFeaturesKeyboard(locale) });
  });
};

export const getUserText = (userId: number): string | undefined => {
  return userTexts.get(userId);
};

export const clearUserText = (userId: number): void => {
  userTexts.delete(userId);
};

// Очистка старых текстов (запускается периодически)
const cleanupOldTexts = () => {
  /* В простой реализации очищаем все тексты старше 1 часа
     Для этого нужно хранить timestamp, но в MVP можем просто периодически очищать всё */
  if (userTexts.size > 1000) {
    userTexts.clear();
  }
};

setInterval(cleanupOldTexts, 60 * 60 * 1000); // Каждый час
