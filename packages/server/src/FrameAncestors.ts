/* eslint-disable functional/no-expression-statements */
import type { FastifyInstance } from "fastify";

import { YandexMetricaIntegration } from "@snappy/metrics";

const register = (app: FastifyInstance) => {
  app.addHook(`onSend`, (_request, reply, _payload, done) => {
    reply.header(`Content-Security-Policy`, YandexMetricaIntegration.frameAncestors);
    done();
  });
};

export const FrameAncestors = { register };
