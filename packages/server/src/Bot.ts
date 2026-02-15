import type { Config } from "@snappy/config";

import { SnappyBot } from "@snappy/snappy-bot";

export const createBot = (
  config: Pick<Config, `apiBaseUrl` | `botApiKey` | `botToken` | `premiumPrice`>,
  options?: { version?: string },
) =>
  SnappyBot({
    apiBaseUrl: config.apiBaseUrl,
    apiKey: config.botApiKey,
    botToken: config.botToken,
    premiumPrice: config.premiumPrice,
    ...(options?.version !== undefined && { version: options.version }),
  });
