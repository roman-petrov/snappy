/* eslint-disable functional/no-expression-statements */
import { SnappyBot } from "@snappy/snappy-bot";

import { AppConfiguration } from "./AppConfiguration";
import { Config } from "./Config";
import { HttpServer, type HttpServerOptions } from "./HttpServer";

export type ServerOptions = HttpServerOptions & { snappyVersion?: string };

const start = (configJson: string, options: ServerOptions) => {
  process.stdout.write(`🚀 Starting server…\n`);
  const config = { ...Config(configJson), ...options };
  const bot = SnappyBot({ ...config, ...AppConfiguration });
  const httpServer = HttpServer(config);
  void bot.start();
  httpServer.start();
};

export const Server = { start };
