import { _ } from "@snappy/core";
import { File } from "@snappy/node";
import { createHmac } from "node:crypto";

import { ConfigValues } from "./ConfigValues";
import { DevTls } from "./DevTls";
import { type SecretKey, SecretKeys } from "./SecretKeys";

const requiredKey = (name: SecretKey) => () => ConfigValues.required(ConfigValues.values(), name);
const optionalKey = (name: SecretKey) => () => ConfigValues.values()[name];
const dbHost = requiredKey(SecretKeys.dbHost);
const dbName = requiredKey(SecretKeys.dbName);
const dbPassword = requiredKey(SecretKeys.dbPassword);
const dbPort = requiredKey(SecretKeys.dbPort);
const dbUser = requiredKey(SecretKeys.dbUser);
const dbAuth = () => `${dbUser()}:${dbPassword()}@${dbHost()}:${Number(dbPort())}`;
const dbUrl = () => `postgresql://${dbAuth()}/${dbName()}`;
const dbShadowUrl = () => `postgresql://${dbAuth()}/${dbName()}_shadow`;
const betterAuthJwtSecret = requiredKey(SecretKeys.jwtSecret);
const adminUsername = requiredKey(SecretKeys.adminUsername);
const adminPassword = requiredKey(SecretKeys.adminPassword);
const aiTunnelKey = requiredKey(SecretKeys.aiTunnelApiKey);
const smtpUser = requiredKey(SecretKeys.smtpUser);
const smtpPassword = requiredKey(SecretKeys.smtpPassword);
const yooKassaSecretKey = optionalKey(SecretKeys.yookassaSecretKey);
const yooKassaShopId = optionalKey(SecretKeys.yookassaShopId);
const androidCertSha256 = requiredKey(SecretKeys.androidCertSha256);
const adminSessionSecret = () => createHmac(`sha256`, betterAuthJwtSecret()).update(`snappy-admin-v1`).digest();
const smtpFrom = smtpUser;
const sslCertPem = requiredKey(SecretKeys.sslCertPem);
const sslCertKey = requiredKey(SecretKeys.sslCertKey);
const prodSsl = () => ({ cert: sslCertPem(), key: sslCertKey() });

const devSsl = () => {
  if (!File.exists(DevTls.certPath) || !File.exists(DevTls.keyPath)) {
    throw new Error(`Dev TLS cert missing. Run: bun do cert`);
  }

  return { cert: File.read(DevTls.certPath), key: File.read(DevTls.keyPath) };
};

const ssl = () => (ConfigValues.production() ? prodSsl() : devSsl());
const authEmailCooldownSec = _.minute.seconds;
const s3ObjectMaxAgeSec = _.day.seconds * _.daysInYear;
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
  androidCertSha256,
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
  s3ObjectMaxAgeSec,
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
