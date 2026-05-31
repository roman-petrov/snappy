/* eslint-disable functional/immutable-data */
import type { FastifyReply, FastifyRequest } from "fastify";

import fastifyStatic, { type FastifyStaticOptions } from "@fastify/static";
import { _ } from "@snappy/core";
import { App, AppManifestHost, Cookie, HtmlCache, SiteSsr, Ssr } from "@snappy/server";
import { ServerApp } from "@snappy/server-app";
import { createReadStream, existsSync, readFileSync } from "node:fs";
import http from "node:http";
import https from "node:https";
import { join } from "node:path";

import { DevCert } from "./DevCert";

const sslCertB64 = process.env[`SSL_CERT_PEM`];
const sslKeyB64 = process.env[`SSL_KEY_PEM`];
const sslCertPem = sslCertB64 === undefined ? undefined : _.base64decode(sslCertB64);
const sslKeyPem = sslKeyB64 === undefined ? undefined : _.base64decode(sslKeyB64);
const portHttp = 80;
const portHttps = 443;
const distDir = join(process.cwd(), `dist`);
const siteRoot = join(distDir, `site`);
const appRoot = join(distDir, `app`);
const appIndexPath = join(appRoot, `index.html`);

const handlerRef: { current: ((request: http.IncomingMessage, response: http.ServerResponse) => void) | undefined } = {
  current: undefined,
};

const hasHashInName = (path: string) => /[-.]\w{8,}\./u.test(path.split(/[/\\]/u).pop() ?? ``);

const staticHeaders: NonNullable<FastifyStaticOptions[`setHeaders`]> = (response, path) => {
  if (hasHashInName(path)) {
    response.setHeader(`Cache-Control`, `public, max-age=${_.day.seconds * _.daysInYear}, immutable`);
  }
};

const app = await App({
  api: ServerApp(),
  serverFactory: handler => {
    handlerRef.current = handler;

    return http.createServer(handler);
  },
});

const htmlCache = HtmlCache();
const ssr = Ssr();

app.get(`/`, ssr.createCachedSsrHandler(siteRoot, htmlCache));

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

await app.register(fastifyStatic, {
  index: false,
  preCompressed: true,
  prefix: `/app/assets/`,
  root: join(appRoot, `assets`),
  setHeaders: staticHeaders,
});

await app.register(fastifyStatic, {
  decorateReply: false,
  index: false,
  preCompressed: true,
  prefix: `/assets/`,
  root: join(siteRoot, `assets`),
  setHeaders: staticHeaders,
});

app.get(`/favicon.svg`, async (_request, reply) => {
  await reply.sendFile(`favicon.svg`, siteRoot);
});

app.get(`/app/favicon.svg`, async (_request, reply) => {
  await reply.sendFile(`favicon.svg`, appRoot);
});

AppManifestHost.fastify(app);

const serveAppShell = async (request: FastifyRequest, reply: FastifyReply) => {
  if (!existsSync(appIndexPath)) {
    reply.callNotFound();

    return;
  }
  const { locale, theme } = Cookie(request.headers.cookie);
  const key = `app:index:${locale}:${theme ?? `system`}`;
  await htmlCache.replyCached(reply, key, `text/html`, () =>
    SiteSsr.prepareAppIndex(readFileSync(appIndexPath, `utf8`), locale, theme),
  );
};

app.get(`/app`, async (_request, reply) => {
  await reply.redirect(`/app/`);
});

app.get(`/app/`, serveAppShell);
app.get(`/app/*`, serveAppShell);

await app.ready();

const tls = sslCertPem !== undefined && sslKeyPem !== undefined ? { cert: sslCertPem, key: sslKeyPem } : DevCert.read();

https.createServer(tls, handlerRef.current).listen(portHttps, `0.0.0.0`);
http.createServer(handlerRef.current).listen(portHttp, `127.0.0.1`);
