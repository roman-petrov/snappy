import type { Locale } from "@snappy/intl";
import type { ResolvedTheme } from "@snappy/ui-core";
import type { FastifyInstance, FastifyReply } from "fastify";

export type HtmlCache = (input: HtmlCacheReply) => Promise<void>;

export type HtmlCacheReply = {
  contentType: string;
  key: string;
  load: () => Buffer | Promise<Buffer | string> | string;
  reply: FastifyReply;
};

export type InjectTheme = (html: string, theme: ResolvedTheme | undefined) => string;

export type PrepareIndex = (html: string, locale: Locale, theme: ResolvedTheme | undefined) => string;

export type ServerModule = (distDir: string) => {
  mount: StaticMount;
  run: (config: ServerModuleConfig) => Promise<void>;
};

export type ServerModuleConfig = {
  app: FastifyInstance;
  distDir: string;
  htmlCache: HtmlCache;
  injectTheme: InjectTheme;
  prepareIndex: PrepareIndex;
  serveSpa: ServeSpa;
};

export type ServeSpa = (config: ServeSpaConfig) => void;

export type ServeSpaConfig = { cacheKeyPrefix: string; distName: string; prefix: string };

export type StaticMount = { prefix: string; root: string };
