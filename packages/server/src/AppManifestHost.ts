/* eslint-disable functional/no-expression-statements */
import type { Express } from "express";
import type { FastifyInstance } from "fastify";

import { AppManifest } from "./AppManifest";
import { Cookie } from "./Cookie";

const path = `/app/manifest.webmanifest`;
const contentType = `application/manifest+json`;
const body = (cookie?: string, acceptLanguage?: string) => AppManifest.body(Cookie(cookie, acceptLanguage).locale);

const express = (app: Express) => {
  app.get(path, (request, response) => {
    response.type(contentType).send(body(request.headers.cookie, request.headers[`accept-language`]));
  });
};

const fastify = (app: FastifyInstance) => {
  app.get(path, async (request, reply) => {
    reply.type(contentType);
    await reply.send(body(request.headers.cookie, request.headers[`accept-language`]));
  });
};

export const AppManifestHost = { express, fastify };
