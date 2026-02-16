/* eslint-disable functional/no-expression-statements */

import type { ServerApi } from "@snappy/server-api";
import type { Bot } from "gramio";

import type { UserTexts } from "./UserTexts";

import { Keyboards } from "./Keyboards";
import { Locale, t } from "./Locale";

export type CallbacksConfig = { api: ServerApi; userTexts: UserTexts };

const register = (bot: Bot, config: CallbacksConfig) => {
  bot.on(`callback_query`, async context => {
    const telegramId = context.from.id;
    const localeKey = Locale.userLanguage(context.from.languageCode);
    const { data } = context;

    if (!data) {
      await context.answerCallbackQuery();

      return;
    }

    if (data === `premium:buy`) {
      await context.answerCallbackQuery();
      const premiumResult = await config.api.premiumUrl(telegramId);
      await (premiumResult.status === `ok`
        ? context.send(`💳 ${premiumResult.url}`)
        : context.send(t(localeKey, `commands.premium.error`)));

      return;
    }

    const feature = Keyboards.parseFeatureCallback(data);
    if (feature !== undefined) {
      await context.answerCallbackQuery();

      const remainingResult = await config.api.remaining(telegramId);
      if (remainingResult.remaining <= 0) {
        await context.send(t(localeKey, `features.limit`));

        return;
      }

      const text = config.userTexts.get(telegramId);
      if (text === undefined || text === ``) {
        await context.send(t(localeKey, `features.error`));

        return;
      }

      await context.send(t(localeKey, `features.processing`));

      const processResult = await config.api.process(telegramId, text, feature);
      if (processResult.status === `ok`) {
        await context.send(t(localeKey, `features.result`, { text: processResult.text }));
        config.userTexts.clear(telegramId);
      } else {
        await context.send(t(localeKey, `features.error`));
      }

      return;
    }

    await context.answerCallbackQuery();
  });
};

export const Callbacks = { register };
