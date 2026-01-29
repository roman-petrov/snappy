/* eslint-disable no-console */
import { Bot } from "gramio";

import { config } from "./config";
import { registerCallbackHandlers } from "./handlers/callbacks";
import { registerCommands } from "./handlers/commands";
import { registerMessageHandlers } from "./handlers/messages";

const main = async () => {
  const token = config.BOT_TOKEN;

  console.log(`🚀 Starting Snappy Bot...`);

  const bot = new Bot(token);

  // Регистрируем обработчики
  registerCommands(bot);
  registerMessageHandlers(bot);
  registerCallbackHandlers(bot);

  // Запускаем бота
  await bot.start();

  console.log(`✅ Snappy Bot is running!`);
};

main().catch(error => {
  console.error(`❌ Failed to start bot:`, error);
  process.exit(1);
});
