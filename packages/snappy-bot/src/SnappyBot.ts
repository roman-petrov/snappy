/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable no-await-in-loop */
import { ServerApi } from "@snappy/server-api";
import { Bot } from "gramio";

import { Callbacks, Commands, Locale, Messages, t, UserTexts } from "./app";

export type SnappyBotConfig = {
  apiKey: string;
  apiUrl: string;
  botToken: string;
  premiumPrice: number;
  version?: string;
};

export const SnappyBot = ({ apiKey, apiUrl, botToken, premiumPrice, version }: SnappyBotConfig) => {
  const bot = new Bot(botToken);
  const api = ServerApi({ auth: { apiKey, type: `bot` }, baseUrl: apiUrl });
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

  Commands.register(bot, premiumPrice, version, api);
  Messages.register(bot, userTexts);
  Callbacks.register(bot, { api, userTexts });
  bot.onStart(setLocalizedCommands);

  const start = async () => bot.start();
  const stop = async () => bot.stop();

  return { start, stop };
};

export type SnappyBot = ReturnType<typeof SnappyBot>;
