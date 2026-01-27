import type { Bot } from 'gramio';
import { t } from '../locales/index';
import { getUserLanguage, getRemainingRequests } from '../storage/index';
import { createLanguageKeyboard, createPremiumKeyboard } from '../keyboards/index';

export const registerCommands = (bot: Bot) => {
  bot.command('start', async (context) => {
    const userId = context.from?.id;
    if (!userId) return;

    const locale = getUserLanguage(userId);
    const remaining = getRemainingRequests(userId);

    await context.send(t(locale, 'commands.start.welcome'));
    await context.send(t(locale, 'commands.start.help', { count: remaining }));
  });

  bot.command('help', async (context) => {
    const userId = context.from?.id;
    if (!userId) return;

    const locale = getUserLanguage(userId);

    await context.send(
      `${t(locale, 'commands.help.title')}\n\n${t(locale, 'commands.help.text')}`
    );
  });

  bot.command('balance', async (context) => {
    const userId = context.from?.id;
    if (!userId) return;

    const locale = getUserLanguage(userId);
    const remaining = getRemainingRequests(userId);
    const premiumStatus = t(locale, 'commands.balance.inactive');

    await context.send(
      t(locale, 'commands.balance.free', {
        count: remaining,
        status: premiumStatus,
      })
    );
  });

  bot.command('language', async (context) => {
    const userId = context.from?.id;
    if (!userId) return;

    const locale = getUserLanguage(userId);

    await context.send(t(locale, 'commands.language.select'), {
      reply_markup: createLanguageKeyboard(),
    });
  });

  bot.command('premium', async (context) => {
    const userId = context.from?.id;
    if (!userId) return;

    const locale = getUserLanguage(userId);
    const price = process.env.PREMIUM_PRICE || '299';

    await context.send(
      `${t(locale, 'commands.premium.title')}\n\n${t(locale, 'commands.premium.description', { price })}`,
      {
        reply_markup: createPremiumKeyboard(locale),
      }
    );
  });
};
