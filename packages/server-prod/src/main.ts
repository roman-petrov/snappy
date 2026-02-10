/* eslint-disable sonarjs/x-powered-by */
import { Config } from "@snappy/config";
import { _ } from "@snappy/core";
import { Database } from "@snappy/db";
import { SnappyBot } from "@snappy/snappy-bot";
import express from "express";
import http from "node:http";
import https from "node:https";
import { join } from "node:path";

const sslCertB64 = process.env[`SSL_CERT_PEM`];
const sslKeyB64 = process.env[`SSL_KEY_PEM`];
const sslCertPem = sslCertB64 === undefined ? undefined : _.base64decode(sslCertB64);
const sslKeyPem = sslKeyB64 === undefined ? undefined : _.base64decode(sslKeyB64);
const version = process.env[`SNAPPY_VERSION`];
const root = join(import.meta.dirname, `www`);
const db = Database(Config.dbUrl);
const bot = SnappyBot({ ...Config, db, version });
const portHttp = 80;
const portHttps = 443;
const useHttps = sslCertPem !== undefined && sslKeyPem !== undefined;
const port = useHttps ? portHttps : portHttp;
const app = express();
app.disable(`x-powered-by`);
app.use(express.static(root));
const handler = (request: http.IncomingMessage, response: http.ServerResponse) => {
  app(request, response);
};

const httpServer = useHttps
  ? https.createServer({ cert: sslCertPem, key: sslKeyPem }, handler)
  : http.createServer(handler);

process.stdout.write(`🚀 Starting server…\n`);
void bot.start();
httpServer.listen(port, () => {
  process.stdout.write(`🌐 Site server started on port ${port} (${useHttps ? `HTTPS` : `HTTP`})\n`);
});
