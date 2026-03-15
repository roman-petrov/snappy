/* eslint-disable functional/no-expression-statements */
import type { Config } from "@snappy/config";

import { Database } from "@snappy/db";
import { Snappy } from "@snappy/snappy";
import { SnappyBot } from "@snappy/snappy-bot";
import { YooKassa } from "@snappy/yoo-kassa";

import { ServerAppApi } from "./ServerAppApi";

export const ServerApp = (
  {
    botApiKey,
    botToken,
    dbUrl,
    freeRequestLimit,
    gigaChatAuthKey,
    jwtSecret,
    premiumPrice,
    yooKassaSecretKey,
    yooKassaShopId,
  }: Config,
  { apiBaseUrl, version }: { apiBaseUrl: string; version?: string },
) => {
  const db = Database(dbUrl);
  const snappy = Snappy({ gigaChatAuthKey });
  const yooKassa = YooKassa({ secretKey: yooKassaSecretKey, shopId: yooKassaShopId });
  const api = ServerAppApi({ db, freeRequestLimit, jwtSecret, premiumPrice, snappy, yooKassa });

  const bot = SnappyBot({
    apiKey: botApiKey,
    apiUrl: apiBaseUrl,
    botToken,
    premiumPrice,
    ...(version !== undefined && { version }),
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
