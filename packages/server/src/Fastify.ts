/* eslint-disable functional/no-expression-statements */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { SecureServerOptions } from "node:http2";

import fastifyCookie from "@fastify/cookie";
import { _ } from "@snappy/core";
import fastify, { type FastifyInstance } from "fastify";

export type FastifyConfig = { https?: SecureServerOptions };

export const Fastify = async ({ https: httpsOptions }: FastifyConfig = {}): Promise<FastifyInstance> => {
  const bodyLimitMegaBytes = 50;
  const bodyLimit = _.mb(bodyLimitMegaBytes);
  const shared = { bodyLimit, routerOptions: { maxParamLength: 5000 }, trustProxy: true };

  if (httpsOptions === undefined) {
    const app = fastify(shared);
    await app.register(fastifyCookie);

    return app;
  }

  const app = fastify({ ...shared, http2: true, https: httpsOptions });
  await app.register(fastifyCookie);

  return app as unknown as FastifyInstance;
};
