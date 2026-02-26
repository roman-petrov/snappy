/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-try-statements */
/* eslint-disable sonarjs/x-powered-by */
/**
 * Dev server with SSR: Vite middleware + GET / renders Landing on the server.
 * Run from snappy-site directory: node --import tsx/esm server.ts
 */
import express from "express";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createServer as createViteServer } from "vite";

import type { SiteLocaleKey } from "./src/site/core/LocaleCookie";

import { type SiteMeta, Ssr } from "./src/Ssr";

const root = import.meta.dirname;
const port = 5173;

const main = async () => {
  const app = express();
  const vite = await createViteServer({ appType: `custom`, server: { middlewareMode: true } });
  const faviconPath = join(root, `favicon.svg`);
  app.get(`/favicon.svg`, (_request, response) => response.type(`image/svg+xml`).sendFile(faviconPath));
  app.get(`/favicon.ico`, (_request, response) => response.type(`image/svg+xml`).sendFile(faviconPath));

  app.get(/^\/app(?:\/.*)?$/u, (request, response, next) => {
    if (/\.\w+$/iu.test(request.path)) {
      return next();
    }
    void (async () => {
      try {
        let html = readFileSync(join(root, `src`, `app`, `index.html`), `utf8`);
        html = await vite.transformIndexHtml(request.originalUrl ?? `/app`, html);
        response.type(`html`).send(html);
      } catch (error) {
        vite.ssrFixStacktrace(error as Error);
        next(error);
      }
    })();

    return undefined;
  });

  app.get(`/`, async (request, response, next) => {
    try {
      const locale = Ssr.localeFromCookie(request.headers.cookie);
      let template = readFileSync(join(root, `src`, `site`, `index.html`), `utf8`);
      template = await vite.transformIndexHtml(request.originalUrl ?? `/`, template);
      const entry = (await vite.ssrLoadModule(`/src/site/entry-server.tsx`)) as {
        getMeta: (locale: SiteLocaleKey) => SiteMeta;
        render: (locale: SiteLocaleKey) => string;
      };
      response.type(`html`).send(Ssr.buildHtml(locale, template, entry));
    } catch (error) {
      vite.ssrFixStacktrace(error as Error);
      next(error);
    }
  });

  app.use(vite.middlewares);

  app.listen(port, () => {
    process.stdout.write(`  Site (SSR) http://localhost:${port}\n`);
  });
};

void main();
