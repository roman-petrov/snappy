/**
 * Public dev site + Vite HMR on HTTPS :443 — open `https://localhost/` (accept the self-signed warning once).
 * Fastify stays HTTPS on loopback; `/api` is proxied from this server. Binding :443 may require elevated privileges on Windows.
 */
export const devPort = 443;

export const devAppUrl = `https://localhost`;

export const devBridgeWsUrl = `wss://localhost/api/ws/bridge`;
