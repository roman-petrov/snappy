/* eslint-disable functional/no-expression-statements */
import type { Db } from "@snappy/db";
import type { FastifyInstance } from "fastify";

import { Config } from "@snappy/config";
import { HttpStatus, MimeType } from "@snappy/core";

import type { BetterAuth } from "./BetterAuth";

import { ImageRoute } from "./ImageRoute";
import { Session } from "./Session";

export type ImagesMountConfig = { app: FastifyInstance; betterAuth: BetterAuth; db: Db };

const mount = ({ app, betterAuth, db }: ImagesMountConfig) => {
  // eslint-disable-next-line @typescript-eslint/naming-convention -- Fastify route generic
  app.get<{ Params: { file: string } }>(ImageRoute.mount, async (request, reply) => {
    const resolved = await Session.resolve(betterAuth, request.headers, db);

    if (resolved === undefined) {
      await reply.status(HttpStatus.unauthorized).send();

      return;
    }

    const { file } = request.params;
    const stream = await resolved.dbUser.feed.image(file);

    if (stream === undefined) {
      reply.callNotFound();

      return;
    }

    reply.header(`Cache-Control`, `private, max-age=${Config.s3ObjectMaxAgeSec}, immutable`);
    reply.type(MimeType.imagePng);
    await reply.send(stream);
  });
};

export const Images = { mount };

export type Images = typeof Images;
