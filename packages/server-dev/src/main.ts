/* eslint-disable sonarjs/void-use */
/* eslint-disable @typescript-eslint/strict-void-return */
import { Config } from "@snappy/config";
import { createApp } from "@snappy/server";
import { ServerApp } from "@snappy/server-app";
import http from "node:http";

const appContext = ServerApp(Config);

const app = createApp({ allowCorsOrigin: `http://localhost:5173`, api: appContext.api, botApiKey: Config.botApiKey });

const server = http.createServer(app);

void process.stdout.write(`🚀 Starting server…\n`);

server.listen(Config.apiPort, () => {
  void process.stdout.write(`  API http://localhost:${Config.apiPort}\n`);
  void appContext.start();
});
