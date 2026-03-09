/* eslint-disable functional/immutable-data */
import type { FastifyReply, FastifyRequest } from "fastify";

import { Config } from "@snappy/config";
import { _, Browser } from "@snappy/core";
import { App, ServerCache, Ssr } from "@snappy/server";
import { ServerApp } from "@snappy/server-app";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import http, { type Server } from "node:http";
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

const handlerRef: { current: ((request: http.IncomingMessage, response: http.ServerResponse) => void) | undefined } = {
  current: undefined,
};

const serverFactory = (handler: (request: http.IncomingMessage, response: http.ServerResponse) => void): Server => {
  handlerRef.current = handler;

  return http.createServer(handler);
};

const app = await App.createApp({ api: appContext.api, botApiKey: Config.botApiKey, serverFactory });
const cache = ServerCache();
const ssr = Ssr();
app.get(`/`, ssr.createCachedSsrHandler(siteRoot, cache));

const apkPath = join(distDir, `snappy.apk`);
app.get(`/download/snappy.apk`, async (_request: FastifyRequest, reply: FastifyReply) => {
  if (!existsSync(apkPath)) {
    reply.callNotFound();

    return;
  }
  reply.header(`Content-Disposition`, `attachment; filename="snappy.apk"`);
  reply.type(`application/vnd.android.package-archive`);
  await reply.send(createReadStream(apkPath));
});

const staticAppDesktop = cache.createStaticWithPrefix(appDesktopRoot, `/app`);
const staticAppMobile = cache.createStaticWithPrefix(appMobileRoot, `/app`);
const staticSite = cache.createStatic(siteRoot);
const appIndexPaths = [join(appDesktopRoot, `index.html`), join(appMobileRoot, `index.html`)] as const;
const appIndexKeys = [`app:index:desktop`, `app:index:mobile`] as const;

app.get(`*`, async (request: FastifyRequest, reply: FastifyReply) => {
  const pathname = cache.pathnameFromRequest(request);
  const userAgent = request.headers[`user-agent`];
  const mobile = Browser.mobile(_.isString(userAgent) ? userAgent : _.isArray(userAgent) ? userAgent[0] : ``);
  const acceptEncoding = request.headers[`accept-encoding`];

  const runChain = (step: number) => {
    if (step === 0) {
      if (!pathname.startsWith(`/app`) || pathname === `/app` || pathname === `/app/`) {
        runChain(1);

        return;
      }
      (mobile ? staticAppMobile : staticAppDesktop)(request, reply, () => runChain(1));

      return;
    }

    if (step === 1) {
      staticSite(request, reply, () => runChain(2));

      return;
    }

    if (step === 2) {
      if (!/^\/app(?:\/.*)?$/u.test(pathname)) {
        reply.callNotFound();

        return;
      }
      const appVariant = mobile ? 1 : 0;
      const indexPath = appIndexPaths[appVariant];
      const indexKey = appIndexKeys[appVariant];
      if (!existsSync(indexPath)) {
        reply.callNotFound();

        return;
      }
      const cached = cache.get(indexKey);
      if (cached !== undefined) {
        cache.sendCached(reply, cached, acceptEncoding, `text/html`);

        return;
      }
      cache.sendCached(
        reply,
        cache.set(indexKey, Buffer.from(readFileSync(indexPath, `utf8`), `utf8`), `text/html`),
        acceptEncoding,
        `text/html`,
      );
    }
  };

  runChain(0);
});

await app.ready();

process.stdout.write(`🚀 Starting server…\n`);
void appContext.start();
await ssr.prewarmSsr(siteRoot, cache, [`ru`, `en`]);

if (handlerRef.current === undefined) {
  throw new Error(`serverFactory was not called`);
}

startServers(handlerRef.current);
