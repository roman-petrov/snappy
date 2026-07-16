/* eslint-disable functional/no-expression-statements */
import { AdminServer } from "@snappy/admin-server";
import { AppServer } from "@snappy/app-server";
import { Config } from "@snappy/config";
import { HttpConstants } from "@snappy/core";
import { SiteServer } from "@snappy/site-server";
import { join } from "node:path";

import { Fastify } from "./Fastify";
import { Html } from "./Html";
import { HtmlCache } from "./HtmlCache";
import { Modules } from "./Modules";
import { SecurityHeaders } from "./SecurityHeaders";
import { Spa } from "./ServeSpa";
import { Static } from "./Static";
import { TrustedHost } from "./TrustedHost";

export const Server = async () => {
  const distDir = join(process.cwd(), `dist`);
  const ssl = Config.ssl();
  const app = await Fastify({ https: { ...ssl, SNICallback: TrustedHost.sni(Config.host, ssl) } });

  app.addHook(`onRequest`, TrustedHost.onRequest(Config.host));
  SecurityHeaders.register(app);

  const htmlCache = HtmlCache();
  const shared = { app, distDir, htmlCache, injectTheme: Html.injectTheme, prepareIndex: Html.prepareIndex };
  const modules = [SiteServer, AppServer, AdminServer];

  await Static.register(
    app,
    modules.map(factory => factory(distDir).mount),
  );

  await Modules.run(modules, { ...shared, serveSpa: Spa(shared) });

  await app.listen({ host: `0.0.0.0`, port: HttpConstants.httpsPort });
};
