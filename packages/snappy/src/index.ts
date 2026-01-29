import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { Bot } from 'gramio';
import { config } from './config';
import { registerCommands } from './handlers/commands';
import { registerMessageHandlers } from './handlers/messages';
import { registerCallbackHandlers } from './handlers/callbacks';

// Настройка сертификатов Минцифры
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
process.env["NODE_EXTRA_CA_CERTS"] = resolve(__dirname, '../../..', 'certs');
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '0'


const main = async () => {
  const token = config.BOT_TOKEN;

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
