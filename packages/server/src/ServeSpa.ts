/* eslint-disable functional/no-expression-statements */
import type { ServerModuleConfig, ServeSpa, ServeSpaConfig } from "@snappy/server-module";
import type { FastifyReply, FastifyRequest } from "fastify";

import { Settings } from "@snappy/ui-core";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export type SpaConfig = Pick<ServerModuleConfig, `app` | `distDir` | `htmlCache` | `prepareIndex`>;

export const Spa =
  ({ app, distDir, htmlCache, prepareIndex }: SpaConfig): ServeSpa =>
  ({ cacheKeyPrefix, distName, prefix }: ServeSpaConfig) => {
    const spaRoot = join(distDir, distName);
    const indexPath = join(spaRoot, `index.html`);

    app.get(`${prefix}/favicon.svg`, async (_request, reply) => {
      await reply.sendFile(`favicon.svg`, spaRoot);
    });

    const serveShell = async (request: FastifyRequest, reply: FastifyReply) => {
      if (!existsSync(indexPath)) {
        reply.callNotFound();

        return;
      }
      const { locale, theme } = Settings(request);
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
