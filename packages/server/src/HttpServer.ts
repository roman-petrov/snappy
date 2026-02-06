/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
import http, { type IncomingMessage, type ServerResponse } from "node:http";
import https from "node:https";
import serveStatic from "serve-static";

const portHttp = 80;
const portHttps = 443;

export type HttpServerMiddleware = { createHandler: (root: string, next: RequestHandler) => RequestHandler };

export type HttpServerOptions = {
  middleware?: HttpServerMiddleware;
  root: string;
  sslCertPem?: string;
  sslKeyPem?: string;
};

type RequestHandler = (request: IncomingMessage, response: ServerResponse) => void;

export const HttpServer = (options: HttpServerOptions) => {
  const start = (): void => {
    const { root } = options;
    const serve = serveStatic(root);
    const { middleware, sslCertPem: certPem, sslKeyPem: keyPem } = options;
    const useHttps = certPem !== undefined && keyPem !== undefined;
    const port = useHttps ? portHttps : portHttp;

    const baseHandler: RequestHandler = (request, response) => {
      serve(request, response, () => {
        response.statusCode = 404;
        response.end();
      });
    };

    const handler = middleware === undefined ? baseHandler : middleware.createHandler(root, baseHandler);
    const server = useHttps ? https.createServer({ cert: certPem, key: keyPem }, handler) : http.createServer(handler);

    server.listen(port, () => {
      process.stdout.write(`🌐 Site server started on port ${port} (${useHttps ? `HTTPS` : `HTTP`})\n`);
    });
  };

  return { start };
};

export type HttpServer = ReturnType<typeof HttpServer>;
