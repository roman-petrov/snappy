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
const yooKassaSecretKey = env[`YOOKASSA_SECRET_KEY`];
const yooKassaShopId = env[`YOOKASSA_SHOP_ID`];
const betterAuthJwtSecret = env[`JWT_SECRET`] ?? ``;
const aiTunnelKey = env[`AI_TUNNEL_API_KEY`] ?? ``;
const isProduction = env.NODE_ENV === `production`;
const origin = isProduction ? `https://snappy-ai.ru` : `https://localhost`;
const betterAuthTrustedOrigins = [...new Set([origin, ...(isProduction ? [] : ([`https://home.local`] as const))])];

export const Config = {
  aiTunnelKey,
  balanceMinRub,
  balancePaymentMaxRub,
  balancePaymentMinRub,
  betterAuthJwtSecret,
  betterAuthTrustedOrigins,
  dbUrl,
  origin,
  yooKassaSecretKey,
  yooKassaShopId,
};

export type Config = typeof Config;
