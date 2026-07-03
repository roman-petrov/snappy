/* eslint-disable functional/no-promise-reject */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import type { HtmlCache, InjectTheme } from "@snappy/server-module";
import type { FastifyReply, FastifyRequest } from "fastify";

import { _, MimeType } from "@snappy/core";
import { File } from "@snappy/node";
import { Settings } from "@snappy/ui-core";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import { SiteSsr, type SsrEntry } from "./SiteSsr";

export type SsrConfig = { injectTheme: InjectTheme };

export const Ssr = ({ injectTheme }: SsrConfig) => {
  const loadTemplateAndEntry = async (clientRoot: string): Promise<{ entry: SsrEntry; template: string }> => {
    const templatePath = join(clientRoot, `index.html`);
    const ssrEntryPath = pathToFileURL(join(clientRoot, `server`, `entry-server.js`)).href;
    const template = File.read(templatePath);
    const ssrModule = await import(ssrEntryPath);
    const render = _.isFunction(ssrModule.render) ? ssrModule.render : undefined;
    const pages = _.isObject(ssrModule.pages) ? ssrModule.pages : undefined;

    if (render === undefined) {
      throw new Error(`SSR entry did not export render`);
    }

    if (pages === undefined || !_.isArray(pages.paths)) {
      throw new Error(`SSR entry did not export pages`);
    }

    return {
      entry: { getMeta: _.isFunction(ssrModule.getMeta) ? ssrModule.getMeta : undefined, pages, render },
      template,
    };
  };

  const createCachedSsrHandler = (clientRoot: string, cache: HtmlCache, path: string) => {
    const loadedRef: { promise?: Promise<{ entry: SsrEntry; template: string }> } = {};

    const ensureLoaded = async (): Promise<{ entry: SsrEntry; template: string }> => {
      loadedRef.promise ??= loadTemplateAndEntry(clientRoot);

      return loadedRef.promise;
    };

    return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
      const { locale, theme } = Settings(request);
      const key = `ssr:${path}:${locale}:${theme ?? `system`}`;
      await cache({
        contentType: MimeType.textHtml,
        key,
        load: async () => {
          const { entry: ssrEntry, template } = await ensureLoaded();

          return SiteSsr.build(path, locale, theme, template, ssrEntry, injectTheme);
        },
        reply,
      });
    };
  };

  return { createCachedSsrHandler };
};

export type Ssr = ReturnType<typeof Ssr>;
