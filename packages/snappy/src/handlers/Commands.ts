/* jscpd:ignore-start */
/* eslint-disable functional/no-expression-statements */
import type { Bot } from "gramio";

import { AppConfiguration } from "../AppConfiguration";
import { premiumKeyboard } from "../keyboards";
import { t } from "../locales";
import { remainingRequests, userLanguage } from "../storage";

export const registerCommands = (bot: Bot) => {
  bot.command(`start`, async context => {
    const localeKey = userLanguage(context.from.languageCode);
    const userId = context.from.id;
    const remaining = remainingRequests(userId);

    await context.send(t(localeKey, `commands.start.welcome`));
    await context.send(t(localeKey, `commands.start.help`, { count: remaining }));
  });

  bot.command(`help`, async context => {
    const localeKey = userLanguage(context.from.languageCode);

    await context.send(`${t(localeKey, `commands.help.title`)}\n\n${t(localeKey, `commands.help.text`)}`);
  });

  bot.command(`balance`, async context => {
    const localeKey = userLanguage(context.from.languageCode);
    const userId = context.from.id;
    const remaining = remainingRequests(userId);
    const premiumStatus = t(localeKey, `commands.balance.inactive`);

    await context.send(t(localeKey, `commands.balance.free`, { count: remaining, status: premiumStatus }));
  });

  bot.command(`premium`, async context => {
    const localeKey = userLanguage(context.from.languageCode);

    await context.send(
      `${t(localeKey, `commands.premium.title`)}\n\n${t(localeKey, `commands.premium.description`, { price: AppConfiguration.premiumPrice })}`,
      { reply_markup: premiumKeyboard(localeKey) },
    );
  });
};

export const Commands = { registerCommands };
/* jscpd:ignore-end */
