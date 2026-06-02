import type { IncomingMessage, Server, ServerResponse } from "node:http";

import { _ } from "@snappy/core";
import fastify from "fastify";

export type FastifyConfig = {
  serverFactory?: (handler: (request: IncomingMessage, response: ServerResponse) => void) => Server;
};

export const Fastify = ({ serverFactory }: FastifyConfig = {}) => {
  const bodyLimitMegaBytes = 50;
  const bodyLimit = _.mb(bodyLimitMegaBytes);

  return fastify({ bodyLimit, routerOptions: { maxParamLength: 5000 }, serverFactory });
};
