/* eslint-disable no-await-in-loop */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
import { Snappy } from "@snappy/snappy";
import { YooKassa } from "@snappy/yoo-kassa";
import { Bot } from "gramio";

import { Callbacks, Commands, Locale, Messages, Storage, t } from "./app";

export type SnappyBotConfig = {
  botToken: string;
  freeRequestLimit: number;
  gigaChatAuthKey: string;
  premiumPrice: number;
  snappyVersion?: string;
  yooKassaSecretKey?: string;
  yooKassaShopId?: string;
};

const start = async (config: SnappyBotConfig) => {
  const commandKeys = [`start`, `help`, `balance`, `premium`] as const;

  const setLocalizedCommands = async (bot: Bot) => {
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

  const snappy = Snappy({ gigaChatAuthKey: config.gigaChatAuthKey });
  const yooKassa = YooKassa({ secretKey: config.yooKassaSecretKey, shopId: config.yooKassaShopId });
  const bot = new Bot(config.botToken);
  const storage = Storage();

  Commands.register(bot, config.freeRequestLimit, config.premiumPrice, config.snappyVersion, storage);
  Messages.register(bot, storage);
  Callbacks.register(bot, snappy, {
    freeRequestLimit: config.freeRequestLimit,
    premiumPrice: config.premiumPrice,
    storage,
    yooKassa,
  });
  bot.onStart(async () => setLocalizedCommands(bot));

  await bot.start();
  process.stdout.write(`🤖 Bot started\n`);
};

export const SnappyBot = { start };
