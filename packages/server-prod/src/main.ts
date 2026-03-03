import { Config } from "@snappy/config";
import { _, Browser } from "@snappy/core";
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

const distDir = join(import.meta.dirname, `..`, `..`, `..`, `dist`);
const siteRoot = join(distDir, `site`);
const appDesktopRoot = join(distDir, `app-desktop`);
const appMobileRoot = join(distDir, `app-mobile`);
const appContext = ServerApp(Config, { botBaseUrl, version });
const app = App.createApp({ api: appContext.api, botApiKey: Config.botApiKey });

app.disable(`x-powered-by`);

const cache = ServerCache();
const ssr = Ssr();
app.get(`/`, ssr.createCachedSsrHandler(siteRoot, cache));
const staticAppDesktop = cache.createStaticWithPrefix(appDesktopRoot, `/app`);
const staticAppMobile = cache.createStaticWithPrefix(appMobileRoot, `/app`);
app.use((request, response, next) => {
  const path = request.path || `/`;
  if (!path.startsWith(`/app`)) {
    return next();
  }
  const mobile = Browser.mobile(request.get(`user-agent`) ?? ``);

  return (mobile ? staticAppMobile : staticAppDesktop)(request, response, next);
});

app.use(cache.createStatic(siteRoot));
const appIndexDesktopPath = join(appDesktopRoot, `index.html`);
const appIndexMobilePath = join(appMobileRoot, `index.html`);
const appIndexDesktopKey = `app:index:desktop`;
const appIndexMobileKey = `app:index:mobile`;
app.get(/^\/app(?:\/.*)?$/u, (request, response, next) => {
  const mobile = Browser.mobile(request.get(`user-agent`) ?? ``);
  const indexPath = mobile ? appIndexMobilePath : appIndexDesktopPath;
  const indexKey = mobile ? appIndexMobileKey : appIndexDesktopKey;
  if (!existsSync(indexPath)) {
    return next();
  }
  const cached = cache.get(indexKey);
  if (cached !== undefined) {
    cache.sendCached(response, cached, request.get(`accept-encoding`), `text/html`);

    return undefined;
  }
  const entry = cache.set(indexKey, Buffer.from(readFileSync(indexPath, `utf8`), `utf8`), `text/html`);
  cache.sendCached(response, entry, request.get(`accept-encoding`), `text/html`);

  return undefined;
});

const handler = (request: http.IncomingMessage, response: http.ServerResponse) => {
  app(request, response);
};

process.stdout.write(`🚀 Starting server…\n`);
void appContext.start();
await ssr.prewarmSsr(siteRoot, cache, [`ru`, `en`]);

startServers(handler);
