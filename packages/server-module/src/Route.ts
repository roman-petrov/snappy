import type { MimeType } from "@snappy/core";
import type { Locale } from "@snappy/intl";
import type { FastifyInstance, FastifyRequest } from "fastify";

export type FileRoute = { name: string; path: string; root: string };

export type LocaleTextRoute = { path: string; text: (locale: Locale) => string; type: MimeType };

export type RoutesInput = {
  files?: FileRoute[];
  localeTexts?: LocaleTextRoute[];
  streams?: StreamRoute[];
  texts?: TextRoute[];
};

export type RoutesRegisterInput = {
  app: FastifyInstance;
  locale: (request: FastifyRequest) => Locale;
  routes: RoutesInput;
};

export type StreamRoute = { disposition?: string; file: string; path: string; type: MimeType };

export type TextRoute = { path: string; text: string; type: MimeType };
