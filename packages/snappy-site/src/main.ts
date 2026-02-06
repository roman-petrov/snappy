/* eslint-disable functional/immutable-data */
import { _ } from "@snappy/core";
import http from "node:http";
import https from "node:https";
import serveStatic from "serve-static";

const portHttp = 80;
const portHttps = 443;
const certB64 = process.env[`SSL_CERT_PEM`];
const keyB64 = process.env[`SSL_KEY_PEM`];
const useHttps = certB64 !== undefined && keyB64 !== undefined;
const certPem = useHttps ? _.base64decode(certB64) : undefined;
const keyPem = useHttps ? _.base64decode(keyB64) : undefined;
const port = useHttps ? portHttps : portHttp;
const root = import.meta.dirname;
const serve = serveStatic(root);

const handler = (request: http.IncomingMessage, response: http.ServerResponse) => {
  serve(request, response, () => {
    response.statusCode = 404;
    response.end();
  });
};

const server = useHttps
  ? https.createServer({ cert: certPem ?? ``, key: keyPem ?? `` }, handler)
  : http.createServer(handler);

server.listen(port, () => {
  process.stdout.write(`Site server listening on port ${port} (${useHttps ? `HTTPS` : `HTTP`})\n`);
});
