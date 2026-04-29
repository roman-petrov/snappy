import { App } from "@snappy/server";
import { ServerApp } from "@snappy/server-app";

const port = 80;
const app = await App({ api: await ServerApp() });

await app.listen({ host: `0.0.0.0`, port });
