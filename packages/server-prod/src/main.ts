import { Config } from "@snappy/config";
import { _ } from "@snappy/core";
import { Database } from "@snappy/db";
import { createApp, ServerCache, Ssr } from "@snappy/server";
import { Snappy } from "@snappy/snappy";
import { SnappyBot } from "@snappy/snappy-bot";
import { YooKassa } from "@snappy/yoo-kassa";
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

const cache = ServerCache();
const ssr = Ssr();
app.get(`/`, ssr.createCachedSsrHandler(root, cache));
app.use(cache.createStatic(root));
const appIndexPath = join(root, `app`, `index.html`);
const appIndexKey = `app:index`;
app.get(/^\/app(?:\/.*)?$/u, (request, response, next) => {
  if (!existsSync(appIndexPath)) {
    return next();
  }
  const cached = cache.get(appIndexKey);
  if (cached !== undefined) {
    cache.sendCached(response, cached, request.headers[`accept-encoding`], `text/html`);

    return undefined;
  }

  const entry = cache.set(appIndexKey, Buffer.from(readFileSync(appIndexPath, `utf8`), `utf8`), `text/html`);
  cache.sendCached(response, entry, request.headers[`accept-encoding`], `text/html`);

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
await ssr.prewarmSsr(root, cache, [`ru`, `en`]);
httpServer.listen(port, () => {
  process.stdout.write(`🌐 Site server started on port ${port} (${useHttps ? `HTTPS` : `HTTP`})\n`);
});
