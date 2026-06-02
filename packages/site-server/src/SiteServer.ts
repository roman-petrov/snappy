/* eslint-disable functional/no-expression-statements */
import type { ServerModule } from "@snappy/server-module";
import type { FastifyReply, FastifyRequest } from "fastify";

import fastifyStatic from "@fastify/static";
import { createReadStream, existsSync } from "node:fs";
import { join } from "node:path";

import { Ssr } from "./core";

export const SiteServer: ServerModule = async ({ app, cookie, distDir, htmlCache, injectTheme, setHeaders }) => {
  const siteRoot = join(distDir, `site`);
  const ssr = Ssr({ cookie, injectTheme });

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

  await app.register(fastifyStatic, {
    decorateReply: false,
    index: false,
    preCompressed: true,
    prefix: `/assets/`,
    root: join(siteRoot, `assets`),
    setHeaders,
  });

  app.get(`/favicon.svg`, async (_request, reply) => {
    await reply.sendFile(`favicon.svg`, siteRoot);
  });
};
