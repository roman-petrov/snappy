/* eslint-disable functional/no-expression-statements */
import type { IncomingMessage, ServerResponse } from "node:http";

import livereload from "livereload";
import { existsSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";

const port = 35_729;
const scriptTag = `<script src="http://localhost:${port}/livereload.js?snipver=1"></script>`;
const statusOk = 200;

const injectScript = (html: string): string =>
  html.includes(`</body>`) ? html.replace(`</body>`, `${scriptTag}</body>`) : html + scriptTag;

const createHandler = (root: string, next: (request: IncomingMessage, response: ServerResponse) => void) => {
  const lrServer = livereload.createServer({ port });
  lrServer.watch(root);
  const rootResolved = resolve(root);

  return (request: IncomingMessage, response: ServerResponse): void => {
    const { pathname } = new URL(request.url ?? ``, `http://localhost`);
    const relativePath = pathname === `/` ? `index.html` : pathname.slice(1);
    const filePath = resolve(join(root, relativePath));

    const isHtml =
      (pathname === `/` || pathname.endsWith(`.html`)) &&
      filePath.startsWith(rootResolved) &&
      existsSync(filePath) &&
      extname(filePath) === `.html`;

    if (!isHtml) {
      next(request, response);

      return;
    }

    const html = injectScript(readFileSync(filePath, `utf-8`));
    response.writeHead(statusOk, { "Content-Type": `text/html; charset=utf-8` });
    response.end(html);
  };
};

export const LiveReload = { createHandler };
