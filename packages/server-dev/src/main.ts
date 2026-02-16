/* eslint-disable sonarjs/void-use */
/* eslint-disable @typescript-eslint/strict-void-return */
import { Config } from "@snappy/config";
import { App } from "@snappy/server";
import { ServerApp } from "@snappy/server-app";
import http from "node:http";

const port = 3000;
const appContext = ServerApp(Config, { botBaseUrl: `http://localhost:${port}` });

const app = App.createApp({
  allowCorsOrigin: `http://localhost:5173`,
  api: appContext.api,
  botApiKey: Config.botApiKey,
});

const server = http.createServer(app);

void process.stdout.write(`🚀 Starting server…\n`);

server.listen(port, () => {
  void process.stdout.write(`  API http://localhost:${port}\n`);
  void appContext.start();
});
