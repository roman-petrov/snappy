/* eslint-disable sonarjs/void-use */
/* eslint-disable @typescript-eslint/strict-void-return */
import { Config } from "@snappy/config";
import { createApp, CreateAppContext } from "@snappy/server";
import { SnappyBot } from "@snappy/snappy-bot";
import http from "node:http";

const app = createApp({ ...CreateAppContext.createAppOptions(Config), allowCorsOrigin: `http://localhost:5173` });
const server = http.createServer(app);

const bot = SnappyBot({
  apiBaseUrl: Config.apiBaseUrl,
  apiKey: Config.botApiKey,
  botToken: Config.botToken,
  premiumPrice: Config.premiumPrice,
});

void process.stdout.write(`🚀 Starting server…\n`);

server.listen(Config.apiPort, () => {
  void process.stdout.write(`  API http://localhost:${Config.apiPort}\n`);
  void bot.start();
});
