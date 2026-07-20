/* eslint-disable no-await-in-loop */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
import type { Locale } from "@snappy/intl";
import type { RoutesConfig, RoutesInput, ServerModule, ServerModuleConfig } from "@snappy/server-module";
import type { FastifyReply } from "fastify";
import type { IncomingHttpHeaders } from "node:http";
import type { Writable } from "node:stream";

import { HttpStatus, type MimeType } from "@snappy/core";
import { File } from "@snappy/node";
import { Settings } from "@snappy/ui-core";

type DevApp = {
  get: (path: string, handler: (request: { headers: IncomingHttpHeaders }, response: DevResponse) => void) => void;
};

type DevResponse = Writable & {
  send: (body: string) => void;
  sendFile: (name: string, options: { root: string }) => void;
  setHeader: (name: string, value: string) => void;
  status: (code: number) => { end: () => void };
  type: (type: string) => { send: (body: string) => void };
};

type Get = (path: string, handler: (locale: Locale, send: Send) => unknown) => void;

type Send = {
  file: (name: string, root: string) => unknown;
  notFound: () => unknown;
  stream: (file: string, type: MimeType, disposition?: string) => unknown;
  text: (type: MimeType, body: string) => unknown;
};

const register = (get: Get, { files = [], localeTexts = [], streams = [], texts = [] }: RoutesInput) => {
  for (const { path, text, type } of texts) {
    get(path, (_locale, send) => send.text(type, text));
  }
  for (const { path, text, type } of localeTexts) {
    get(path, (locale, send) => send.text(type, text(locale)));
  }
  for (const { name, path, root } of files) {
    get(path, (_locale, send) => send.file(name, root));
  }
  for (const { disposition, file, path, type } of streams) {
    get(path, (_locale, send) => send.stream(file, type, disposition));
  }
};

const fastifySend = (reply: FastifyReply): Send => ({
  file: (name, root) => reply.sendFile(name, root),
  notFound: () => reply.code(HttpStatus.notFound).send(),
  stream: async (file, type, disposition) => {
    if (!File.exists(file)) {
      return reply.code(HttpStatus.notFound).send();
    }
    if (disposition !== undefined) {
      reply.header(`Content-Disposition`, disposition);
    }

    return reply.type(type).send(File.stream(file));
  },
  text: (type, body) => reply.type(type).send(body),
});

const connectSend = (response: DevResponse): Send => ({
  file: (name, root) => response.sendFile(name, { root }),
  notFound: () => response.status(HttpStatus.notFound).end(),
  stream: (file, type, disposition) => {
    if (!File.exists(file)) {
      return response.status(HttpStatus.notFound).end();
    }
    if (disposition !== undefined) {
      response.setHeader(`Content-Disposition`, disposition);
    }
    response.type(type);

    return File.stream(file).pipe(response);
  },
  text: (type, body) => response.type(type).send(body),
});

const run = async (factories: ServerModule[], config: ServerModuleConfig) => {
  const get: Get = (path, handler) => {
    config.app.get(path, (request, reply) => handler(Settings(request).locale, fastifySend(reply)));
  };

  for (const { routes, run: start } of factories.map(factory => factory(config.distDir))) {
    await start(config);
    const input = await routes?.(config);
    if (input !== undefined) {
      register(get, input);
    }
  }
};

const dev = async (app: DevApp, factories: ServerModule[], config: RoutesConfig) => {
  const get: Get = (path, handler) => {
    app.get(path, (request, response) => {
      void handler(Settings({ headers: request.headers }).locale, connectSend(response));
    });
  };

  for (const { routes } of factories.map(factory => factory(config.distDir))) {
    const input = await routes?.(config);
    if (input !== undefined) {
      register(get, input);
    }
  }
};

export const Modules = { dev, run };
