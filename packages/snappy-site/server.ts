/**
 * Dev server with SSR: Vite middleware + GET / renders Landing on the server.
 * Run from snappy-site directory: bun run server.ts
 */
import express from "express";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer as createViteServer } from "vite";
import beautify from "js-beautify";

const root = dirname(fileURLToPath(import.meta.url));

const COOKIE_NAME = `snappy-locale`;
const ROOT_PLACEHOLDER = /<div id="root">\s*<\/div>/u;
const PORT = 5173;

type SiteLocaleKey = `en` | `ru`;

const escapeAttr = (s: string): string =>
  s.replace(/&/gu, `&amp;`).replace(/"/gu, `&quot;`).replace(/</gu, `&lt;`).replace(/>/gu, `&gt;`);

const localeFromCookie = (cookieHeader: string | undefined): SiteLocaleKey => {
  if (cookieHeader === undefined) return `ru`;
  const match = cookieHeader
    .split(`;`)
    .map(s => s.trim())
    .find(s => s.startsWith(`${COOKIE_NAME}=`));
  const value = match?.split(`=`)[1];
  return value === `en` || value === `ru` ? value : `ru`;
};

const injectMeta = (
  template: string,
  meta: { description: string; htmlLang: string; keywords: string; title: string },
): string =>
  template
    .replace(/\{\{title\}\}/gu, escapeAttr(meta.title))
    .replace(/\{\{description\}\}/gu, escapeAttr(meta.description))
    .replace(/\{\{keywords\}\}/gu, escapeAttr(meta.keywords))
    .replace(/\{\{htmlLang\}\}/gu, meta.htmlLang);

const formatHtml = (html: string): string => beautify.html(html, { indent_size: 2, end_with_newline: true });

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
      const locale = localeFromCookie(request.headers.cookie);
      let template = readFileSync(join(root, `src`, `site`, `index.html`), `utf8`);
      template = await vite.transformIndexHtml(request.originalUrl ?? `/`, template);
      const { getMeta, render } = (await vite.ssrLoadModule(`/src/site/entry-server.tsx`)) as {
        getMeta: (locale: SiteLocaleKey) => { description: string; htmlLang: string; keywords: string; title: string };
        render: (locale: SiteLocaleKey) => string;
      };
      template = injectMeta(template, getMeta(locale));
      const html = render(locale);
      const out = template.replace(ROOT_PLACEHOLDER, `<div id="root">${html}</div>`);
      response.type(`html`).send(formatHtml(out));
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
