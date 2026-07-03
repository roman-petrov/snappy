import type { MimeType } from "@snappy/core";
import type { Locale } from "@snappy/intl";
import type { ResolvedTheme } from "@snappy/ui-core";
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export type HtmlCache = (input: HtmlCacheReply) => Promise<void>;

export type HtmlCacheReply = {
  contentType: MimeType;
  key: string;
  load: () => Buffer | Promise<Buffer | string> | string;
  reply: FastifyReply;
};

export type InjectTheme = (html: string, theme: ResolvedTheme | undefined) => string;

export type PrepareIndex = (html: string, locale: Locale, theme: ResolvedTheme | undefined) => string;

import type { RoutesInput } from "./Route";

export type RoutesConfig = Pick<ServerModuleConfig, `distDir` | `site`>;

export type ServerModule = (distDir: string) => {
  mount: StaticMount;
  routes?: (config: RoutesConfig) => Promise<RoutesInput> | RoutesInput;
  run: (config: ServerModuleConfig) => Promise<void>;
};

export type ServerModuleConfig = {
  app: FastifyInstance;
  distDir: string;
  htmlCache: HtmlCache;
  injectTheme: InjectTheme;
  prepareIndex: PrepareIndex;
  serveSpa: ServeSpa;
  site?: SiteHandlers;
};

export type ServeSpa = (config: ServeSpaConfig) => void;

export type ServeSpaConfig = { cacheKeyPrefix: string; distName: string; prefix: string };

export type SiteHandlers = {
  pages: { paths: readonly string[] };
  route?: (path: string) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
};

export type StaticMount = { prefix: string; root: string };
