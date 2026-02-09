/* eslint-disable functional/no-expression-statements */
import { SnappyBot } from "@snappy/snappy-bot";

import { AppConfiguration } from "./AppConfiguration";
import { Config } from "./Config";
import { HttpServer, type HttpServerOptions } from "./HttpServer";

const noopServer = { start: () => {}, stop: async () => {} };

export type ServerOptions =
  | (HttpServerOptions & { serveSite?: boolean; snappyVersion?: string })
  | { serveSite: false; snappyVersion?: string };

export const Server = (configJson: string, options: ServerOptions) => {
  const config = { ...Config(configJson), ...options };
  const bot = SnappyBot({ ...config, ...AppConfiguration });
  const httpServer = options.serveSite === false ? noopServer : HttpServer(config as HttpServerOptions);

  const start = () => {
    process.stdout.write(`🚀 Starting server…\n`);
    void bot.start();
    httpServer.start();
  };

  const stop = () => {
    process.stdout.write(`🚀 Stopping server…\n`);
    void bot.stop();
    void httpServer.stop();
  };

  return { start, stop };
};

export type Server = ReturnType<typeof Server>;
