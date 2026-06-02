/* eslint-disable functional/no-expression-statements */
import type { ServerModule } from "@snappy/server-module";
import type { FastifyReply, FastifyRequest } from "fastify";

import fastifyStatic from "@fastify/static";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { App, AppManifestHost } from "./core";

export const AppServer: ServerModule = async ({ app, cookie, distDir, htmlCache, prepareIndex, setHeaders }) => {
  await App({ app });
  const appRoot = join(distDir, `app`);
  const appIndexPath = join(appRoot, `index.html`);

  await app.register(fastifyStatic, {
    index: false,
    preCompressed: true,
    prefix: `/app/assets/`,
    root: join(appRoot, `assets`),
    setHeaders,
  });

  app.get(`/app/favicon.svg`, async (_request, reply) => {
    await reply.sendFile(`favicon.svg`, appRoot);
  });

  AppManifestHost.fastify(app, cookie);

  const serveAppShell = async (request: FastifyRequest, reply: FastifyReply) => {
    if (!existsSync(appIndexPath)) {
      reply.callNotFound();

      return;
    }
    const { locale, theme } = cookie(request.headers.cookie);
    const key = `app:index:${locale}:${theme ?? `system`}`;
    await htmlCache({
      contentType: `text/html`,
      key,
      load: () => prepareIndex(readFileSync(appIndexPath, `utf8`), locale, theme),
      reply,
    });
  };

  app.get(`/app`, async (_request, reply) => {
    await reply.redirect(`/app/`);
  });

  app.get(`/app/`, serveAppShell);
  app.get(`/app/*`, serveAppShell);
};
