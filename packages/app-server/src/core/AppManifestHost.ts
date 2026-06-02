/* eslint-disable functional/no-expression-statements */
import type { Cookie } from "@snappy/server-module";
import type { Express } from "express";
import type { FastifyInstance } from "fastify";

import { AppManifest } from "./AppManifest";

const path = `/app/manifest.webmanifest`;
const contentType = `application/manifest+json`;

const body = (cookie: Cookie, value?: string, acceptLanguage?: string) =>
  AppManifest.body(cookie(value, acceptLanguage).locale);

const express = (app: Express, cookie: Cookie) => {
  app.get(path, (request, response) => {
    response.type(contentType).send(body(cookie, request.headers.cookie, request.headers[`accept-language`]));
  });
};

const fastify = (app: FastifyInstance, cookie: Cookie) => {
  app.get(path, async (request, reply) => {
    reply.type(contentType);
    await reply.send(body(cookie, request.headers.cookie, request.headers[`accept-language`]));
  });
};

export const AppManifestHost = { express, fastify };
