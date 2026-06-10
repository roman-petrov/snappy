import "dotenv/config";
import { _ } from "@snappy/core";
import { createHmac } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

import { DevTls } from "./DevTls";

const { env } = process;
const isProduction = env.NODE_ENV === `production`;

const requiredKey = (name: string) => () => {
  const value = env[name];
  if (value === undefined || value === ``) {
    throw new Error(`${name} must be set`);
  }

  return value;
};

const optionalKey = (name: string) => () => env[name];
const dbName = requiredKey(`DB_NAME`);

const dbAuth = () =>
  `${requiredKey(`DB_USER`)()}:${requiredKey(`DB_PASSWORD`)()}@${requiredKey(`DB_HOST`)()}:${Number(requiredKey(`DB_PORT`)())}`;

const dbUrl = () => `postgresql://${dbAuth()}/${dbName()}`;
const dbShadowUrl = () => `postgresql://${dbAuth()}/${dbName()}_shadow`;
const betterAuthJwtSecret = requiredKey(`JWT_SECRET`);
const adminUsername = requiredKey(`ADMIN_USERNAME`);
const adminPassword = requiredKey(`ADMIN_PASSWORD`);
const aiTunnelKey = requiredKey(`AI_TUNNEL_API_KEY`);
const smtpUser = requiredKey(`SMTP_USER`);
const smtpPassword = requiredKey(`SMTP_PASSWORD`);
const yooKassaSecretKey = optionalKey(`YOOKASSA_SECRET_KEY`);
const yooKassaShopId = optionalKey(`YOOKASSA_SHOP_ID`);
const adminSessionSecret = () => createHmac(`sha256`, betterAuthJwtSecret()).update(`snappy-admin-v1`).digest();
const smtpFrom = smtpUser;
const sslCertPem = requiredKey(`SSL_CERT_PEM`);
const sslCertKey = requiredKey(`SSL_CERT_KEY`);
const prodSsl = () => ({ cert: sslCertPem(), key: sslCertKey() });

const devSsl = () => {
  if (!existsSync(DevTls.certPath) || !existsSync(DevTls.keyPath)) {
    throw new Error(`Dev TLS cert missing. Run: bun do cert`);
  }

  return { cert: readFileSync(DevTls.certPath, `utf8`), key: readFileSync(DevTls.keyPath, `utf8`) };
};

const ssl = () => (isProduction ? prodSsl() : devSsl());
const authEmailCooldownSec = _.minute.seconds;
const balancePaymentMinRub = 10;
const balancePaymentMaxRub = 5000;
const host = isProduction ? `snappy-ai.ru` : `home.local`;
const smtpHost = `smtp.mail.ru`;
const smtpPort = 465;

export const Config = {
  adminPassword,
  adminSessionSecret,
  adminUsername,
  aiTunnelKey,
  authEmailCooldownSec,
  balancePaymentMaxRub,
  balancePaymentMinRub,
  betterAuthJwtSecret,
  dbShadowUrl,
  dbUrl,
  host,
  smtpFrom,
  smtpHost,
  smtpPassword,
  smtpPort,
  smtpUser,
  ssl,
  yooKassaSecretKey,
  yooKassaShopId,
};

export type Config = typeof Config;
