/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-promise-reject */
import type { FastifyReply, FastifyRequest } from "fastify";

import { _ } from "@snappy/core";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import type { HtmlCache } from "./HtmlCache";

import { Cookie } from "./Cookie";
import { SiteSsr, type SsrEntry } from "./SiteSsr";

export const Ssr = () => {
  const loadTemplateAndEntry = async (clientRoot: string): Promise<{ entry: SsrEntry; template: string }> => {
    const templatePath = join(clientRoot, `index.html`);
    const ssrEntryPath = pathToFileURL(join(clientRoot, `server`, `entry-server.js`)).href;
    const template = readFileSync(templatePath, `utf8`);
    const ssrModule = await import(ssrEntryPath);
    const render = _.isFunction(ssrModule.render) ? ssrModule.render : undefined;

    if (render === undefined) {
      throw new Error(`SSR entry did not export render`);
    }

    return { entry: { getMeta: _.isFunction(ssrModule.getMeta) ? ssrModule.getMeta : undefined, render }, template };
  };

  const createSsrHandler =
    (clientRoot: string) =>
    async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const { locale, theme } = Cookie(request.headers.cookie, request.headers[`accept-language`]);
      const { entry, template } = await loadTemplateAndEntry(clientRoot);

      await reply.type(`text/html`).send(SiteSsr.build(locale, theme, template, entry));
    };

  const createCachedSsrHandler = (clientRoot: string, cache: HtmlCache) => {
    const loadedRef: { promise?: Promise<{ entry: SsrEntry; template: string }> } = {};

    const ensureLoaded = async (): Promise<{ entry: SsrEntry; template: string }> => {
      loadedRef.promise ??= loadTemplateAndEntry(clientRoot);

      return loadedRef.promise;
    };

    return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const { locale, theme } = Cookie(request.headers.cookie, request.headers[`accept-language`]);
      const key = `ssr:${locale}:${theme ?? `system`}`;
      await cache.replyCached(reply, key, `text/html`, async () => {
        const { entry: ssrEntry, template } = await ensureLoaded();

        return SiteSsr.build(locale, theme, template, ssrEntry);
      });
    };
  };

  return { createCachedSsrHandler, createSsrHandler };
};

export type Ssr = ReturnType<typeof Ssr>;
