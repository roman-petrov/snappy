/* eslint-disable no-console */
import { Bot } from "gramio";

import { config } from "./config";
import { registerCallbackHandlers } from "./handlers/callbacks";
import { registerCommands } from "./handlers/commands";
import { registerMessageHandlers } from "./handlers/messages";

console.log(`🚀 Starting Snappy Bot...`);

const bot = new Bot(config.BOT_TOKEN);

registerCommands(bot);
registerMessageHandlers(bot);
registerCallbackHandlers(bot);

await bot.start();

console.log(`✅ Snappy Bot is running!`);
