/* eslint-disable functional/no-expression-statements */
import type { Config } from "@snappy/config";

import { Database } from "@snappy/db";
import { Snappy } from "@snappy/snappy";
import { SnappyBot } from "@snappy/snappy-bot";
import { YooKassa } from "@snappy/yoo-kassa";

import { ServerAppApi } from "./ServerAppApi";

export const ServerApp = (config: Config, options: { botBaseUrl: string; version?: string }) => {
  const db = Database(config.dbUrl);
  const snappy = Snappy({ gigaChatAuthKey: config.gigaChatAuthKey });
  const yooKassa = YooKassa({ secretKey: config.yooKassaSecretKey, shopId: config.yooKassaShopId });

  const api = ServerAppApi({
    db,
    freeRequestLimit: config.freeRequestLimit,
    jwtSecret: config.jwtSecret,
    premiumPrice: config.premiumPrice,
    snappy,
    yooKassa,
  });

  const bot = SnappyBot({
    apiKey: config.botApiKey,
    apiUrl: options.botBaseUrl,
    botToken: config.botToken,
    premiumPrice: config.premiumPrice,
    ...(options.version !== undefined && { version: options.version }),
  });

  const start = async () => {
    await bot.start();
    process.stdout.write(`🤖 Bot started\n`);
  };

  const stop = async () => {
    await bot.stop();
    process.stdout.write(`🤖 Bot stopped\n`);
  };

  return { api, start, stop };
};

export type ServerApp = ReturnType<typeof ServerApp>;
