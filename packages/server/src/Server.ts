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
import { Modules } from "./Modules";
import { Spa } from "./ServeSpa";
import { Static } from "./Static";
import { TrustedHost } from "./TrustedHost";

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
  const shared = { app, distDir, htmlCache, injectTheme: Html.injectTheme, prepareIndex: Html.prepareIndex };
  const modules = [SiteServer, AppServer, AdminServer];

  await Static.register(
    app,
    modules.map(factory => factory(distDir).mount),
  );

  await Modules.run(modules, { ...shared, serveSpa: Spa(shared) });

  await app.ready();

  if (handlerRef.current !== undefined) {
    const handler = TrustedHost.requestHandler(Config.host, handlerRef.current);
    const ssl = Config.ssl();
    https
      .createServer({ ...ssl, SNICallback: TrustedHost.sni(Config.host, ssl) }, handler)
      .listen(portHttps, `0.0.0.0`);
    http.createServer(handler).listen(portHttp, `127.0.0.1`);
  }
};
