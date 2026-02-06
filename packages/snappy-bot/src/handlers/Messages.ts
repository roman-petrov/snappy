/* jscpd:ignore-start */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/immutable-data */
import type { Bot } from "gramio";

import { Time } from "@snappy/core";

import { Keyboards } from "../keyboards";
import { t } from "../locales";
import { Storage } from "../storage";

const userTexts = new Map<number, string>();

const registerHandlers = (bot: Bot) => {
  bot.on(`message`, async context => {
    const userId = context.from.id;
    const { text } = context;

    if (text === undefined || text === ``) {
      return;
    }

    if (text.startsWith(`/`)) {
      return;
    }

    const localeKey = Storage.userLanguage(context.from.languageCode);

    userTexts.set(userId, text);

    await context.send(t(localeKey, `features.choose`), { reply_markup: Keyboards.featuresKeyboard(localeKey) });
  });
};

const userText = (userId: number) => userTexts.get(userId);

const clearUserText = (userId: number) => {
  userTexts.delete(userId);
};

const maxTextCount = 1000;

const cleanupOldTexts = (): void => {
  if (userTexts.size > maxTextCount) {
    userTexts.clear();
  }
};

setInterval(cleanupOldTexts, Time.hourInMs);

export const Messages = { clearUserText, registerHandlers, userText };
/* jscpd:ignore-end */
