import { Config } from "@snappy/config";
import { App } from "@snappy/server";
import { ServerApp } from "@snappy/server-app";

const port = 3000;
const appContext = ServerApp(Config, { botBaseUrl: `http://localhost:${port}` });

const app = await App.createApp({
  allowCorsOrigin: `http://localhost:5173`,
  api: appContext.api,
  botApiKey: Config.botApiKey,
});

void process.stdout.write(`🚀 Starting server…\n`);

await app.listen({ host: `0.0.0.0`, port });
void process.stdout.write(`  API http://localhost:${port}\n`);
void appContext.start();
