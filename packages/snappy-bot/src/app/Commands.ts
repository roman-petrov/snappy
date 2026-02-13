/* jscpd:ignore-start */
/* eslint-disable functional/no-expression-statements */
import type { Bot } from "gramio";

import type { ServerApi } from "@snappy/server-api";

import { Keyboards } from "./Keyboards";
import { Locale, t } from "./Locale";

const register = (bot: Bot, premiumPrice: number, snappyVersion: string | undefined, api: ServerApi) => {
  bot.command(`start`, async context => {
    const localeKey = Locale.userLanguage(context.from.languageCode);
    const { remaining: remainingCount } = await api.remaining(context.from.id);

    await context.send(t(localeKey, `commands.start.welcome`));
    await context.send(t(localeKey, `commands.start.help`, { count: remainingCount }));
  });

  bot.command(`help`, async context => {
    const localeKey = Locale.userLanguage(context.from.languageCode);
    const body = `${t(localeKey, `commands.help.title`)}\n\n${t(localeKey, `commands.help.text`)}`;

    const message =
      snappyVersion === undefined
        ? body
        : `${body}\n\n<tg-spoiler>${t(localeKey, `commands.help.versionLabel`)}: <b>${snappyVersion}</b></tg-spoiler>`;

    await context.send(message, snappyVersion === undefined ? undefined : { parse_mode: `HTML` });
  });

  bot.command(`balance`, async context => {
    const localeKey = Locale.userLanguage(context.from.languageCode);
    const { remaining: remainingCount } = await api.remaining(context.from.id);
    const premiumStatus = t(localeKey, `commands.balance.inactive`);

    await context.send(t(localeKey, `commands.balance.free`, { count: remainingCount, status: premiumStatus }));
  });

  bot.command(`premium`, async context => {
    const localeKey = Locale.userLanguage(context.from.languageCode);

    await context.send(
      `${t(localeKey, `commands.premium.title`)}\n\n${t(localeKey, `commands.premium.description`, { price: premiumPrice })}`,
      { reply_markup: Keyboards.premiumKeyboard(localeKey, premiumPrice) },
    );
  });
};

export const Commands = { register };
/* jscpd:ignore-end */
