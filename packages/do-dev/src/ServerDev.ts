/* eslint-disable unicorn/try-complexity */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { Admin } from "@snappy/admin-server";
import { App, AppServer } from "@snappy/app-server";
import { Config } from "@snappy/config";
import { _, HttpStatus, MimeType } from "@snappy/core";
import { ViteConfig } from "@snappy/do/config/vite";
import { File } from "@snappy/node";
import { Fastify, Html, Modules } from "@snappy/server";
import { SiteServer, SiteSsr, type SsrEntry } from "@snappy/site-server";
import { Settings } from "@snappy/ui-core";
import express, { type Request } from "express";
import http from "node:http";
import https from "node:https";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { createServer as createViteServer } from "vite";

export const ServerDev = async () => {
  const projectRoot = join(import.meta.dirname, `..`, `..`, `..`);
  const packageDir = (name: string) => join(projectRoot, `packages`, name);
  const siteDir = packageDir(`site`);
  const distDir = join(projectRoot, `dist`);
  const faviconPath = join(packageDir(`ui`), `src`, `assets`, `favicon.svg`);
  const portHttps = 443;
  const devInput = ([`site`, `app`, `admin`] as const).map(name => join(packageDir(name), `index.html`));
  const apiApp = await Fastify();
  await App({ app: apiApp });
  await Admin({ app: apiApp });
  const apiPort = Number(new URL(await apiApp.listen({ host: `127.0.0.1`, port: 0 })).port);
  const app = express();
  const server = https.createServer(Config.ssl(), app);

  const config = ViteConfig(
    {
      build: { rollupOptions: { input: devInput } },
      resolve: { alias: { "/admin": packageDir(`admin`), "/app": packageDir(`app`), "/src": join(siteDir, `src`) } },
      root: projectRoot,
    },
    { analyzeFileName: `dev` },
  )({ command: `serve`, mode: `development` });

  const vite = await createViteServer({
    ...config,
    appType: `custom`,
    configFile: false,
    server: {
      ...config.server,
      allowedHosts: true,
      middlewareMode: true,
      origin: _.https(Config.host),
      ws: { clientPort: portHttps, host: Config.host, protocol: `wss`, server },
    },
  });

  app.use(`/api`, (request, response) => {
    const proxyRequest = http.request(
      {
        headers: { ...request.headers, host: `127.0.0.1:${apiPort}` },
        hostname: `127.0.0.1`,
        method: request.method,
        path: request.originalUrl,
        port: apiPort,
      },
      proxyResponse => {
        response.writeHead(proxyResponse.statusCode ?? HttpStatus.internalServerError, proxyResponse.headers);
        proxyResponse.pipe(response);
      },
    );
    proxyRequest.on(`error`, () => {
      response.statusCode = HttpStatus.badGateway;
      response.end(`API proxy error`);
    });
    request.pipe(proxyRequest);
  });

  const html = ({
    body,
    dir,
    documentUrl,
    path,
    skip,
  }: {
    body: (input: ReturnType<typeof Settings> & { template: string }) => Promise<string> | string;
    dir: string;
    documentUrl?: string;
    path: RegExp | string;
    skip?: (request: Request) => boolean;
  }) => {
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

        response.type(`html`).send(await body({ ...Settings({ headers: request.headers }), template }));
      } catch (error) {
        vite.ssrFixStacktrace(error as Error);
        next(error);
      }
    });
  };

  app.get(`/favicon.svg`, (_request, response) => response.type(MimeType.imageSvg).sendFile(faviconPath));

  const siteEntryHref = pathToFileURL(join(siteDir, `src`, `entry-server.tsx`)).href;
  const siteEntry = (await vite.ssrLoadModule(siteEntryHref)) as SsrEntry;

  await Modules.dev(app, [SiteServer, AppServer], { distDir, site: { pages: siteEntry.pages } });

  for (const path of siteEntry.pages.paths) {
    html({
      body: async ({ locale, template, theme }) => {
        const entry = (await vite.ssrLoadModule(siteEntryHref)) as SsrEntry;

        return SiteSsr.build(path, locale, theme, template, entry, Html.injectTheme);
      },
      dir: siteDir,
      path,
    });
  }

  const spas = ([`app`, `admin`] as const).map(name => ({ packageName: name, urlPrefix: `/${name}` }));

  for (const { packageName, urlPrefix } of spas) {
    app.get(`${urlPrefix}/favicon.svg`, (_request, response) => {
      response.type(MimeType.imageSvg).sendFile(faviconPath);
    });

    html({
      body: ({ locale, template, theme }) => Html.prepareIndex(template, locale, theme),
      dir: packageDir(packageName),
      documentUrl: `${urlPrefix}/index.html`,
      path: new RegExp(String.raw`^${urlPrefix}(?:\/.*)?$`, `u`),
      skip: request => /\.\w+$/iu.test(request.path),
    });
  }

  app.use((request, _response, next) => {
    const { path } = request;
    if (path.startsWith(`/src/`) && !path.startsWith(`/app`) && !path.startsWith(`/admin`)) {
      request.url = `/packages/site${path}`;
    } else {
      for (const { packageName, urlPrefix } of spas) {
        if (path.startsWith(`${urlPrefix}/`)) {
          request.url = `/packages/${packageName}${path.slice(urlPrefix.length)}`;
        }
      }
    }
    next();
  });

  for (const { packageName } of spas) {
    app.use(`/packages/${packageName}`, express.static(join(packageDir(packageName), `public`)));
  }

  app.use(vite.middlewares);

  server.listen({ host: `::`, ipv6Only: false, port: portHttps });
};
