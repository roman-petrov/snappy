/* eslint-disable functional/immutable-data */
import type { FastifyReply, FastifyRequest } from "fastify";

import { Config } from "@snappy/config";
import { _ } from "@snappy/core";
import { App, Cookie, ServerCache, SiteSsr, Ssr } from "@snappy/server";
import { ServerApp } from "@snappy/server-app";
import { createReadStream, existsSync, readFileSync } from "node:fs";
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
const version = process.env[`SNAPPY_VERSION`];
const distDir = join(import.meta.dirname, `..`, `..`, `..`, `dist`);
const siteRoot = join(distDir, `site`);
const appRoot = join(distDir, `app`);
const appContext = ServerApp(Config, { apiBaseUrl: `http://127.0.0.1`, version });

const handlerRef: { current: ((request: http.IncomingMessage, response: http.ServerResponse) => void) | undefined } = {
  current: undefined,
};

const app = await App.createApp({
  api: appContext.api,
  botApiKey: Config.botApiKey,
  serverFactory: handler => {
    handlerRef.current = handler;

    return http.createServer(handler);
  },
});

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

const staticApp = cache.createStaticWithPrefix(appRoot, `/app`);
const staticSite = cache.createStatic(siteRoot);
const appIndexPath = join(appRoot, `index.html`);
const getAppIndexKey = (locale: string, theme: string) => `app:index:${locale}:${theme}`;

app.get(`*`, async (request: FastifyRequest, reply: FastifyReply) => {
  const pathname = cache.pathnameFromRequest(request);
  const acceptEncoding = request.headers[`accept-encoding`];
  const { locale, theme } = Cookie(request.headers.cookie);
  const themeKey = theme ?? `system`;

  const runChain = async (step: number) => {
    if (step === 0) {
      if (!pathname.startsWith(`/app`) || pathname === `/app` || pathname === `/app/`) {
        await runChain(1);

        return;
      }
      staticApp(request, reply, () => {
        void runChain(1);
      });

      return;
    }

    if (step === 1) {
      staticSite(request, reply, () => {
        void runChain(2);
      });

      return;
    }

    if (step === 2) {
      if (!/^\/app(?:\/.*)?$/u.test(pathname)) {
        reply.callNotFound();

        return;
      }
      if (!existsSync(appIndexPath)) {
        reply.callNotFound();

        return;
      }
      const appIndexKey = getAppIndexKey(locale, themeKey);
      await cache.replyCached(reply, appIndexKey, acceptEncoding, `text/html`, () =>
        SiteSsr.prepareAppIndex(readFileSync(appIndexPath, `utf8`), locale, theme),
      );
    }
  };

  await runChain(0);
});

await app.ready();
await ssr.prewarmSsr(siteRoot, cache, [`ru`, `en`]);

if (handlerRef.current === undefined) {
  throw new Error(`serverFactory was not called`);
}

void appContext.start();
if (useHttps) {
  https.createServer({ cert: sslCertPem, key: sslKeyPem }, handlerRef.current).listen(portHttps, () => {
    process.stdout.write(`🌐 Site + API on port https://localhost\n`);
  });
  http.createServer(handlerRef.current).listen(portHttp, `127.0.0.1`, () => {
    process.stdout.write(`🌐 API (bot) at http://127.0.0.1\n`);
  });
} else {
  http.createServer(handlerRef.current).listen(portHttp, () => {
    process.stdout.write(`🌐 Site + API at http://localhost\n`);
  });
}
