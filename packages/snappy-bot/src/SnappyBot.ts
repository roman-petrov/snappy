/* eslint-disable no-await-in-loop */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
import { Snappy } from "@snappy/snappy";
import { Bot } from "gramio";

import { Callbacks } from "./Callbacks";
import { Commands } from "./Commands";
import { Locales, t } from "./locales";
import { Messages } from "./Messages";

export type SnappyBotConfig = {
  botToken: string;
  freeRequestLimit: number;
  gigaChatAuthKey: string;
  liveReload?: boolean;
  premiumPrice: number;
  snappyVersion?: string;
  yooKassaSecretKey?: string;
  yooKassaShopId?: string;
};

const commandKeys = [`start`, `help`, `balance`, `premium`] as const;

const setLocalizedCommands = async (bot: Bot) => {
  await bot.api.setChatMenuButton({ menu_button: { type: `commands` } });

  for (const locale of Locales.localeKeys) {
    await bot.api.setMyCommands({
      commands: commandKeys.map(name => ({ command: name, description: t(locale, `commands.${name}.menu`) })),
      language_code: locale,
    });
  }

  await bot.api.setMyCommands({
    commands: commandKeys.map(name => ({ command: name, description: t(`en`, `commands.${name}.menu`) })),
  });
};

const start = async (config: SnappyBotConfig): Promise<void> => {
  const snappy = Snappy({ gigaChatAuthKey: config.gigaChatAuthKey });
  const bot = new Bot(config.botToken);

  Commands.register(bot, config);
  Messages.registerHandlers(bot);
  Callbacks.registerHandlers(bot, snappy, config);
  bot.onStart(async () => setLocalizedCommands(bot));

  await bot.start();
  process.stdout.write(`🤖 Bot started\n`);
};

export const SnappyBot = { start };
