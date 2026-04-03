import "dotenv/config";
import { join } from "node:path";

const { env } = process;
const dbHost = env[`DB_HOST`] ?? ``;
const dbPort = Number(env[`DB_PORT`] ?? 0);
const dbUser = env[`DB_USER`] ?? ``;
const dbPassword = env[`DB_PASSWORD`] ?? ``;
const dbName = env[`DB_NAME`] ?? ``;
const dbUrl = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
const freeRequestLimit = 10;

const filesStorageRoot =
  env[`SNAPPY_FILES_DIR`] === undefined ? join(process.cwd(), `.snappy-files`) : env[`SNAPPY_FILES_DIR`];

const premiumPeriodDays = 30;
const premiumPrice = 199;
const yooKassaSecretKey = env[`YOOKASSA_SECRET_KEY`];
const yooKassaShopId = env[`YOOKASSA_SHOP_ID`];
const jwtSecret = env[`JWT_SECRET`] ?? ``;

export const Config = {
  dbUrl,
  filesStorageRoot,
  freeRequestLimit,
  jwtSecret,
  premiumPeriodDays,
  premiumPrice,
  yooKassaSecretKey,
  yooKassaShopId,
};

export type Config = typeof Config;
