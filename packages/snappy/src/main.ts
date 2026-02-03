/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable functional/no-loop-statements */
import { Bot } from "gramio";

import { Config } from "./Config";
import { registerCallbackHandlers, registerCommands, registerMessageHandlers } from "./handlers";
import { localeKeys, t } from "./locales";

console.log(`🚀 Starting Snappy Bot...`);

const bot = new Bot(Config.BOT_TOKEN);
const commandKeys = [`start`, `help`, `balance`, `premium`] as const;

const setLocalizedCommands = async () => {
  await bot.api.setChatMenuButton({ menu_button: { type: `commands` } });

  for (const locale of localeKeys) {
    await bot.api.setMyCommands({
      commands: commandKeys.map(name => ({ command: name, description: t(locale, `commands.${name}.menu`) })),
      language_code: locale,
    });
  }

  await bot.api.setMyCommands({
    commands: commandKeys.map(name => ({ command: name, description: t(`en`, `commands.${name}.menu`) })),
  });
};

registerCommands(bot);
registerMessageHandlers(bot);
registerCallbackHandlers(bot);
bot.onStart(setLocalizedCommands);

await bot.start();

console.log(`✅ Snappy Bot is running!`);
