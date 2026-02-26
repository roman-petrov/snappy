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
const portInternal = 12_780;
const useHttps = sslCertPem !== undefined && sslKeyPem !== undefined;
const version = process.env[`SNAPPY_VERSION`];

const { botBaseUrl, startServers } = useHttps
  ? {
      botBaseUrl: `http://127.0.0.1:${portInternal}` as const,
      startServers: (handler: (request: http.IncomingMessage, response: http.ServerResponse) => void) => {
        https.createServer({ cert: sslCertPem, key: sslKeyPem }, handler).listen(portHttps, () => {
          process.stdout.write(`🌐 Site server started on port ${portHttps} (HTTPS)\n`);
        });
        http.createServer(handler).listen(portInternal, `127.0.0.1`, () => {
          process.stdout.write(`🔗 Internal API (bot) on http://127.0.0.1:${portInternal}\n`);
        });
      },
    }
  : {
      botBaseUrl: `http://localhost:${portHttp}` as const,
      startServers: (handler: (request: http.IncomingMessage, response: http.ServerResponse) => void) => {
        http.createServer(handler).listen(portHttp, () => {
          process.stdout.write(`🌐 Site server started on port ${portHttp} (HTTP)\n`);
        });
      },
    };

const root = join(import.meta.dirname, `..`, `..`, `..`, `dist`, `www`);
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

process.stdout.write(`🚀 Starting server…\n`);
void appContext.start();
await ssr.prewarmSsr(root, cache, [`ru`, `en`]);

startServers(handler);
