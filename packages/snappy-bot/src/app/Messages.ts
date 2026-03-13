/* eslint-disable functional/no-expression-statements */
import type { ServerApi } from "@snappy/server-api";
import type { Bot } from "gramio";

import type { UserSessionsType } from "./UserSessions";

import { Keyboards } from "./Keyboards";
import { Locale, t } from "./Locale";

export type MessagesConfig = { api: ServerApi; userSessions: UserSessionsType };

const register = (bot: Bot, { api, userSessions }: MessagesConfig) => {
  bot.on(`message`, async context => {
    const userId = context.from.id;
    const { text } = context;

    if (text === undefined || text === ``) {
      return;
    }

    if (text.startsWith(`/`)) {
      return;
    }

    const localeKey = Locale.userLanguage(context.from.languageCode);
    const remainingResult = await api.remaining(userId);
    if (remainingResult.remaining <= 0) {
      await context.send(t(localeKey, `features.limit`));

      return;
    }

    userSessions.set(userId, { options: remainingResult.options, text });

    await context.send(t(localeKey, `features.choose`), {
      reply_markup: Keyboards.optionsKeyboard(localeKey, remainingResult.options),
    });
  });
};

export const Messages = { register };
