import type { Config } from "@snappy/config";
import { Database } from "@snappy/db";
import { Snappy } from "@snappy/snappy";
import { YooKassa } from "@snappy/yoo-kassa";

type CreateAppContextConfig = {
  dbUrl: string;
  gigaChatAuthKey: string;
  yooKassaSecretKey: string;
  yooKassaShopId: string;
};

const create = (config: CreateAppContextConfig) => {
  const db = Database(config.dbUrl);
  const snappy = Snappy({ gigaChatAuthKey: config.gigaChatAuthKey });
  const yooKassa = YooKassa({ secretKey: config.yooKassaSecretKey, shopId: config.yooKassaShopId });

  return { db, snappy, yooKassa };
};

const createAppOptions = (config: Config) => ({
  ...create(config),
  botApiKey: config.botApiKey,
  freeRequestLimit: config.freeRequestLimit,
  jwtSecret: config.jwtSecret,
  premiumPrice: config.premiumPrice,
});

export const CreateAppContext = { create, createAppOptions };
