/* eslint-disable functional/no-expression-statements */
/* eslint-disable unicorn/no-null */
import type { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";

import tls, { type SecureContextOptions } from "node:tls";

const allowedHosts = (host: string) => new Set([`www.${host.toLowerCase()}`, host.toLowerCase()]);

const sni = (host: string, ssl: SecureContextOptions) => {
  const context = tls.createSecureContext(ssl);
  const trusted = allowedHosts(host);

  return (servername: string, callback: (error: Error | null, context?: tls.SecureContext) => void) => {
    if (!trusted.has(servername.toLowerCase())) {
      callback(new Error(`untrusted SNI host: ${servername}`));

      return;
    }
    callback(null, context);
  };
};

const onRequest = (host: string) => (request: FastifyRequest, _reply: FastifyReply, done: HookHandlerDoneFunction) => {
  if (!allowedHosts(host).has(request.hostname.toLowerCase())) {
    request.socket.destroy();

    return;
  }
  done();
};

export const TrustedHost = { onRequest, sni };
