import { Config } from "@snappy/config";
import { Database } from "@snappy/db";
import { createApp } from "@snappy/server";
import { Snappy } from "@snappy/snappy";
import { SnappyBot } from "@snappy/snappy-bot";
import { YooKassa } from "@snappy/yoo-kassa";
import http from "node:http";

const db = Database(Config.dbUrl);
const snappy = Snappy({ gigaChatAuthKey: Config.gigaChatAuthKey });
const yooKassa = YooKassa({ secretKey: Config.yooKassaSecretKey, shopId: Config.yooKassaShopId });

const app = createApp({
  allowCorsOrigin: `http://localhost:5173`,
  botApiKey: Config.botApiKey,
  db,
  freeRequestLimit: Config.freeRequestLimit,
  jwtSecret: Config.jwtSecret,
  premiumPrice: Config.premiumPrice,
  snappy,
  yooKassa,
});

const server = http.createServer(app);

const bot = SnappyBot({
  apiBaseUrl: Config.apiBaseUrl,
  apiKey: Config.botApiKey,
  botToken: Config.botToken,
  premiumPrice: Config.premiumPrice,
});

process.stdout.write(`🚀 Starting server…\n`);
server.listen(Config.apiPort, () => {
  process.stdout.write(`  API http://localhost:${Config.apiPort}\n`);
  void bot.start();
});
