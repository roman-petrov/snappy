/* eslint-disable functional/no-expression-statements */
// import compression from "compression";
import express from "express";
import http from "node:http";
import https from "node:https";

const portHttp = 80;
const portHttps = 443;
const statusNotFound = 404;

export type HttpServerMiddleware = { createHandler: (root: string, next: RequestHandler) => RequestHandler };

export type HttpServerOptions = {
  middleware?: HttpServerMiddleware;
  root: string;
  sslCertPem?: string;
  sslKeyPem?: string;
};

type RequestHandler = (request: http.IncomingMessage, response: http.ServerResponse) => void;

export const HttpServer = (options: HttpServerOptions) => {
  const { middleware, root, sslCertPem: certPem, sslKeyPem: keyPem } = options;
  const useHttps = certPem !== undefined && keyPem !== undefined;
  const port = useHttps ? portHttps : portHttp;
  const app = express();
  // app.use(compression());
  if (middleware !== undefined) {
    app.use((request, response, next) => {
      const handler = middleware.createHandler(root, () => {
        next();
      });
      handler(request, response);
    });
  }
  app.use(express.static(root));
  app.use((_request, response) => {
    void response.status(statusNotFound).end();
  });
  const server = useHttps ? https.createServer({ cert: certPem, key: keyPem }, app) : http.createServer(app);

  const start = () => {
    server.listen(port, () => {
      process.stdout.write(`🌐 Site server started on port ${port} (${useHttps ? `HTTPS` : `HTTP`})\n`);
    });
  };

  const stop = async () =>
    new Promise<void>(resolve => {
      server.close(error => {
        if (error === undefined) {
          process.stdout.write(`🌐 Site server stopped\n`);
        } else {
          process.stderr.write(`${error.message}\n`);
        }
        resolve();
      });
    });

  return { start, stop };
};

export type HttpServer = ReturnType<typeof HttpServer>;
