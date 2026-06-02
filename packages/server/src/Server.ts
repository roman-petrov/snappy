/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import type { ServerModuleConfig } from "@snappy/server-module";

import { AppServer } from "@snappy/app-server";
import { Config } from "@snappy/config";
import { SiteServer } from "@snappy/site-server";
import http, { type IncomingMessage, type ServerResponse } from "node:http";
import https from "node:https";
import { join } from "node:path";

import { Cookie } from "./Cookie";
import { Fastify } from "./Fastify";
import { Html } from "./Html";
import { HtmlCache } from "./HtmlCache";
import { Static } from "./Static";

export const Server = async () => {
  const distDir = join(process.cwd(), `dist`);
  const portHttp = 80;
  const portHttps = 443;

  const handlerRef: { current: ((request: IncomingMessage, response: ServerResponse) => void) | undefined } = {
    current: undefined,
  };

  const app = Fastify({
    serverFactory: handler => {
      handlerRef.current = handler;

      return http.createServer(handler);
    },
  });

  const htmlCache = HtmlCache();

  const module: ServerModuleConfig = {
    app,
    cookie: Cookie,
    distDir,
    htmlCache,
    injectTheme: Html.injectTheme,
    prepareIndex: Html.prepareIndex,
    setHeaders: Static.setHeaders,
  };
  await SiteServer(module);
  await AppServer(module);

  await app.ready();

  if (handlerRef.current !== undefined) {
    const handler = handlerRef.current;
    https.createServer(Config.sslCert, handler).listen(portHttps, `0.0.0.0`);
    http.createServer(handler).listen(portHttp, `127.0.0.1`);
  }
};
