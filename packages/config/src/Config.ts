import { _ } from "@snappy/core";
import { createHmac } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

import { ConfigValues } from "./ConfigValues";
import { DevTls } from "./DevTls";

const requiredKey = (name: string) => () => ConfigValues.required(ConfigValues.values(), name);
const optionalKey = (name: string) => () => ConfigValues.values()[name];
const dbHost = requiredKey(`DB_HOST`);
const dbName = requiredKey(`DB_NAME`);
const dbPassword = requiredKey(`DB_PASSWORD`);
const dbPort = requiredKey(`DB_PORT`);
const dbUser = requiredKey(`DB_USER`);
const dbAuth = () => `${dbUser()}:${dbPassword()}@${dbHost()}:${Number(dbPort())}`;
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

const ssl = () => (ConfigValues.production() ? prodSsl() : devSsl());
const authEmailCooldownSec = _.minute.seconds;
const s3SignedUrlTtlDays = 3;
const s3SignedUrlTtlSec = s3SignedUrlTtlDays * _.day.seconds;
const balancePaymentMinRub = 10;
const balancePaymentMaxRub = 5000;
const host = ConfigValues.production() ? ConfigValues.prodHost : ConfigValues.devHost;
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
  dbHost,
  dbName,
  dbPassword,
  dbPort,
  dbShadowUrl,
  dbUrl,
  dbUser,
  host,
  s3SignedUrlTtlSec,
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
