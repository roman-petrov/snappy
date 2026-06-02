/* eslint-disable functional/no-expression-statements */
import type { ServerModule } from "@snappy/server-module";

import { App, AppManifestHost } from "./core";

export const AppServer: ServerModule = async ({ app, cookie, serveSpa }) => {
  await App({ app });
  await serveSpa({ cacheKeyPrefix: `app:index`, distName: `app`, prefix: `/app` });
  AppManifestHost.fastify(app, cookie);
};
