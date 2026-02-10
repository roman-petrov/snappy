/* eslint-disable no-await-in-loop */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
import type { Database } from "@snappy/db";

import { Snappy } from "@snappy/snappy";
import { YooKassa } from "@snappy/yoo-kassa";
import { Bot } from "gramio";

import { Callbacks, Commands, Locale, Messages, Storage, t, UserTexts } from "./app";

export type SnappyBotConfig = {
  botToken: string;
  db: Database;
  freeRequestLimit: number;
  gigaChatAuthKey: string;
  premiumPrice: number;
  version?: string;
  yooKassaSecretKey?: string;
  yooKassaShopId?: string;
};

export const SnappyBot = ({
  botToken,
  db,
  freeRequestLimit,
  gigaChatAuthKey,
  premiumPrice,
  version,
  yooKassaSecretKey,
  yooKassaShopId,
}: SnappyBotConfig) => {
  const snappy = Snappy({ gigaChatAuthKey });
  const yooKassa = YooKassa({ secretKey: yooKassaSecretKey, shopId: yooKassaShopId });
  const bot = new Bot(botToken);
  const storage = Storage(db);
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
  Callbacks.register(bot, snappy, { freeRequestLimit, premiumPrice, storage, userTexts, yooKassa });
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
