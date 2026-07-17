/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/try-complexity */
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

  app.addContentTypeParser(`application/x-www-form-urlencoded`, { parseAs: `string` }, (_request, body, done) => {
    try {
      const text = _.isString(body) ? body : body.toString(`utf8`);
      done(null, _.fromEntries([...new URLSearchParams(text)]));
    } catch (error) {
      done(error instanceof Error ? error : new Error(`Invalid form body`), undefined);
    }
  });

  return app;
};
