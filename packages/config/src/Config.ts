import "dotenv/config";

const { env } = process;
const dbHost = env[`DB_HOST`] ?? ``;
const dbPort = Number(env[`DB_PORT`] ?? 0);
const dbUser = env[`DB_USER`] ?? ``;
const dbPassword = env[`DB_PASSWORD`] ?? ``;
const dbName = env[`DB_NAME`] ?? ``;
const botToken = env[`BOT_TOKEN`] ?? ``;
const dbUrl = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
const freeRequestLimit = 10;
const gigaChatAuthKey = env[`GIGACHAT_AUTH_KEY`] ?? ``;
const premiumPrice = 299;
const yooKassaSecretKey = env[`YOOKASSA_SECRET_KEY`];
const yooKassaShopId = env[`YOOKASSA_SHOP_ID`];
const botApiKey = env[`BOT_API_KEY`] ?? ``;
const jwtSecret = env[`JWT_SECRET`] ?? ``;

export const Config = {
  botApiKey,
  botToken,
  dbUrl,
  freeRequestLimit,
  gigaChatAuthKey,
  jwtSecret,
  premiumPrice,
  yooKassaSecretKey,
  yooKassaShopId,
};

export type Config = typeof Config;
