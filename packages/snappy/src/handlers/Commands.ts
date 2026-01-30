/* jscpd:ignore-start */
/* eslint-disable functional/no-expression-statements */
import type { Bot } from "gramio";

import { Config } from "../Config";
import { createPremiumKeyboard } from "../keyboards";
import { t } from "../locales";
import { getRemainingRequests, getUserLanguage } from "../storage";

export const registerCommands = (bot: Bot) => {
  bot.command(`start`, async context => {
    const locale = getUserLanguage(context.from.languageCode);
    const userId = context.from.id;
    const remaining = getRemainingRequests(userId);

    await context.send(t(locale, `commands.start.welcome`));
    await context.send(t(locale, `commands.start.help`, { count: remaining }));
  });

  bot.command(`help`, async context => {
    const locale = getUserLanguage(context.from?.languageCode);

    await context.send(`${t(locale, `commands.help.title`)}\n\n${t(locale, `commands.help.text`)}`);
  });

  bot.command(`balance`, async context => {
    const locale = getUserLanguage(context.from?.languageCode);
    const userId = context.from.id;
    const remaining = getRemainingRequests(userId);
    const premiumStatus = t(locale, `commands.balance.inactive`);

    await context.send(t(locale, `commands.balance.free`, { count: remaining, status: premiumStatus }));
  });

  bot.command(`premium`, async context => {
    const locale = getUserLanguage(context.from?.languageCode);

    await context.send(
      `${t(locale, `commands.premium.title`)}\n\n${t(locale, `commands.premium.description`, { price: Config.PREMIUM_PRICE })}`,
      { reply_markup: createPremiumKeyboard(locale) },
    );
  });
};
/* jscpd:ignore-end */
