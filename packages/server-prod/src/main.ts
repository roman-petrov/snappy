import { Config } from "@snappy/config";
import { _ } from "@snappy/core";
import { App, ServerCache, Ssr } from "@snappy/server";
import { ServerApp } from "@snappy/server-app";
import { existsSync, readFileSync } from "node:fs";
import http from "node:http";
import https from "node:https";
import { join } from "node:path";

const sslCertB64 = process.env[`SSL_CERT_PEM`];
const sslKeyB64 = process.env[`SSL_KEY_PEM`];
const sslCertPem = sslCertB64 === undefined ? undefined : _.base64decode(sslCertB64);
const sslKeyPem = sslKeyB64 === undefined ? undefined : _.base64decode(sslKeyB64);
const portHttp = 80;
const portHttps = 443;
const useHttps = sslCertPem !== undefined && sslKeyPem !== undefined;
const port = useHttps ? portHttps : portHttp;
const botBaseUrl = useHttps ? `https://localhost:${portHttps}` : `http://localhost:${portHttp}`;
const version = process.env[`SNAPPY_VERSION`];
const root = join(import.meta.dirname, `www`);
const appContext = ServerApp(Config, { botBaseUrl, version });
const app = App.createApp({ api: appContext.api, botApiKey: Config.botApiKey });

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

const handler = (request: http.IncomingMessage, response: http.ServerResponse) => {
  app(request, response);
};

const httpServer = useHttps
  ? https.createServer({ cert: sslCertPem, key: sslKeyPem }, handler)
  : http.createServer(handler);

process.stdout.write(`🚀 Starting server…\n`);
void appContext.start();
await ssr.prewarmSsr(root, cache, [`ru`, `en`]);
httpServer.listen(port, () => {
  process.stdout.write(`🌐 Site server started on port ${port} (${useHttps ? `HTTPS` : `HTTP`})\n`);
});
