import "dotenv/config";
import { createHmac } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

import { DevTls } from "./DevTls";

const { env } = process;
const isProduction = env.NODE_ENV === `production`;
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
const adminSessionSecret = createHmac(`sha256`, betterAuthJwtSecret).update(`snappy-admin-v1`).digest();
const aiTunnelKey = env[`AI_TUNNEL_API_KEY`] ?? ``;
const host = isProduction ? `snappy-ai.ru` : `home.local`;

const admin = () => {
  const adminUsername = env[`ADMIN_USERNAME`] ?? ``;
  const adminPassword = env[`ADMIN_PASSWORD`] ?? ``;
  if (isProduction && (adminUsername === `` || adminPassword === ``)) {
    throw new Error(`ADMIN_USERNAME and ADMIN_PASSWORD must be set in production`);
  }

  return { adminPassword, adminUsername };
};

const { adminPassword, adminUsername } = admin();

const prodSsl = () => {
  const certB64 = env[`SSL_CERT_PEM`];
  const keyB64 = env[`SSL_KEY_PEM`];
  if (certB64 === undefined || keyB64 === undefined) {
    throw new Error(`SSL_CERT_PEM and SSL_KEY_PEM must be set in production`);
  }

  const cert = Buffer.from(certB64, `base64`).toString(`utf8`);
  const key = Buffer.from(keyB64, `base64`).toString(`utf8`);

  return { cert, key };
};

const devSsl = () => {
  if (!existsSync(DevTls.certPath) || !existsSync(DevTls.keyPath)) {
    throw new Error(`Dev TLS cert missing. Run: bun do cert`);
  }

  const cert = readFileSync(DevTls.certPath, `utf8`);
  const key = readFileSync(DevTls.keyPath, `utf8`);

  return { cert, key };
};

const sslCert = isProduction ? prodSsl() : devSsl();

export const Config = {
  adminPassword,
  adminSessionSecret,
  adminUsername,
  aiTunnelKey,
  balanceMinRub,
  balancePaymentMaxRub,
  balancePaymentMinRub,
  betterAuthJwtSecret,
  dbShadowUrl,
  dbUrl,
  host,
  sslCert,
  yooKassaSecretKey,
  yooKassaShopId,
};

export type Config = typeof Config;
