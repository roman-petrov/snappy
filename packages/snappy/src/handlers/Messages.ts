/* jscpd:ignore-start */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
import type { Bot } from "gramio";

import { Time } from "../core/Time";
import { createFeaturesKeyboard } from "../keyboards";
import { t } from "../locales";
import { getUserLanguage } from "../storage";

const userTexts = new Map<number, string>();

export const registerMessageHandlers = (bot: Bot) => {
  bot.on(`message`, async context => {
    const userId = context.from.id;
    const { text } = context;

    if (text === undefined || text === ``) {
      return;
    }

    if (text.startsWith(`/`)) {
      return;
    }

    const locale = getUserLanguage(context.from.languageCode);

    userTexts.set(userId, text);

    // Показываем клавиатуру с функциями
    await context.send(t(locale, `features.choose`), { reply_markup: createFeaturesKeyboard(locale) });
  });
};

export const getUserText = (userId: number): string | undefined => userTexts.get(userId);

export const clearUserText = (userId: number): void => {
  userTexts.delete(userId);
};

const maxTextCount = 1000;

const cleanupOldTexts = (): void => {
  if (userTexts.size > maxTextCount) {
    userTexts.clear();
  }
};

setInterval(cleanupOldTexts, Time.hourInMs);

export const Messages = { clearUserText, getUserText, registerMessageHandlers };
