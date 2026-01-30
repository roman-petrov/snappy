/* eslint-disable no-console */
/* eslint-disable no-await-in-loop */
/* eslint-disable functional/no-loop-statements */
import { Bot } from "gramio";

import { Config } from "./Config";
import { registerCallbackHandlers, registerCommands, registerMessageHandlers } from "./handlers";
import { type Locale, t } from "./locales";

console.log(`🚀 Starting Snappy Bot...`);

const bot = new Bot(Config.BOT_TOKEN);
const commandKeys = [`start`, `help`, `balance`, `language`, `premium`] as const;

const setLocalizedCommands = async (): Promise<void> => {
  await bot.api.setChatMenuButton({ menu_button: { type: `commands` } });

  const locales: Locale[] = [`en`, `ru`];
  for (const locale of locales) {
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
