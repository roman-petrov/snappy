import "dotenv/config";

const { env } = process;
const dbHost = env[`DB_HOST`] ?? ``;
const dbPort = Number(env[`DB_PORT`] ?? 0);
const dbUser = env[`DB_USER`] ?? ``;
const dbPassword = env[`DB_PASSWORD`] ?? ``;
const dbName = env[`DB_NAME`] ?? ``;
const dbUrl = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
const balanceMinRub = -1000;
const balancePaymentMinRub = 10;
const balancePaymentMaxRub = 500_000;
/** Multiplier on provider LLM cost (₽) when debiting the user (e.g. 1.25 → +25%). */
const llmDebitPriceMultiplier = 1.25;
const yooKassaSecretKey = env[`YOOKASSA_SECRET_KEY`];
const yooKassaShopId = env[`YOOKASSA_SHOP_ID`];
const jwtSecret = env[`JWT_SECRET`] ?? ``;
const proxyApiKey = env[`PROXY_API_KEY`] ?? ``;

export const Config = {
  balanceMinRub,
  balancePaymentMaxRub,
  balancePaymentMinRub,
  dbUrl,
  jwtSecret,
  llmDebitPriceMultiplier,
  proxyApiKey,
  yooKassaSecretKey,
  yooKassaShopId,
};

export type Config = typeof Config;
