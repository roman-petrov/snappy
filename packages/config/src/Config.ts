import "dotenv/config";

const { env } = process;
const dbHost = env[`DB_HOST`] ?? ``;
const dbPort = Number(env[`DB_PORT`] ?? 0);
const dbUser = env[`DB_USER`] ?? ``;
const dbPassword = env[`DB_PASSWORD`] ?? ``;
const dbName = env[`DB_NAME`] ?? ``;
const dbAuth = `${dbUser}:${dbPassword}@${dbHost}:${dbPort}`;
const dbUrl = `postgresql://${dbAuth}/${dbName}`;
const dbShadowUrl = `postgresql://${dbAuth}/${dbName}_shadow`;
const balanceMinRub = -1000;
const balancePaymentMinRub = 10;
const balancePaymentMaxRub = 5000;
const yooKassaSecretKey = env[`YOOKASSA_SECRET_KEY`];
const yooKassaShopId = env[`YOOKASSA_SHOP_ID`];
const betterAuthJwtSecret = env[`JWT_SECRET`] ?? ``;
const aiTunnelKey = env[`AI_TUNNEL_API_KEY`] ?? ``;
const host = env.NODE_ENV === `production` ? `snappy-ai.ru` : `home.local`;

export const Config = {
  aiTunnelKey,
  balanceMinRub,
  balancePaymentMaxRub,
  balancePaymentMinRub,
  betterAuthJwtSecret,
  dbShadowUrl,
  dbUrl,
  host,
  yooKassaSecretKey,
  yooKassaShopId,
};

export type Config = typeof Config;
