/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { MimeType } from "@snappy/core";
import { Html } from "@snappy/server";
import express, { type Express, type Request } from "express";
import { join } from "node:path";

import type { ServerDevHtml } from "./Types";

export type ServerDevSpaConfig = { expressApp: Express; faviconPath: string; html: ServerDevHtml; projectRoot: string };

type Register = { packageName: string; urlPrefix: string };

export const ServerDevSpa = ({ expressApp, faviconPath, html, projectRoot }: ServerDevSpaConfig) => {
  const registered: Register[] = [];

  const register = ({ packageName, urlPrefix }: Register) => {
    const dir = join(projectRoot, `packages`, packageName);
    const documentUrl = `${urlPrefix}/index.html`;
    const path = new RegExp(String.raw`^${urlPrefix}(?:\/.*)?$`, `u`);

    registered.push({ packageName, urlPrefix });

    expressApp.get(`${urlPrefix}/favicon.svg`, (_request, response) => {
      response.type(MimeType.imageSvg).sendFile(faviconPath);
    });

    html({
      body: ({ locale, template, theme }) => Html.prepareIndex(template, locale, theme),
      dir,
      documentUrl,
      path,
      skip: request => /\.\w+$/iu.test(request.path),
    });
  };

  const mountPublic = () => {
    for (const { packageName } of registered) {
      expressApp.use(`/packages/${packageName}`, express.static(join(projectRoot, `packages`, packageName, `public`)));
    }
  };

  const rewrite = (request: Request) => {
    const { path } = request;
    for (const { packageName, urlPrefix } of registered) {
      if (path.startsWith(`${urlPrefix}/`)) {
        request.url = `/packages/${packageName}${path.slice(urlPrefix.length)}`;
      }
    }
  };

  return { mountPublic, register, rewrite };
};
