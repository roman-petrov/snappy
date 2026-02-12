import type { RequestHandler } from "express";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const COOKIE_NAME = `snappy-locale`;
const ROOT_PLACEHOLDER = /<div id="root">\s*<\/div>/u;

type SiteLocaleKey = `en` | `ru`;

type SiteMeta = { description: string; htmlLang: string; keywords: string; title: string };

const escapeAttribute = (s: string): string =>
  s.replaceAll(`&`, `&amp;`).replaceAll(`"`, `&quot;`).replaceAll(`<`, `&lt;`).replaceAll(`>`, `&gt;`);

const localeFromCookie = (cookieHeader: string | undefined): SiteLocaleKey => {
  if (cookieHeader === undefined) {
    return `ru`;
  }
  const match = cookieHeader
    .split(`;`)
    .map(s => s.trim())
    .find(s => s.startsWith(`${COOKIE_NAME}=`));

  const value = match?.split(`=`)[1];

  return value === `en` || value === `ru` ? value : `ru`;
};

const injectMeta = (template: string, meta: SiteMeta): string =>
  template
    .replaceAll(`{{title}}`, escapeAttribute(meta.title))
    .replaceAll(`{{description}}`, escapeAttribute(meta.description))
    .replaceAll(`{{keywords}}`, escapeAttribute(meta.keywords))
    .replaceAll(`{{htmlLang}}`, meta.htmlLang);

/**
 * Creates an Express handler that server-renders the site for GET /.
 * Expects clientRoot to contain index.html and server/entry-server.js (SSR bundle).
 */
export const createSsrHandler = (clientRoot: string): RequestHandler => {
  const templatePath = join(clientRoot, `index.html`);
  const ssrEntryPath = pathToFileURL(join(clientRoot, `server`, `entry-server.js`)).href;

  return async (request, response, next) => {
    try {
      const locale = localeFromCookie(request.headers.cookie);
      let template = readFileSync(templatePath, `utf8`);
      const module_ = await import(ssrEntryPath);
      const getMeta = typeof module_.getMeta === `function` ? module_.getMeta : undefined;
      const render = typeof module_.render === `function` ? module_.render : undefined;
      if (render === undefined) {
        next(new Error(`SSR entry did not export render`));

        return;
      }
      if (getMeta !== undefined) {
        template = injectMeta(template, getMeta(locale) as SiteMeta);
      }
      const html = render(locale) as string;
      const out = template.replace(ROOT_PLACEHOLDER, `<div id="root">${html}</div>`);
      response.type(`html`).send(out);
    } catch (error) {
      next(error);
    }
  };
};
