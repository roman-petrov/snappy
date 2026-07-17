/* eslint-disable functional/no-expression-statements */
import type { ServerModule } from "@snappy/server-module";

import { join } from "node:path";

import { App } from "./core";

export const AdminServer: ServerModule = distDir => {
  const spa = { cacheKeyPrefix: `admin:index`, distName: `admin`, prefix: `/admin` } as const;

  return {
    mount: { prefix: `${spa.prefix}/assets/`, root: join(distDir, spa.distName, `assets`) },
    run: async ({ app, serveSpa }) => {
      await App({ app });
      serveSpa(spa);
    },
  };
};
