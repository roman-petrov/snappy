/* eslint-disable no-await-in-loop */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-expression-statements */
import type { Locale } from "@snappy/intl";
import type { RoutesConfig, RoutesInput, ServerModule, ServerModuleConfig } from "@snappy/server-module";
import type { Express, Response } from "express";
import type { FastifyReply } from "fastify";

import { HttpStatus, type MimeType } from "@snappy/core";
import { File } from "@snappy/node";
import { Settings } from "@snappy/ui-core";

type Get = (path: string, handler: (locale: Locale, send: Send) => Promise<void> | void) => void;

type Send = {
  file: (name: string, root: string) => Promise<void> | void;
  notFound: () => Promise<void> | void;
  stream: (file: string, type: MimeType, disposition?: string) => Promise<void> | void;
  text: (type: MimeType, body: string) => Promise<void> | void;
};

const register = (get: Get, { files = [], localeTexts = [], streams = [], texts = [] }: RoutesInput) => {
  for (const { path, text, type } of texts) {
    get(path, async (_locale, send) => send.text(type, text));
  }
  for (const { path, text, type } of localeTexts) {
    get(path, async (locale, send) => send.text(type, text(locale)));
  }
  for (const { name, path, root } of files) {
    get(path, async (_locale, send) => send.file(name, root));
  }
  for (const { disposition, file, path, type } of streams) {
    get(path, async (_locale, send) => send.stream(file, type, disposition));
  }
};

const fastifySend = (reply: FastifyReply): Send => ({
  file: async (name, root) => {
    await reply.sendFile(name, root);
  },
  notFound: async () => {
    await reply.code(HttpStatus.notFound).send();
  },
  stream: async (file, type, disposition) => {
    if (!File.exists(file)) {
      await reply.code(HttpStatus.notFound).send();

      return;
    }
    if (disposition !== undefined) {
      reply.header(`Content-Disposition`, disposition);
    }
    reply.type(type);
    await reply.send(File.stream(file));
  },
  text: async (type, body) => {
    await reply.type(type).send(body);
  },
});

const expressSend = (response: Response): Send => ({
  file: (name, root) => {
    response.sendFile(name, { root });
  },
  notFound: () => {
    response.status(HttpStatus.notFound).end();
  },
  stream: (file, type, disposition) => {
    if (!File.exists(file)) {
      response.status(HttpStatus.notFound).end();

      return;
    }
    if (disposition !== undefined) {
      response.setHeader(`Content-Disposition`, disposition);
    }
    response.type(type);
    File.stream(file).pipe(response);
  },
  text: (type, body) => {
    response.type(type).send(body);
  },
});

const run = async (factories: ServerModule[], config: ServerModuleConfig) => {
  const get: Get = (path, handler) => {
    config.app.get(path, async (request, reply) => {
      await handler(Settings(request).locale, fastifySend(reply));
    });
  };

  for (const { routes, run: start } of factories.map(factory => factory(config.distDir))) {
    await start(config);
    const input = await routes?.(config);

    if (input !== undefined) {
      register(get, input);
    }
  }
};

const dev = async (app: Express, factories: ServerModule[], config: RoutesConfig) => {
  const get: Get = (path, handler) => {
    app.get(path, (request, response) => {
      void handler(Settings({ headers: request.headers }).locale, expressSend(response));
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
