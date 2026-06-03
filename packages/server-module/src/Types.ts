import type { Locale } from "@snappy/intl";
import type { Theme } from "@snappy/ui-core";
import type { FastifyInstance, FastifyReply } from "fastify";

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

export type ServerModule = (distDir: string) => {
  mount: StaticMount;
  run: (config: ServerModuleConfig) => Promise<void>;
};

export type ServerModuleConfig = {
  app: FastifyInstance;
  cookie: SettingsCookie;
  distDir: string;
  htmlCache: HtmlCache;
  injectTheme: InjectTheme;
  prepareIndex: PrepareIndex;
  serveSpa: ServeSpa;
};

export type ServeSpa = (config: ServeSpaConfig) => void;

export type ServeSpaConfig = { cacheKeyPrefix: string; distName: string; prefix: string };

export type SettingsCookie = (cookie?: string, acceptLanguage?: string) => LocaleTheme;

export type StaticMount = { prefix: string; root: string };
