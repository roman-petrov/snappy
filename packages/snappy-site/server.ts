/**
 * Dev server with SSR: Vite middleware + GET / renders Landing on the server.
 * Run from snappy-site directory: bun run server.ts
 */
import express from "express";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";

import type { SiteLocaleKey, SiteMeta } from "./src/Ssr";
import { Ssr } from "./src/Ssr";

const root = dirname(fileURLToPath(import.meta.url));
const PORT = 5173;

const main = async () => {
  const app = express();
  const vite = await createViteServer({ appType: `custom`, server: { middlewareMode: true } });

  const faviconPath = join(root, `favicon.svg`);
  app.get(`/favicon.svg`, (_request, response) => response.type(`image/svg+xml`).sendFile(faviconPath));
  app.get(`/favicon.ico`, (_request, response) => response.type(`image/svg+xml`).sendFile(faviconPath));

  app.get(/^\/app(\/.*)?$/u, (request, response, next) => {
    if (/\.[a-z0-9]+$/i.test(request.path)) return next();
    (async () => {
      try {
        let html = readFileSync(join(root, `src`, `app`, `index.html`), `utf8`);
        html = await vite.transformIndexHtml(request.originalUrl ?? `/app`, html);
        response.type(`html`).send(html);
      } catch (error) {
        vite.ssrFixStacktrace(error as Error);
        next(error);
      }
    })();
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

  app.listen(PORT, () => {
    process.stdout.write(`  Site (SSR) http://localhost:${PORT}\n`);
  });
};

void main();
