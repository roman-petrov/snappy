/* eslint-disable functional/no-expression-statements */
import type { SecureServerOptions } from "node:http2";

import fastifyCookie from "@fastify/cookie";
import { _ } from "@snappy/core";
import fastify from "fastify";

export type FastifyConfig = { https?: SecureServerOptions };

export const Fastify = async ({ https: httpsOptions }: FastifyConfig = {}) => {
  const bodyLimitMegaBytes = 50;
  const bodyLimit = _.mb(bodyLimitMegaBytes);
  const shared = { bodyLimit, routerOptions: { maxParamLength: 5000 }, trustProxy: true };

  const app = fastify({
    ...shared,
    ...(httpsOptions === undefined ? {} : { http2: true, https: { ...httpsOptions, allowHTTP1: true } }),
  });
  await app.register(fastifyCookie);

  return app;
};
