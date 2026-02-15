import type { Config } from "@snappy/config";

import { Database } from "@snappy/db";
import { Snappy } from "@snappy/snappy";
import { YooKassa } from "@snappy/yoo-kassa";

const create = (config: Config) => {
  const db = Database(config.dbUrl);
  const snappy = Snappy({ gigaChatAuthKey: config.gigaChatAuthKey });
  const yooKassa = YooKassa({ secretKey: config.yooKassaSecretKey, shopId: config.yooKassaShopId });

  return {
    db,
    freeRequestLimit: config.freeRequestLimit,
    jwtSecret: config.jwtSecret,
    premiumPrice: config.premiumPrice,
    snappy,
    yooKassa,
  };
};

export const CreateContext = { create };

export type ApiContext = ReturnType<typeof create>;
