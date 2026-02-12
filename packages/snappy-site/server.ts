/**
 * Dev server with SSR: Vite middleware + GET / renders Landing on the server.
 * Run from snappy-site directory: bun run server.ts
 */
import express from "express";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createServer as createViteServer } from "vite";

const COOKIE_NAME = `snappy-locale`;
const ROOT_PLACEHOLDER = /<div id="root">\s*<\/div>/u;
const PORT = 5173;

type SiteLocaleKey = `en` | `ru`;

const localeFromCookie = (cookieHeader: string | undefined): SiteLocaleKey => {
  if (cookieHeader === undefined) return `ru`;
  const match = cookieHeader
    .split(`;`)
    .map(s => s.trim())
    .find(s => s.startsWith(`${COOKIE_NAME}=`));
  const value = match?.split(`=`)[1];
  return value === `en` || value === `ru` ? value : `ru`;
};

const main = async () => {
  const app = express();
  const vite = await createViteServer({ appType: `custom`, server: { middlewareMode: true } });

  const root = import.meta.dirname;

  app.get(`/favicon.svg`, (_request, response) => response.sendFile(join(root, `src`, `site`, `favicon.svg`)));

  const appDir = join(root, `src`, `app`);
  app.get(`/app/favicon.svg`, (_request, response) =>
    response.type(`image/svg+xml`).sendFile(join(appDir, `favicon.svg`)),
  );

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
      const locale = localeFromCookie(request.headers.cookie);
      let template = readFileSync(join(root, `src`, `site`, `index.html`), `utf8`);
      template = await vite.transformIndexHtml(request.originalUrl ?? `/`, template);
      const { render } = (await vite.ssrLoadModule(`/src/site/entry-server.tsx`)) as {
        render: (locale: SiteLocaleKey) => string;
      };
      const html = render(locale);
      const out = template.replace(ROOT_PLACEHOLDER, `<div id="root">${html}</div>`);
      response.type(`html`).send(out);
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
