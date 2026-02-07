/* jscpd:ignore-start */
/* eslint-disable functional/no-expression-statements */
import type { Bot } from "gramio";

import { Keyboards } from "./Keyboards";
import { t } from "./locales";
import { Storage } from "./Storage";

const register = (bot: Bot, freeRequestLimit: number, premiumPrice: number, snappyVersion?: string) => {
  bot.command(`start`, async context => {
    const localeKey = Storage.userLanguage(context.from.languageCode);
    const userId = context.from.id;
    const remaining = Storage.remainingRequests(userId, freeRequestLimit);

    await context.send(t(localeKey, `commands.start.welcome`));
    await context.send(t(localeKey, `commands.start.help`, { count: remaining }));
  });

  bot.command(`help`, async context => {
    const localeKey = Storage.userLanguage(context.from.languageCode);
    const body = `${t(localeKey, `commands.help.title`)}\n\n${t(localeKey, `commands.help.text`)}`;

    const message =
      snappyVersion === undefined
        ? body
        : `${body}\n\n<tg-spoiler>${t(localeKey, `commands.help.versionLabel`)}: <b>${snappyVersion}</b></tg-spoiler>`;

    await context.send(message, snappyVersion === undefined ? undefined : { parse_mode: `HTML` });
  });

  bot.command(`balance`, async context => {
    const localeKey = Storage.userLanguage(context.from.languageCode);
    const userId = context.from.id;
    const remaining = Storage.remainingRequests(userId, freeRequestLimit);
    const premiumStatus = t(localeKey, `commands.balance.inactive`);

    await context.send(t(localeKey, `commands.balance.free`, { count: remaining, status: premiumStatus }));
  });

  bot.command(`premium`, async context => {
    const localeKey = Storage.userLanguage(context.from.languageCode);

    await context.send(
      `${t(localeKey, `commands.premium.title`)}\n\n${t(localeKey, `commands.premium.description`, { price: premiumPrice })}`,
      { reply_markup: Keyboards.premiumKeyboard(localeKey, premiumPrice) },
    );
  });
};

export const Commands = { register };
/* jscpd:ignore-end */
