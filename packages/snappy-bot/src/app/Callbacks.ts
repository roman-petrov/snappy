/* eslint-disable @typescript-eslint/max-params */
/* eslint-disable functional/no-expression-statements */
import type { ServerApi } from "@snappy/server-api";
import type { SnappyCoreLength, SnappyCoreOptions, SnappyCoreStyle } from "@snappy/snappy-core";
import type { Bot } from "gramio";

import type { UserSessionsType } from "./UserSessions";

import { Keyboards } from "./Keyboards";
import { Locale, t } from "./Locale";

export type CallbacksConfig = { api: ServerApi; userSessions: UserSessionsType };

const sessionOrError = async (
  context: { send: (text: string) => Promise<unknown> },
  api: ServerApi,
  telegramId: number,
  localeKey: ReturnType<typeof Locale.userLanguage>,
  userSessions: UserSessionsType,
): Promise<undefined | { options: SnappyCoreOptions; text: string }> => {
  const session = userSessions.get(telegramId);
  if (session === undefined) {
    await context.send(t(localeKey, `features.error`));

    return undefined;
  }
  const remainingResult = await api.remaining(telegramId);
  if (remainingResult.remaining <= 0) {
    await context.send(t(localeKey, `features.limit`));

    return undefined;
  }

  return session;
};

const processAndSend = async (
  context: { send: (text: string, extra?: object) => Promise<unknown> },
  api: ServerApi,
  telegramId: number,
  session: { options: SnappyCoreOptions; text: string },
  localeKey: ReturnType<typeof Locale.userLanguage>,
  userSessions: UserSessionsType,
  clearOnError = false,
) => {
  const processResult = await api.process(telegramId, session.text, session.options);
  if (processResult.status === `ok`) {
    await context.send(t(localeKey, `features.result`, { text: processResult.text }), {
      reply_markup: Keyboards.resultKeyboard(localeKey),
    });
  } else {
    if (clearOnError) {
      userSessions.clear(telegramId);
    }
    await context.send(t(localeKey, `features.error`));
  }
};

const mergeOptions = (
  current: SnappyCoreOptions,
  action:
    | { type: `emoji` }
    | { type: `format` }
    | { type: `length`; value: SnappyCoreLength }
    | { type: `style`; value: SnappyCoreStyle },
): SnappyCoreOptions => {
  if (action.type === `emoji`) {
    return { ...current, addEmoji: !(current.addEmoji ?? false) };
  }

  if (action.type === `format`) {
    return { ...current, addFormatting: !(current.addFormatting ?? false) };
  }

  if (action.type === `length`) {
    return { ...current, length: action.value };
  }

  return { ...current, style: action.value };
};

const register = (bot: Bot, { api, userSessions }: CallbacksConfig) => {
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
      const premiumResult = await api.premiumUrl(telegramId);
      await (premiumResult.status === `ok`
        ? context.send(`💳 ${premiumResult.url}`)
        : context.send(t(localeKey, `commands.premium.error`)));

      return;
    }

    const optAction = Keyboards.parseOptionCallback(data);
    if (optAction !== undefined) {
      await context.answerCallbackQuery();

      if (optAction.type === `new`) {
        userSessions.clear(telegramId);
        await context.send(t(localeKey, `keyboard.enterNew`));

        return;
      }

      if (optAction.type === `process`) {
        const session = await sessionOrError(context, api, telegramId, localeKey, userSessions);
        if (session === undefined) {
          return;
        }

        await context.send(t(localeKey, `features.processing`));
        await processAndSend(context, api, telegramId, session, localeKey, userSessions, true);

        return;
      }

      const session = userSessions.get(telegramId);
      if (session === undefined) {
        await context.send(t(localeKey, `features.error`));

        return;
      }

      const options = mergeOptions(session.options, optAction);
      userSessions.set(telegramId, { ...session, options });

      const editResult = await context
        .editReplyMarkup(Keyboards.optionsKeyboard(localeKey, options))
        .catch(() => undefined);

      if (editResult === undefined) {
        await context.send(t(localeKey, `features.choose`), {
          reply_markup: Keyboards.optionsKeyboard(localeKey, options),
        });
      }

      return;
    }

    const resultAction = Keyboards.parseResultCallback(data);
    if (resultAction === `retry`) {
      await context.answerCallbackQuery();

      const session = await sessionOrError(context, api, telegramId, localeKey, userSessions);
      if (session === undefined) {
        return;
      }

      await processAndSend(context, api, telegramId, session, localeKey, userSessions);

      return;
    }

    if (resultAction === `new`) {
      await context.answerCallbackQuery();
      userSessions.clear(telegramId);
      await context.send(t(localeKey, `keyboard.enterNew`));

      return;
    }

    await context.answerCallbackQuery();
  });
};

export const Callbacks = { register };
