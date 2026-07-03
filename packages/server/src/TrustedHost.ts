/* eslint-disable functional/no-expression-statements */
/* eslint-disable unicorn/no-null */
import type { IncomingMessage, ServerResponse } from "node:http";

import tls, { type SecureContextOptions } from "node:tls";

const hostOnly = (value: string | undefined) => value?.split(`:`)[0]?.toLowerCase() ?? ``;
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

const requestHandler = (host: string, handler: (request: IncomingMessage, response: ServerResponse) => void) => {
  const trusted = allowedHosts(host);

  return (request: IncomingMessage, response: ServerResponse) => {
    if (!trusted.has(hostOnly(request.headers.host))) {
      request.socket.destroy();

      return;
    }
    handler(request, response);
  };
};

export const TrustedHost = { requestHandler, sni };
