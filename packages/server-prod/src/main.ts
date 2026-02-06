import { _ } from "@snappy/core";
import { Server } from "@snappy/server";
import { join } from "node:path";

const envConfig = process.env[`SNAPPY_CONFIG`];
if (envConfig === undefined) {
  throw new Error(`SNAPPY_CONFIG environment variable is not set`);
}
const configJson = _.base64decode(envConfig);
const sslCertB64 = process.env[`SSL_CERT_PEM`];
const sslKeyB64 = process.env[`SSL_KEY_PEM`];
const sslCertPem = sslCertB64 === undefined ? undefined : _.base64decode(sslCertB64);
const sslKeyPem = sslKeyB64 === undefined ? undefined : _.base64decode(sslKeyB64);
const snappyVersion = process.env[`SNAPPY_VERSION`];
const root = join(import.meta.dirname, `www`);

Server.start(configJson, { root, snappyVersion, sslCertPem, sslKeyPem });
