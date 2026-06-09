/* eslint-disable functional/no-expression-statements */
import type { ServerModule } from "@snappy/server-module";

import { join } from "node:path";

import { App, AppManifestHost } from "./core";

export const AppServer: ServerModule = distDir => {
  const spa = { cacheKeyPrefix: `app:index`, distName: `app`, prefix: `/app` } as const;

  return {
    mount: { prefix: `${spa.prefix}/assets/`, root: join(distDir, spa.distName, `assets`) },
    run: async ({ app, serveSpa }) => {
      await App({ app });
      serveSpa(spa);
      AppManifestHost.fastify(app);
    },
  };
};
