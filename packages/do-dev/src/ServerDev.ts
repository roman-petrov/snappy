/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
/* eslint-disable unicorn/try-complexity */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { Admin } from "@snappy/admin-server";
import { App, AppManifestHost } from "@snappy/app-server";
import { Config } from "@snappy/config";
import { _, HttpStatus, MimeType } from "@snappy/core";
import { ViteConfig } from "@snappy/do/config/vite";
import { File } from "@snappy/node";
import { Fastify, Html } from "@snappy/server";
import { SiteSsr, type SsrEntry } from "@snappy/site-server";
import { Settings } from "@snappy/ui-core";
import express from "express";
import * as http from "node:http";
import https from "node:https";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { createServer as createViteServer } from "vite";

import type { ServerDevHtml } from "./Types";

import { ServerDevSpa } from "./ServerDevSpa";

export const ServerDev = async () => {
  const projectRoot = join(import.meta.dirname, `..`, `..`, `..`);
  const siteDir = join(projectRoot, `packages`, `site`);
  const faviconPath = join(projectRoot, `packages`, `ui`, `src`, `assets`, `favicon.svg`);
  const siteEntryPath = join(siteDir, `src`, `entry-server.tsx`);
  const portHttps = 443;
  const devInput = [`site`, `app`, `admin`].map(name => join(projectRoot, `packages`, name, `index.html`));
  const apiApp = await Fastify();
  await App({ app: apiApp });
  await Admin({ app: apiApp });
  const apiAddr = await apiApp.listen({ host: `127.0.0.1`, port: 0 });
  const apiPort = Number(new URL(apiAddr).port);
  const app = express();
  const server = https.createServer(Config.ssl(), app);

  const configBuilder = ViteConfig(
    {
      build: { rollupOptions: { input: devInput } },
      resolve: {
        alias: {
          "/admin": join(projectRoot, `packages`, `admin`),
          "/app": join(projectRoot, `packages`, `app`),
          "/src": join(siteDir, `src`),
        },
      },
      root: projectRoot,
    },
    { analyzeFileName: `dev` },
  );

  const config = await Promise.resolve(configBuilder({ command: `serve`, mode: `development` }));

  const vite = await createViteServer({
    ...config,
    appType: `custom`,
    configFile: false,
    server: {
      ...config.server,
      allowedHosts: true,
      hmr: { clientPort: portHttps, host: Config.host, protocol: `wss`, server },
      middlewareMode: true,
      origin: _.https(Config.host),
    },
  });

  app.use(`/api`, (request, response) => {
    const options = {
      headers: { ...request.headers, host: `127.0.0.1:${apiPort}` },
      hostname: `127.0.0.1`,
      method: request.method,
      path: request.originalUrl,
      port: apiPort,
    };

    const proxyRequest = http.request(options, proxyResponse => {
      response.writeHead(proxyResponse.statusCode ?? HttpStatus.internalServerError, proxyResponse.headers);
      proxyResponse.pipe(response);
    });
    proxyRequest.on(`error`, () => {
      response.statusCode = HttpStatus.badGateway;
      response.end(`API proxy error`);
    });
    request.pipe(proxyRequest);
  });

  const html: ServerDevHtml = ({ body, dir, documentUrl, path, skip }) => {
    app.get(path, async (request, response, next) => {
      if (skip?.(request) ?? false) {
        next();

        return;
      }
      try {
        const indexPath = join(dir, `index.html`);

        const template = await vite.transformIndexHtml(
          documentUrl ?? pathToFileURL(indexPath).href,
          File.read(indexPath),
        );
        response
          .type(`html`)
          .send(await Promise.resolve(body({ ...Settings({ headers: request.headers }), template })));
      } catch (error) {
        vite.ssrFixStacktrace(error as Error);
        next(error);
      }
    });
  };

  app.get(`/favicon.svg`, (_request, response) => response.type(MimeType.imageSvg).sendFile(faviconPath));

  AppManifestHost.express(app);

  const serverDevSpa = ServerDevSpa({ expressApp: app, faviconPath, html, projectRoot });
  serverDevSpa.register({ packageName: `app`, urlPrefix: `/app` });
  serverDevSpa.register({ packageName: `admin`, urlPrefix: `/admin` });

  html({
    body: async ({ locale, template, theme }) =>
      SiteSsr.build(
        locale,
        theme,
        template,
        (await vite.ssrLoadModule(pathToFileURL(siteEntryPath).href)) as SsrEntry,
        Html.injectTheme,
      ),
    dir: siteDir,
    path: `/`,
  });

  app.use((request, _response, next) => {
    const { path } = request;
    if (path.startsWith(`/src/`) && !path.startsWith(`/app`) && !path.startsWith(`/admin`)) {
      request.url = `/packages/site${path}`;
    } else {
      serverDevSpa.rewrite(request);
    }
    next();
  });
  serverDevSpa.mountPublic();
  app.use(vite.middlewares);

  server.listen({ host: `::`, ipv6Only: false, port: portHttps });
};
