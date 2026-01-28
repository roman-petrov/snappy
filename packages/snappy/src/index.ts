import 'dotenv/config';
import { Bot } from 'gramio';
import { registerCommands } from './handlers/commands';
import { registerMessageHandlers } from './handlers/messages';
import { registerCallbackHandlers } from './handlers/callbacks';

const main = async () => {
  const token = process.env.BOT_TOKEN;

  if (!token) {
    console.error('❌ BOT_TOKEN is not set in environment variables');
    process.exit(1);
  }

  console.log('🚀 Starting Snappy Bot...');

  const bot = new Bot(token);

  // Регистрируем обработчики
  registerCommands(bot);
  registerMessageHandlers(bot);
  registerCallbackHandlers(bot);

  // Запускаем бота
  await bot.start();

  console.log('✅ Snappy Bot is running!');
};

main().catch((error) => {
  console.error('❌ Failed to start bot:', error);
  process.exit(1);
});
