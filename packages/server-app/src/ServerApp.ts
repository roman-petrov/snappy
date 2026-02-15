/* eslint-disable functional/no-expression-statements */
import type { Config } from "@snappy/config";

import { SnappyBot } from "@snappy/snappy-bot";

import { createApi } from "./Api";
import { CreateContext } from "./Context";

export type ServerAppConfig = Config;

export const ServerApp = (config: ServerAppConfig, options?: { version?: string }) => {
  const context = CreateContext.create(config);
  const api = createApi(context);

  const bot = SnappyBot({
    apiBaseUrl: config.apiBaseUrl,
    apiKey: config.botApiKey,
    botToken: config.botToken,
    premiumPrice: config.premiumPrice,
    ...(options?.version !== undefined && { version: options.version }),
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
