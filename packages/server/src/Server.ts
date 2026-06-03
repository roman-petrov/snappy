/* eslint-disable no-await-in-loop */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import { AdminServer } from "@snappy/admin-server";
import { AppServer } from "@snappy/app-server";
import { Config } from "@snappy/config";
import { SiteServer } from "@snappy/site-server";
import http, { type IncomingMessage, type ServerResponse } from "node:http";
import https from "node:https";
import { join } from "node:path";

import { Fastify } from "./Fastify";
import { Html } from "./Html";
import { HtmlCache } from "./HtmlCache";
import { Spa } from "./ServeSpa";
import { SettingsCookie } from "./SettingsCookie";
import { Static } from "./Static";

export const Server = async () => {
  const distDir = join(process.cwd(), `dist`);
  const portHttp = 80;
  const portHttps = 443;

  const handlerRef: { current: ((request: IncomingMessage, response: ServerResponse) => void) | undefined } = {
    current: undefined,
  };

  const app = await Fastify({
    serverFactory: handler => {
      handlerRef.current = handler;

      return http.createServer(handler);
    },
  });

  const htmlCache = HtmlCache();

  const shared = {
    app,
    cookie: SettingsCookie,
    distDir,
    htmlCache,
    injectTheme: Html.injectTheme,
    prepareIndex: Html.prepareIndex,
  };

  const modules = [SiteServer(distDir), AppServer(distDir), AdminServer(distDir)];

  await Static.register(
    app,
    modules.map(({ mount }) => mount),
  );

  const serveSpa = Spa(shared);

  for (const { run } of modules) {
    await run({ ...shared, serveSpa });
  }

  await app.ready();

  if (handlerRef.current !== undefined) {
    const handler = handlerRef.current;
    https.createServer(Config.ssl(), handler).listen(portHttps, `0.0.0.0`);
    http.createServer(handler).listen(portHttp, `127.0.0.1`);
  }
};
