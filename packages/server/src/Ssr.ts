import type { RequestHandler } from "express";

import { Ssr } from "@snappy/snappy-site/ssr";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

/**
 * Creates an Express handler that server-renders the site for GET /.
 * Expects clientRoot to contain index.html and server/entry-server.js (SSR bundle).
 */
export const createSsrHandler = (clientRoot: string): RequestHandler => {
  const templatePath = join(clientRoot, `index.html`);
  const ssrEntryPath = pathToFileURL(join(clientRoot, `server`, `entry-server.js`)).href;

  return async (request, response, next) => {
    try {
      const locale = Ssr.localeFromCookie(request.headers.cookie);
      const template = readFileSync(templatePath, `utf8`);
      const ssrModule = await import(ssrEntryPath);
      const render = typeof ssrModule.render === `function` ? ssrModule.render : undefined;
      if (render === undefined) {
        next(new Error(`SSR entry did not export render`));

        return;
      }
      response
        .type(`html`)
        .send(
          Ssr.buildHtml(locale, template, {
            getMeta: typeof ssrModule.getMeta === `function` ? ssrModule.getMeta : undefined,
            render,
          }),
        );
    } catch (error) {
      next(error);
    }
  };
};
