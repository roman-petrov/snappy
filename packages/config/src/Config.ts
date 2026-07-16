import { _ } from "@snappy/core";
import { File } from "@snappy/node";
import { createHmac } from "node:crypto";

import { ConfigValues } from "./ConfigValues";
import { DevTls } from "./DevTls";
import { type SecretKey, SecretKeys } from "./SecretKeys";

const key = (name: SecretKey) => () => ConfigValues.required(ConfigValues.values(), name);
const dbHost = key(SecretKeys.dbHost);
const dbName = key(SecretKeys.dbName);
const dbPassword = key(SecretKeys.dbPassword);
const dbPort = key(SecretKeys.dbPort);
const dbUser = key(SecretKeys.dbUser);
const dbAuth = () => `${dbUser()}:${dbPassword()}@${dbHost()}:${Number(dbPort())}`;
const dbUrl = () => `postgresql://${dbAuth()}/${dbName()}`;
const dbShadowUrl = () => `postgresql://${dbAuth()}/${dbName()}_shadow`;
const betterAuthJwtSecret = key(SecretKeys.jwtSecret);
const adminUsername = key(SecretKeys.adminUsername);
const adminPassword = key(SecretKeys.adminPassword);
const aiTunnelKey = key(SecretKeys.aiTunnelApiKey);
const smtpUser = key(SecretKeys.smtpUser);
const smtpPassword = key(SecretKeys.smtpPassword);
const roboKassaMerchantLogin = key(SecretKeys.robokassaMerchantLogin);
const roboKassaPassword1 = key(SecretKeys.robokassaPassword1);
const roboKassaPassword2 = key(SecretKeys.robokassaPassword2);
const tunnelKey = key(SecretKeys.tunnelKey);
const androidCertSha256 = key(SecretKeys.androidCertSha256);
const adminSessionSecret = () => createHmac(`sha256`, betterAuthJwtSecret()).update(`snappy-admin-v1`).digest();
const sslCertPem = key(SecretKeys.sslCertPem);
const sslCertKey = key(SecretKeys.sslCertKey);
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
const balance = { llmCommission: 0.25, paymentMax: 5000, paymentMin: 50, signUpBonus: 50 };
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
  balance,
  betterAuthJwtSecret,
  dbHost,
  dbName,
  dbPassword,
  dbPort,
  dbShadowUrl,
  dbUrl,
  dbUser,
  host,
  roboKassaMerchantLogin,
  roboKassaPassword1,
  roboKassaPassword2,
  s3ObjectMaxAgeSec,
  smtpHost,
  smtpPassword,
  smtpPort,
  smtpUser,
  ssl,
  tunnelKey,
};

export type Config = typeof Config;
