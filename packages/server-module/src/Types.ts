import type { FastifyStaticOptions } from "@fastify/static";
import type { Locale } from "@snappy/intl";
import type { Theme } from "@snappy/ui-core";
import type { FastifyInstance, FastifyReply } from "fastify";

export type Cookie = (cookie?: string, acceptLanguage?: string) => LocaleTheme;

export type HtmlCache = (input: HtmlCacheReply) => Promise<void>;

export type HtmlCacheReply = {
  contentType: string;
  key: string;
  load: () => Buffer | Promise<Buffer | string> | string;
  reply: FastifyReply;
};

export type InjectTheme = (html: string, theme: Theme | undefined) => string;

export type LocaleTheme = { locale: Locale; theme: Theme | undefined };

export type PrepareIndex = (html: string, locale: Locale, theme: Theme | undefined) => string;

export type ServerModule = (config: ServerModuleConfig) => Promise<void>;

export type ServerModuleConfig = {
  app: FastifyInstance;
  cookie: Cookie;
  distDir: string;
  htmlCache: HtmlCache;
  injectTheme: InjectTheme;
  prepareIndex: PrepareIndex;
  setHeaders: StaticSetHeaders;
};

export type StaticSetHeaders = NonNullable<FastifyStaticOptions[`setHeaders`]>;
