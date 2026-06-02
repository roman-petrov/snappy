/* eslint-disable functional/no-expression-statements */
import type { ServerModule } from "@snappy/server-module";

import { Admin } from "./core";

export const AdminServer: ServerModule = async ({ app, serveSpa }) => {
  await Admin({ app });
  await serveSpa({ cacheKeyPrefix: `admin:index`, distName: `admin`, prefix: `/admin` });
};
