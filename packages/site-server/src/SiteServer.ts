// cspell:word assetlinks
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable functional/no-expression-statements */
import type { ServerModule } from "@snappy/server-module";
import type { FastifyReply, FastifyRequest } from "fastify";

import { Config, ConfigValues } from "@snappy/config";
import { MimeType } from "@snappy/core";
import { File } from "@snappy/node";
import { join } from "node:path";

import { AssetLinks, Ssr } from "./core";

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
        if (!File.exists(apkPath)) {
          reply.callNotFound();

          return;
        }
        reply.header(`Content-Disposition`, `attachment; filename="snappy.apk"`);
        reply.type(MimeType.apk);
        await reply.send(File.stream(apkPath));
      });

      app.get(`/favicon.svg`, async (_request, reply) => {
        await reply.sendFile(`favicon.svg`, siteRoot);
      });

      if (ConfigValues.production()) {
        app.get(`/.well-known/assetlinks.json`, async (_request, reply) => {
          reply.type(MimeType.json);
          await reply.send(AssetLinks.body(Config.androidCertSha256()));
        });
      }
    },
  };
};
