// cspell:word nosniff
/* eslint-disable functional/no-expression-statements */
import type { FastifyInstance } from "fastify";

import { ConfigValues } from "@snappy/config";
import { YandexMetricaIntegration } from "@snappy/metrics";

const register = (app: FastifyInstance) => {
  app.addHook(`onSend`, (_request, reply, _payload, done) => {
    reply.header(`Content-Security-Policy`, YandexMetricaIntegration.frameAncestors);
    reply.header(`Referrer-Policy`, `strict-origin-when-cross-origin`);
    reply.header(`X-Content-Type-Options`, `nosniff`);
    if (ConfigValues.production()) {
      reply.header(`Strict-Transport-Security`, `max-age=31536000; includeSubDomains`);
    }
    done();
  });
};

export const SecurityHeaders = { register };
