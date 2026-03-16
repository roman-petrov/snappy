/* jscpd:ignore-start */
/* eslint-disable functional/no-expression-statements */
import type { ServerApi } from "@snappy/server-api";
import type { Bot } from "gramio";

import { _ } from "@snappy/core";
import { i } from "@snappy/intl";

import { Keyboards } from "./Keyboards";
import { Locale, t } from "./Locale";

const register = (bot: Bot, snappyVersion: string | undefined, api: ServerApi) => {
  bot.command(`start`, async context => {
    const locale = Locale.userLanguage(context.from.languageCode);
    const remainingResult = await api.remaining(context.from.id);
    const remainingCount = remainingResult.remaining;

    await context.send(t(locale, `commands.start.welcome`));
    await context.send(t(locale, `commands.start.help`, { count: i.number(remainingCount, `default`, locale) }));
  });

  bot.command(`help`, async context => {
    const locale = Locale.userLanguage(context.from.languageCode);
    const body = `${t(locale, `commands.help.title`)}\n\n${t(locale, `commands.help.text`)}`;

    const message =
      snappyVersion === undefined
        ? body
        : `${body}\n\n<tg-spoiler>${t(locale, `commands.help.versionLabel`)}: <b>${snappyVersion}</b></tg-spoiler>`;

    await context.send(message, snappyVersion === undefined ? undefined : { parse_mode: `HTML` });
  });

  bot.command(`balance`, async context => {
    const locale = Locale.userLanguage(context.from.languageCode);
    const remainingResult = await api.remaining(context.from.id);

    if (remainingResult.isPremium === true && remainingResult.premiumUntil !== undefined) {
      const { autoRenew, nextBillingAt, premiumUntil } = remainingResult;
      const premiumUntilLabel = i.date(premiumUntil, `default`, locale);
      const daysLeft = i.number(Math.max(0, Math.floor((premiumUntil - _.now()) / _.day)), `default`, locale);

      const nextBilling =
        autoRenew === true && nextBillingAt !== undefined ? i.date(nextBillingAt, `default`, locale) : ``;

      const text =
        nextBilling === ``
          ? t(locale, `commands.balance.premiumUntil`, { daysLeft, premiumUntil: premiumUntilLabel })
          : t(locale, `commands.balance.premiumFull`, { daysLeft, nextBilling, premiumUntil: premiumUntilLabel });

      await context.send(text);

      return;
    }

    const count = Math.max(remainingResult.remaining, 0);

    const resetAt =
      remainingResult.nextResetAt === undefined
        ? t(locale, `commands.balance.resetTomorrow`)
        : i.time(remainingResult.nextResetAt, `default`, locale);

    const status = t(locale, `commands.balance.inactive`);

    await context.send(
      t(locale, `commands.balance.free`, {
        count: i.number(count, `default`, locale),
        freeRequestLimit: i.number(remainingResult.freeRequestLimit, `default`, locale),
        resetAt,
        status,
      }),
    );
  });

  bot.command(`premium`, async context => {
    const locale = Locale.userLanguage(context.from.languageCode);
    const subscriptionResult = await api.subscriptionGet(context.from.id);
    const now = _.now();
    const premiumUntilRaw = subscriptionResult.premiumUntil;
    const premiumUntilMs = premiumUntilRaw ?? 0;

    if (premiumUntilRaw !== undefined) {
      const premiumUntil = i.date(premiumUntilRaw, `default`, locale);
      const daysLeft = i.number(Math.max(0, Math.floor((premiumUntilMs - now) / _.day)), `default`, locale);
      if (
        premiumUntilMs > now &&
        subscriptionResult.autoRenew === true &&
        subscriptionResult.nextBillingAt !== undefined
      ) {
        const nextBilling = i.date(subscriptionResult.nextBillingAt, `default`, locale);
        await context.send(t(locale, `commands.premium.active`, { daysLeft, nextBilling, premiumUntil }), {
          reply_markup: Keyboards.subscriptionKeyboard(locale, true),
        });
      } else if (premiumUntilMs > now) {
        await context.send(t(locale, `commands.premium.activeNoRenew`, { daysLeft, premiumUntil }), {
          reply_markup: Keyboards.subscriptionKeyboard(locale, false),
        });
      } else {
        await context.send(t(locale, `commands.premium.expired`, { daysLeft, premiumUntil }), {
          reply_markup: Keyboards.subscriptionKeyboard(locale, subscriptionResult.autoRenew === true),
        });
      }

      return;
    }

    await context.send(
      `${t(locale, `commands.premium.title`)}\n\n${t(locale, `commands.premium.description`, { price: i.price(subscriptionResult.premiumPrice, `default`, locale) })}`,
      { reply_markup: Keyboards.premiumKeyboard(locale, subscriptionResult.premiumPrice) },
    );
  });
};

export const Commands = { register };
/* jscpd:ignore-end */
