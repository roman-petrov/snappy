/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable functional/no-loop-statements */
import { Snappy } from "@snappy/snappy";
import { Bot } from "gramio";

import { Config } from "./Config";
import { Callbacks, Commands, Messages } from "./handlers";
import { Locales, t } from "./locales";

console.log(`🚀 Starting Snappy Bot...`);

const snappy = Snappy({ gigaChatAuthKey: Config.GIGACHAT_AUTH_KEY });

const bot = new Bot(Config.BOT_TOKEN);
const commandKeys = [`start`, `help`, `balance`, `premium`] as const;

const setLocalizedCommands = async () => {
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

Commands.registerCommands(bot);
Messages.registerMessageHandlers(bot);
Callbacks.registerCallbackHandlers(bot, snappy);
bot.onStart(setLocalizedCommands);

await bot.start();

console.log(`✅ Snappy Bot is running!`);
