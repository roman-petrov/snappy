/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import { Browser } from "@snappy/core";
import { Ssr, type SsrEntry } from "@snappy/site/Ssr";
import express from "express";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { createServer as createViteServer } from "vite";

import { LocaleCookie } from "../../site/src/core/LocaleCookie";
import { ViteConfig } from "./config/vite/ViteConfig";

const doDir = import.meta.dirname;
const projectRoot = join(doDir, `..`, `..`, `..`);
const siteDir = join(projectRoot, `packages`, `site`);
const appDesktopDir = join(projectRoot, `packages`, `app-desktop`);
const appMobileDir = join(projectRoot, `packages`, `app-mobile`);
const faviconPath = join(projectRoot, `packages`, `ui`, `src`, `assets`, `favicon.svg`);
const siteEntryPath = join(siteDir, `src`, `entry-server.tsx`);
const port = 5173;
const devInput = [`site`, `app-desktop`, `app-mobile`].map(name => join(projectRoot, `packages`, name, `index.html`));

export const DevServer = () => {
  const start = async () => {
    const app = express();

    const configBuilder = ViteConfig(
      {
        build: { rollupOptions: { input: devInput } },
        resolve: {
          alias: { "/app-desktop": appDesktopDir, "/app-mobile": appMobileDir, "/src": join(siteDir, `src`) },
        },
        root: projectRoot,
      },
      { analyzeFileName: `dev` },
    );

    const resolved =
      typeof configBuilder === `function` ? configBuilder({ command: `serve`, mode: `development` }) : configBuilder;

    const config = await Promise.resolve(resolved);

    const vite = await createViteServer({
      appType: `custom`,
      configFile: false,
      server: { ...config.server, middlewareMode: true },
      ...config,
    });

    const indexHtmlFromDir = async (dir: string, documentUrl?: string) => {
      const indexPath = join(dir, `index.html`);
      const raw = readFileSync(indexPath, `utf8`);
      const url = documentUrl ?? pathToFileURL(indexPath).href;

      return vite.transformIndexHtml(url, raw);
    };

    const handleHtmlError = (error: unknown, next: express.NextFunction) => {
      vite.ssrFixStacktrace(error as Error);
      next(error);
    };

    app.get(`/favicon.svg`, (_request, response) => response.type(`image/svg+xml`).sendFile(faviconPath));
    app.get(`/favicon.ico`, (_request, response) => response.type(`image/svg+xml`).sendFile(faviconPath));
    app.get(`/app/favicon.svg`, (_request, response) => response.type(`image/svg+xml`).sendFile(faviconPath));

    app.get(/^\/app(?:\/.*)?$/u, (request, response, next) => {
      if (/\.\w+$/iu.test(request.path)) {
        return next();
      }
      const mobile = Browser.mobile(request.get(`user-agent`) ?? ``);
      const appDir = mobile ? appMobileDir : appDesktopDir;
      const appDocumentUrl = mobile ? `/app-mobile/index.html` : `/app-desktop/index.html`;
      void indexHtmlFromDir(appDir, appDocumentUrl)
        .then(html => response.type(`html`).send(html.replaceAll(/\/app-(?:desktop|mobile)\//gu, `/app/`)))
        .catch((error: unknown) => handleHtmlError(error, next));

      return undefined;
    });

    app.get(`/`, async (request, response, next) => {
      try {
        const locale = LocaleCookie.parse(request.headers.cookie);
        const template = await indexHtmlFromDir(siteDir);
        const entry = (await vite.ssrLoadModule(pathToFileURL(siteEntryPath).href)) as SsrEntry;
        response.type(`html`).send(Ssr.buildHtml(locale, template, entry));
      } catch (error) {
        handleHtmlError(error, next);
      }
    });

    app.use((request, _response, next) => {
      const { path } = request;
      if (path.startsWith(`/src/`) && !path.startsWith(`/app`)) {
        request.url = `/packages/site${path}`;
      } else if (path.startsWith(`/app/`)) {
        const mobile = Browser.mobile(request.get(`user-agent`) ?? ``);
        request.url = `/packages/${mobile ? `app-mobile` : `app-desktop`}${path.slice(4)}`;
      }
      next();
    });
    app.use(`/packages/app-mobile`, express.static(join(appMobileDir, `public`)));
    app.use(vite.middlewares);

    app.listen(port, () => {
      process.stdout.write(`  Site (SSR) http://localhost:${port}\n`);
    });
  };

  return { start };
};

export type DevServer = ReturnType<typeof DevServer>;
