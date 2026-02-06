/* eslint-disable functional/no-expression-statements */
import { SnappyBot } from "@snappy/snappy-bot";

import { AppConfiguration } from "./AppConfiguration";
import { Config } from "./Config";
import { HttpServer, type HttpServerOptions } from "./HttpServer";

export type ServerOptions = HttpServerOptions & { snappyVersion?: string };

const start = (configJson: string, options: ServerOptions): void => {
  process.stdout.write(`🚀 Starting server…\n`);
  const config = { ...Config(configJson), ...options };
  HttpServer(config).start();
  void SnappyBot.start({ ...config, ...AppConfiguration });
};

export const Server = { start };
