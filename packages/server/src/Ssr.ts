/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable functional/no-try-statements */
import type { RequestHandler } from "express";

import { _ } from "@snappy/core";
import { type SiteLocaleKey, type SiteMeta, Ssr as SiteSsr } from "@snappy/snappy-site/ssr";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

import type { ServerCache } from "./ServerCache";

type SsrEntry = { getMeta?: (locale: SiteLocaleKey) => SiteMeta; render: (locale: SiteLocaleKey) => string };

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
    (clientRoot: string): RequestHandler =>
    async (request, response, next) => {
      try {
        const locale = SiteSsr.localeFromCookie(request.headers.cookie);
        const { entry, template } = await loadTemplateAndEntry(clientRoot);

        response.type(`html`).send(SiteSsr.buildHtml(locale, template, entry));
      } catch (error) {
        next(error);
      }
    };

  const createCachedSsrHandler = (clientRoot: string, cache: ServerCache): RequestHandler => {
    const loadedRef: { promise?: Promise<{ entry: SsrEntry; template: string }> } = {};

    const ensureLoaded = async (): Promise<{ entry: SsrEntry; template: string }> => {
      loadedRef.promise ??= loadTemplateAndEntry(clientRoot);

      return loadedRef.promise;
    };

    return async (request, response, next) => {
      try {
        const locale = SiteSsr.localeFromCookie(request.headers.cookie);
        const key = `ssr:${locale}`;
        const cached = cache.get(key);
        if (cached !== undefined) {
          cache.sendCached(response, cached, request.headers[`accept-encoding`], `text/html`);

          return;
        }
        const { entry: ssrEntry, template } = await ensureLoaded();
        const html = SiteSsr.buildHtml(locale, template, ssrEntry);
        const entry = cache.set(key, Buffer.from(html, `utf8`), `text/html`);
        cache.sendCached(response, entry, request.headers[`accept-encoding`], `text/html`);
      } catch (error) {
        next(error);
      }
    };
  };

  const prewarmSsr = async (
    clientRoot: string,
    cache: ServerCache,
    locales: readonly [SiteLocaleKey, ...SiteLocaleKey[]],
  ): Promise<void> => {
    const { entry, template } = await loadTemplateAndEntry(clientRoot);
    for (const locale of locales) {
      const html = SiteSsr.buildHtml(locale, template, entry);
      cache.set(`ssr:${locale}`, Buffer.from(html, `utf8`), `text/html`);
    }
  };

  return { createCachedSsrHandler, createSsrHandler, prewarmSsr };
};

export type Ssr = ReturnType<typeof Ssr>;
