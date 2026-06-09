/* eslint-disable functional/no-expression-statements */
import type { Express } from "express";
import type { FastifyInstance } from "fastify";

import { Settings } from "@snappy/ui-core";

import { AppManifest } from "./AppManifest";

const path = `/app/manifest.webmanifest`;
const contentType = `application/manifest+json`;

const express = (app: Express) => {
  app.get(path, (request, response) => {
    response.type(contentType).send(AppManifest.body(Settings({ headers: request.headers }).locale));
  });
};

const fastify = (app: FastifyInstance) => {
  app.get(path, async (request, reply) => {
    reply.type(contentType);
    await reply.send(AppManifest.body(Settings(request).locale));
  });
};

export const AppManifestHost = { express, fastify };
