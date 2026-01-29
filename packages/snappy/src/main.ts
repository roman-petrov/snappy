/* eslint-disable no-console */
import { Bot } from "gramio";

import { Config } from "./Config";
import { registerCallbackHandlers, registerCommands, registerMessageHandlers } from "./handlers";

console.log(`🚀 Starting Snappy Bot...`);

const bot = new Bot(Config.BOT_TOKEN);

registerCommands(bot);
registerMessageHandlers(bot);
registerCallbackHandlers(bot);

await bot.start();

console.log(`✅ Snappy Bot is running!`);
