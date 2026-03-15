import { Config } from "@snappy/config";
import { App } from "@snappy/server";
import { ServerApp } from "@snappy/server-app";

const port = 80;
const appContext = ServerApp(Config, { apiBaseUrl: `http://127.0.0.1` });
const app = await App.createApp({ allowCorsOrigin: true, api: appContext.api, botApiKey: Config.botApiKey });

void process.stdout.write(`🚀 Starting server…\n`);
await app.listen({ host: `0.0.0.0`, port });
void process.stdout.write(`  API http://localhost\n`);
void appContext.start();
