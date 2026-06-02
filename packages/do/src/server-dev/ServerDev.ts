/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { App, AppManifestHost } from "@snappy/app-server";
import { Config } from "@snappy/config";
import { HttpStatus } from "@snappy/core";
import { Cookie, Fastify, Html } from "@snappy/server";
import { SiteSsr, type SsrEntry } from "@snappy/site-server";
import express from "express";
import { readFileSync } from "node:fs";
import * as http from "node:http";
import https from "node:https";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { createServer as createViteServer } from "vite";

import { ViteConfig } from "../config/vite/ViteConfig";

export const ServerDev = async () => {
  const projectRoot = join(import.meta.dirname, `..`, `..`, `..`, `..`);
  const siteDir = join(projectRoot, `packages`, `site`);
  const appDir = join(projectRoot, `packages`, `app`);
  const faviconPath = join(projectRoot, `packages`, `ui`, `src`, `assets`, `favicon.svg`);
  const siteEntryPath = join(siteDir, `src`, `entry-server.tsx`);
  const portHttps = 443;
  const devInput = [`site`, `app`].map(name => join(projectRoot, `packages`, name, `index.html`));
  const apiApp = Fastify();
  await App({ app: apiApp });
  const apiAddr = await apiApp.listen({ host: `127.0.0.1`, port: 0 });
  const apiPort = Number(new URL(apiAddr).port);
  const app = express();
  const server = https.createServer(Config.sslCert, app);

  const configBuilder = ViteConfig(
    {
      build: { rollupOptions: { input: devInput } },
      resolve: { alias: { "/app": appDir, "/src": join(siteDir, `src`) } },
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
      origin: `https://${Config.host}`,
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

  type HtmlConfig = {
    body: (input: ReturnType<typeof Cookie> & { template: string }) => Promise<string> | string;
    dir: string;
    documentUrl?: string;
    path: RegExp | string;
    skip?: (request: express.Request) => boolean;
  };

  const html = ({ body, dir, documentUrl, path, skip }: HtmlConfig) => {
    app.get(path, async (request, response, next) => {
      if (skip?.(request) ?? false) {
        next();

        return;
      }
      try {
        const cookie = Cookie(request.headers.cookie);
        const indexPath = join(dir, `index.html`);

        const template = await vite.transformIndexHtml(
          documentUrl ?? pathToFileURL(indexPath).href,
          readFileSync(indexPath, `utf8`),
        );
        response.type(`html`).send(await Promise.resolve(body({ ...cookie, template })));
      } catch (error) {
        vite.ssrFixStacktrace(error as Error);
        next(error);
      }
    });
  };

  for (const path of [`/favicon.svg`, `/app/favicon.svg`]) {
    app.get(path, (_request, response) => response.type(`image/svg+xml`).sendFile(faviconPath));
  }

  AppManifestHost.express(app, Cookie);

  html({
    body: ({ locale, template, theme }) => Html.prepareIndex(template, locale, theme),
    dir: appDir,
    documentUrl: `/app/index.html`,
    path: /^\/app(?:\/.*)?$/u,
    skip: request => /\.\w+$/iu.test(request.path),
  });

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
    if (path.startsWith(`/src/`) && !path.startsWith(`/app`)) {
      request.url = `/packages/site${path}`;
    } else if (path.startsWith(`/app/`)) {
      request.url = `/packages/app${path.slice(4)}`;
    }
    next();
  });
  app.use(`/packages/app`, express.static(join(appDir, `public`)));
  app.use(vite.middlewares);

  server.listen({ host: `::`, ipv6Only: false, port: portHttps });
};
