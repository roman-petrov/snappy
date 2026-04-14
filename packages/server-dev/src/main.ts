import { Config } from "@snappy/config";
import { App } from "@snappy/server";
import { ServerApp } from "@snappy/server-app";

const port = 80;
const appContext = await ServerApp(Config);
const app = await App.createApp({ allowCorsOrigin: true, api: appContext });

await app.listen({ host: `0.0.0.0`, port });
