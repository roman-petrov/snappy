import type { RequestHandler } from "express";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT_PLACEHOLDER = /<div id="root">\s*<\/div>/u;

/**
 * Creates an Express handler that server-renders the site for GET /.
 * Expects clientRoot to contain index.html and server/entry-server.js (SSR bundle).
 */
export const createSsrHandler = (clientRoot: string): RequestHandler => {
  const templatePath = join(clientRoot, `index.html`);
  const ssrEntryPath = pathToFileURL(join(clientRoot, `server`, `entry-server.js`)).href;

  return async (_request, response, next) => {
    try {
      const template = readFileSync(templatePath, `utf8`);
      const module_ = await import(ssrEntryPath);
      const render = typeof module_.render === `function` ? module_.render : undefined;
      if (render === undefined) {
        next(new Error(`SSR entry did not export render`));

        return;
      }
      const html = render() as string;
      const out = template.replace(ROOT_PLACEHOLDER, `<div id="root">${html}</div>`);
      response.type(`html`).send(out);
    } catch (error) {
      next(error);
    }
  };
};
