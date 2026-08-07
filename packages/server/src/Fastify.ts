/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-try-statements */
/* eslint-disable unicorn/no-null */
/* eslint-disable unicorn/try-complexity */
import type { SecureServerOptions } from "node:http2";

import fastifyCookie from "@fastify/cookie";
import { _ } from "@snappy/core";
import { HttpLog } from "@snappy/log";
import fastify, { type FastifyInstance } from "fastify";

export type FastifyConfig = { https?: SecureServerOptions };

export const Fastify = async ({ https: httpsOptions }: FastifyConfig = {}): Promise<FastifyInstance> => {
  const bodyLimitMegaBytes = 50;
  const bodyLimit = _.mb(bodyLimitMegaBytes);
  const shared = { bodyLimit, loggerInstance: HttpLog, routerOptions: { maxParamLength: 5000 }, trustProxy: true };

  const app =
    httpsOptions === undefined
      ? fastify(shared)
      : (fastify({
          ...shared,
          http2: true,
          https: { ...httpsOptions, allowHTTP1: true },
        }) as unknown as FastifyInstance);
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
