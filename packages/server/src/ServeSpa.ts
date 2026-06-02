/* eslint-disable functional/no-expression-statements */
import type { ServerModuleConfig, ServeSpa, ServeSpaConfig } from "@snappy/server-module";
import type { FastifyReply, FastifyRequest } from "fastify";

import fastifyStatic from "@fastify/static";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type ServeSpaDeps = Pick<
  ServerModuleConfig,
  `app` | `cookie` | `distDir` | `htmlCache` | `prepareIndex` | `setHeaders`
>;

export const Spa =
  (deps: ServeSpaDeps): ServeSpa =>
  async ({ cacheKeyPrefix, distName, prefix }: ServeSpaConfig) => {
    const { app, cookie, distDir, htmlCache, prepareIndex, setHeaders } = deps;
    const spaRoot = join(distDir, distName);
    const indexPath = join(spaRoot, `index.html`);
    const assetsPrefix = `${prefix}/assets/`;

    await app.register(fastifyStatic, {
      index: false,
      preCompressed: true,
      prefix: assetsPrefix,
      root: join(spaRoot, `assets`),
      setHeaders,
    });

    app.get(`${prefix}/favicon.svg`, async (_request, reply) => {
      await reply.sendFile(`favicon.svg`, spaRoot);
    });

    const serveShell = async (request: FastifyRequest, reply: FastifyReply) => {
      if (!existsSync(indexPath)) {
        reply.callNotFound();

        return;
      }
      const { locale, theme } = cookie(request.headers.cookie);
      const key = `${cacheKeyPrefix}:${locale}:${theme ?? `system`}`;
      await htmlCache({
        contentType: `text/html`,
        key,
        load: () => prepareIndex(readFileSync(indexPath, `utf8`), locale, theme),
        reply,
      });
    };

    app.get(prefix, async (_request, reply) => {
      await reply.redirect(`${prefix}/`);
    });

    app.get(`${prefix}/`, serveShell);
    app.get(`${prefix}/*`, serveShell);
  };
