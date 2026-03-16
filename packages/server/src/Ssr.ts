/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-promise-reject */

import type { ResolvedLocale, Theme } from "@snappy/ui";
import type { FastifyReply, FastifyRequest } from "fastify";

import { _ } from "@snappy/core";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import type { ServerCache } from "./ServerCache";

import { Cookie } from "./core/Cookie";
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

  const createCachedSsrHandler = (clientRoot: string, cache: ServerCache) => {
    const loadedRef: { promise?: Promise<{ entry: SsrEntry; template: string }> } = {};

    const ensureLoaded = async (): Promise<{ entry: SsrEntry; template: string }> => {
      loadedRef.promise ??= loadTemplateAndEntry(clientRoot);

      return loadedRef.promise;
    };

    return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const { locale, theme } = Cookie(request.headers.cookie, request.headers[`accept-language`]);
      const key = `ssr:${locale}:${theme ?? `system`}`;
      const acceptEncoding = request.headers[`accept-encoding`];
      const cached = cache.get(key);
      if (cached !== undefined) {
        cache.sendCached(reply, cached, acceptEncoding, `text/html`);

        return;
      }
      const { entry: ssrEntry, template } = await ensureLoaded();
      cache.sendCached(
        reply,
        cache.set(key, Buffer.from(SiteSsr.build(locale, theme, template, ssrEntry), `utf8`), `text/html`),
        acceptEncoding,
        `text/html`,
      );
    };
  };

  const themes: (Theme | undefined)[] = [`dark`, `light`, undefined];

  const prewarmSsr = async (
    clientRoot: string,
    cache: ServerCache,
    locales: readonly [ResolvedLocale, ...ResolvedLocale[]],
  ): Promise<void> => {
    const { entry, template } = await loadTemplateAndEntry(clientRoot);
    for (const locale of locales) {
      for (const theme of themes) {
        const html = SiteSsr.build(locale, theme, template, entry);
        cache.set(`ssr:${locale}:${theme ?? `system`}`, Buffer.from(html, `utf8`), `text/html`);
      }
    }
  };

  return { createCachedSsrHandler, createSsrHandler, prewarmSsr };
};

export type Ssr = ReturnType<typeof Ssr>;
