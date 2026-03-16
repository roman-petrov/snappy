/* eslint-disable @typescript-eslint/max-params */
/* eslint-disable functional/no-expression-statements */
import type { SnappyLength, SnappyOptions, SnappyStyle } from "@snappy/domain";
import type { ServerApi } from "@snappy/server-api";
import type { Bot } from "gramio";

import { i } from "@snappy/intl";

import type { UserSessionsType } from "./UserSessions";

import { Keyboards } from "./Keyboards";
import { Locale, t } from "./Locale";

export type CallbacksConfig = { api: ServerApi; userSessions: UserSessionsType };

const sessionOrError = async (
  context: { send: (text: string) => Promise<unknown> },
  api: ServerApi,
  telegramId: number,
  locale: ReturnType<typeof Locale.userLanguage>,
  userSessions: UserSessionsType,
): Promise<undefined | { options: SnappyOptions; text: string }> => {
  const session = userSessions.get(telegramId);
  if (session === undefined) {
    await context.send(t(locale, `features.error`));

    return undefined;
  }
  const remainingResult = await api.remaining(telegramId);
  if (remainingResult.remaining <= 0) {
    await context.send(
      t(locale, `features.limit`, { freeRequestLimit: i.number(remainingResult.freeRequestLimit, `default`, locale) }),
    );

    return undefined;
  }

  return session;
};

const processAndSend = async (
  context: { send: (text: string, extra?: object) => Promise<unknown> },
  api: ServerApi,
  telegramId: number,
  session: { options: SnappyOptions; text: string },
  locale: ReturnType<typeof Locale.userLanguage>,
  userSessions: UserSessionsType,
  clearOnError = false,
) => {
  const processResult = await api.process(telegramId, session.text, session.options);
  if (processResult.status === `ok`) {
    await context.send(t(locale, `features.result`, { text: processResult.text }), {
      reply_markup: Keyboards.resultKeyboard(locale),
    });
  } else {
    if (clearOnError) {
      userSessions.clear(telegramId);
    }
    await context.send(t(locale, `features.error`));
  }
};

const mergeOptions = (
  current: SnappyOptions,
  action:
    | { type: `emoji` }
    | { type: `format` }
    | { type: `length`; value: SnappyLength }
    | { type: `style`; value: SnappyStyle },
): SnappyOptions =>
  action.type === `emoji`
    ? { ...current, addEmoji: !current.addEmoji }
    : action.type === `format`
      ? { ...current, addFormatting: !current.addFormatting }
      : action.type === `length`
        ? { ...current, length: action.value }
        : { ...current, style: action.value };

const register = (bot: Bot, { api, userSessions }: CallbacksConfig) => {
  bot.on(`callback_query`, async context => {
    const telegramId = context.from.id;
    const locale = Locale.userLanguage(context.from.languageCode);
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
        : context.send(t(locale, `commands.premium.error`)));

      return;
    }

    if (data === `premium:auto-renew:off` || data === `premium:auto-renew:on`) {
      await context.answerCallbackQuery();
      const enabled = data === `premium:auto-renew:on`;
      const result = await api.subscriptionSetAutoRenew(telegramId, enabled);
      const sub = await api.subscriptionGet(telegramId);
      const premiumUntil = sub.premiumUntil === undefined ? undefined : i.date(sub.premiumUntil, `default`, locale);

      const text =
        result.status === `ok`
          ? premiumUntil === undefined
            ? t(locale, enabled ? `commands.premium.autoRenewOn` : `commands.premium.autoRenewOff`)
            : t(locale, enabled ? `commands.premium.autoRenewOnUntil` : `commands.premium.autoRenewOffUntil`, {
                premiumUntil,
              })
          : t(locale, `commands.premium.errors.${result.status}`);
      await context.send(text);

      return;
    }

    if (data === `premium:renew`) {
      await context.answerCallbackQuery();
      const result = await api.subscriptionRenew(telegramId);
      await context.send(
        result.status === `ok`
          ? t(locale, `commands.premium.renewed`)
          : t(locale, `commands.premium.errors.${result.status}`),
      );

      return;
    }

    if (data === `premium:delete`) {
      await context.answerCallbackQuery();
      await context.send(t(locale, `commands.premium.deleteWarning`), {
        reply_markup: Keyboards.subscriptionDeleteConfirmKeyboard(locale),
      });

      return;
    }

    if (data === `premium:delete:cancel`) {
      await context.answerCallbackQuery();
      await context.send(t(locale, `commands.premium.deleteCancelled`));

      return;
    }

    if (data === `premium:delete:confirm`) {
      await context.answerCallbackQuery();
      const result = await api.subscriptionDelete(telegramId, true);
      await context.send(
        result.status === `ok`
          ? t(locale, `commands.premium.deleted`)
          : t(locale, `commands.premium.errors.${result.status}`),
      );

      return;
    }

    if (data === `limit:balance`) {
      await context.answerCallbackQuery();
      const remainingResult = await api.remaining(telegramId);

      const resetAt =
        remainingResult.nextResetAt === undefined
          ? t(locale, `commands.balance.resetTomorrow`)
          : i.time(remainingResult.nextResetAt, `default`, locale);

      const text = t(locale, `commands.balance.limitReached`, {
        current: i.number(0, `default`, locale),
        freeRequestLimit: i.number(remainingResult.freeRequestLimit, `default`, locale),
        resetAt,
      });
      await context.send(text);

      return;
    }

    const optAction = Keyboards.parseOptionCallback(data);
    if (optAction !== undefined) {
      await context.answerCallbackQuery();

      if (optAction.type === `new`) {
        userSessions.clear(telegramId);
        await context.send(t(locale, `keyboard.enterNew`));

        return;
      }

      if (optAction.type === `process`) {
        const session = await sessionOrError(context, api, telegramId, locale, userSessions);
        if (session === undefined) {
          return;
        }

        await context.send(t(locale, `features.processing`));
        await processAndSend(context, api, telegramId, session, locale, userSessions, true);

        return;
      }

      const session = userSessions.get(telegramId);
      if (session === undefined) {
        await context.send(t(locale, `features.error`));

        return;
      }

      const options = mergeOptions(session.options, optAction);
      userSessions.set(telegramId, { ...session, options });

      const editResult = await context
        .editReplyMarkup(Keyboards.optionsKeyboard(locale, options))
        .catch(() => undefined);

      if (editResult === undefined) {
        await context.send(t(locale, `features.choose`), { reply_markup: Keyboards.optionsKeyboard(locale, options) });
      }

      return;
    }

    const resultAction = Keyboards.parseResultCallback(data);
    if (resultAction === `retry`) {
      await context.answerCallbackQuery();

      const session = await sessionOrError(context, api, telegramId, locale, userSessions);
      if (session === undefined) {
        return;
      }

      await processAndSend(context, api, telegramId, session, locale, userSessions);

      return;
    }

    if (resultAction === `new`) {
      await context.answerCallbackQuery();
      userSessions.clear(telegramId);
      await context.send(t(locale, `keyboard.enterNew`));

      return;
    }

    await context.answerCallbackQuery();
  });
};

export const Callbacks = { register };
