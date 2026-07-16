/* eslint-disable functional/no-expression-statements */
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { HttpStatus } from "@snappy/core";

import { TunnelClient } from "./TunnelClient";
import { TunnelHub } from "./TunnelHub";

export type TunnelConfig = {
  app: FastifyInstance;
  authorize?: (request: FastifyRequest) => boolean;
  entryPath: string;
  handle: (request: FastifyRequest, reply: FastifyReply) => Promise<void> | void;
  host: string;
  hub?: boolean;
  key: string;
  localPath: string;
  wsPath: string;
};

export const Tunnel = async ({
  app,
  authorize,
  entryPath,
  handle,
  host,
  hub = false,
  key,
  localPath,
  wsPath,
}: TunnelConfig) => {
  const gate = async (request: FastifyRequest, reply: FastifyReply) => {
    if (authorize !== undefined && !authorize(request)) {
      await reply.status(HttpStatus.forbidden).send();

      return false;
    }

    return true;
  };

  app.post(localPath, async (request, reply) => {
    if (!(await gate(request, reply))) {
      return;
    }
    await handle(request, reply);
  });

  if (hub) {
    const { proxy } = await TunnelHub({ key }).register(app, wsPath);
    app.post(entryPath, async (request, reply) => {
      if (!(await gate(request, reply))) {
        return;
      }
      await proxy(reply, localPath, { json: request.body });
    });

    return undefined;
  }

  return TunnelClient({ key, url: `wss://${host}${wsPath}` });
};
