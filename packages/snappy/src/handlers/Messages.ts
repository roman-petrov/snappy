/* jscpd:ignore-start */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
import type { Bot } from "gramio";

import { Time } from "../core/Time";
import { createFeaturesKeyboard } from "../keyboards";
import { t } from "../locales";
import { getUserLanguage } from "../storage";

// Временное хранилище текстов пользователей (in-memory)
const userTexts = new Map<number, string>();

export const registerMessageHandlers = (bot: Bot) => {
  bot.on(`message`, async context => {
    const userId = context.from.id;
    const { text } = context;

    if (text === undefined || text === ``) {
      return;
    }

    // Игнорируем команды
    if (text.startsWith(`/`)) {
      return;
    }

    const locale = getUserLanguage(userId);

    // Сохраняем текст пользователя
    userTexts.set(userId, text);

    // Показываем клавиатуру с функциями
    await context.send(t(locale, `features.choose`), { reply_markup: createFeaturesKeyboard(locale) });
  });
};

export const getUserText = (userId: number): string | undefined => userTexts.get(userId);

export const clearUserText = (userId: number): void => {
  userTexts.delete(userId);
};

// Очистка старых текстов (запускается периодически)
const maxTextCount = 1000;

const cleanupOldTexts = (): void => {
  /* В простой реализации очищаем все тексты старше 1 часа
     Для этого нужно хранить timestamp, но в MVP можем просто периодически очищать всё */
  if (userTexts.size > maxTextCount) {
    userTexts.clear();
  }
};

// Каждый час
setInterval(cleanupOldTexts, Time.hourInMs);
