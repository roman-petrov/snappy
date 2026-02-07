/* jscpd:ignore-start */
/* eslint-disable functional/no-expression-statements */
import type { Bot } from "gramio";

import type { SnappyBotConfig } from "./SnappyBot";

import { Keyboards } from "./Keyboards";
import { t } from "./locales";
import { Storage } from "./Storage";

const register = (bot: Bot, config: SnappyBotConfig) => {
  bot.command(`start`, async context => {
    const localeKey = Storage.userLanguage(context.from.languageCode);
    const userId = context.from.id;
    const remaining = Storage.remainingRequests(userId, config);

    await context.send(t(localeKey, `commands.start.welcome`));
    await context.send(t(localeKey, `commands.start.help`, { count: remaining }));
  });

  bot.command(`help`, async context => {
    const localeKey = Storage.userLanguage(context.from.languageCode);
    const body = `${t(localeKey, `commands.help.title`)}\n\n${t(localeKey, `commands.help.text`)}`;
    const version = config.snappyVersion;

    const message =
      version === undefined
        ? body
        : `${body}\n\n<tg-spoiler>${t(localeKey, `commands.help.versionLabel`)}: <b>${version}</b></tg-spoiler>`;

    await context.send(message, version === undefined ? undefined : { parse_mode: `HTML` });
  });

  bot.command(`balance`, async context => {
    const localeKey = Storage.userLanguage(context.from.languageCode);
    const userId = context.from.id;
    const remaining = Storage.remainingRequests(userId, config);
    const premiumStatus = t(localeKey, `commands.balance.inactive`);

    await context.send(t(localeKey, `commands.balance.free`, { count: remaining, status: premiumStatus }));
  });

  bot.command(`premium`, async context => {
    const localeKey = Storage.userLanguage(context.from.languageCode);

    await context.send(
      `${t(localeKey, `commands.premium.title`)}\n\n${t(localeKey, `commands.premium.description`, { price: config.premiumPrice })}`,
      { reply_markup: Keyboards.premiumKeyboard(localeKey, config.premiumPrice) },
    );
  });
};

export const Commands = { register };
/* jscpd:ignore-end */
