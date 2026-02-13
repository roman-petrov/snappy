import { Config } from "@snappy/config";
import { _ } from "@snappy/core";
import { Database } from "@snappy/db";
import { createApp, createSsrHandler } from "@snappy/server";
import { Snappy } from "@snappy/snappy";
import { SnappyBot } from "@snappy/snappy-bot";
import { YooKassa } from "@snappy/yoo-kassa";
import express from "express";
import { existsSync, readFileSync } from "node:fs";
import http from "node:http";
import https from "node:https";
import { join } from "node:path";

const sslCertB64 = process.env[`SSL_CERT_PEM`];
const sslKeyB64 = process.env[`SSL_KEY_PEM`];
const sslCertPem = sslCertB64 === undefined ? undefined : _.base64decode(sslCertB64);
const sslKeyPem = sslKeyB64 === undefined ? undefined : _.base64decode(sslKeyB64);
const version = process.env[`SNAPPY_VERSION`];
const root = join(import.meta.dirname, `www`);
const db = Database(Config.dbUrl);
const snappy = Snappy({ gigaChatAuthKey: Config.gigaChatAuthKey });
const yooKassa = YooKassa({ secretKey: Config.yooKassaSecretKey, shopId: Config.yooKassaShopId });

const app = createApp({
  botApiKey: Config.botApiKey,
  db,
  freeRequestLimit: Config.freeRequestLimit,
  jwtSecret: Config.jwtSecret,
  premiumPrice: Config.premiumPrice,
  snappy,
  yooKassa,
});

app.disable(`x-powered-by`);
app.get(`/`, createSsrHandler(root));
app.use(express.static(root));
const appIndexPath = join(root, `app`, `index.html`);
app.get(/^\/app(?:\/.*)?$/u, (_request, response, next) => {
  if (!existsSync(appIndexPath)) {
    return next();
  }
  response.type(`html`).send(readFileSync(appIndexPath, `utf8`));

  return undefined;
});

const bot = SnappyBot({
  apiBaseUrl: Config.apiBaseUrl,
  apiKey: Config.botApiKey,
  botToken: Config.botToken,
  premiumPrice: Config.premiumPrice,
  version,
});

const portHttp = 80;
const portHttps = 443;
const useHttps = sslCertPem !== undefined && sslKeyPem !== undefined;
const port = useHttps ? portHttps : portHttp;

const handler = (request: http.IncomingMessage, response: http.ServerResponse) => {
  app(request, response);
};

const httpServer = useHttps
  ? https.createServer({ cert: sslCertPem, key: sslKeyPem }, handler)
  : http.createServer(handler);

process.stdout.write(`🚀 Starting server…\n`);
void bot.start();
httpServer.listen(port, () => {
  process.stdout.write(`🌐 Site server started on port ${port} (${useHttps ? `HTTPS` : `HTTP`})\n`);
});
