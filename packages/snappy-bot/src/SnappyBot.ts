/* eslint-disable functional/no-expression-statements */
import { Bot } from "gramio";

import { Callbacks, Commands, Locale, Messages, Storage, t, UserTexts } from "./app";

export type SnappyBotConfig = {
  apiBaseUrl: string;
  apiKey: string;
  botToken: string;
  freeRequestLimit: number;
  premiumPrice: number;
  version?: string;
};

export const SnappyBot = ({
  apiBaseUrl,
  apiKey,
  botToken,
  freeRequestLimit,
  premiumPrice,
  version,
}: SnappyBotConfig) => {
  const bot = new Bot(botToken);
  const storage = Storage({ apiBaseUrl, apiKey });
  const userTexts = UserTexts();
  const commandKeys = [`start`, `help`, `balance`, `premium`] as const;

  const setLocalizedCommands = async () => {
    await bot.api.setChatMenuButton({ menu_button: { type: `commands` } });

    for (const locale of Locale.localeKeys) {
      await bot.api.setMyCommands({
        commands: commandKeys.map(name => ({ command: name, description: t(locale, `commands.${name}.menu`) })),
        language_code: locale,
      });
    }

    await bot.api.setMyCommands({
      commands: commandKeys.map(name => ({ command: name, description: t(`en`, `commands.${name}.menu`) })),
    });
  };

  Commands.register(bot, freeRequestLimit, premiumPrice, version, storage);
  Messages.register(bot, userTexts);
  Callbacks.register(bot, { freeRequestLimit, premiumPrice, storage, userTexts });
  bot.onStart(setLocalizedCommands);

  const start = async () => {
    await bot.start();
    process.stdout.write(`🤖 Bot started\n`);
  };

  const stop = async () => {
    await bot.stop();
    process.stdout.write(`🤖 Bot stopped\n`);
  };

  return { start, stop };
};

export type SnappyBot = ReturnType<typeof SnappyBot>;
