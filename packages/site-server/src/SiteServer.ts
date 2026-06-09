/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable functional/no-expression-statements */
import type { ServerModule } from "@snappy/server-module";
import type { FastifyReply, FastifyRequest } from "fastify";

import { createReadStream, existsSync } from "node:fs";
import { join } from "node:path";

import { Ssr } from "./core";

export const SiteServer: ServerModule = distDir => {
  const distName = `site`;

  return {
    mount: { prefix: `/assets/`, root: join(distDir, distName, `assets`) },
    run: async ({ app, htmlCache, injectTheme }) => {
      const siteRoot = join(distDir, distName);
      const ssr = Ssr({ injectTheme });

      app.get(`/`, ssr.createCachedSsrHandler(siteRoot, htmlCache));

      const apkPath = join(distDir, `snappy.apk`);
      app.get(`/download/snappy.apk`, async (_request: FastifyRequest, reply: FastifyReply) => {
        if (!existsSync(apkPath)) {
          reply.callNotFound();

          return;
        }
        reply.header(`Content-Disposition`, `attachment; filename="snappy.apk"`);
        reply.type(`application/vnd.android.package-archive`);
        await reply.send(createReadStream(apkPath));
      });

      app.get(`/favicon.svg`, async (_request, reply) => {
        await reply.sendFile(`favicon.svg`, siteRoot);
      });
    },
  };
};
