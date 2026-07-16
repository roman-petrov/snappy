/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable functional/no-try-statements */
/* eslint-disable init-declarations */
/* eslint-disable unicorn/try-complexity */
import { _, HttpConstants, Timer } from "@snappy/core";
import tls from "node:tls";
import ws from "ws";

import { TunnelSocket } from "./TunnelSocket";

export type TunnelClientConfig = { key: string; url: string };

export const TunnelClient = ({ key, url }: TunnelClientConfig) => {
  const reconnectMs = 2 * _.second;
  let stopped = false;
  let tunnel: TunnelSocket | undefined;
  let cancelReconnect: (() => void) | undefined;
  const locals = new Map<number, tls.TLSSocket>();
  const opening = new Set<number>();
  const pending = new Map<number, Buffer[]>();

  const closeLocal = (id: number) => {
    opening.delete(id);
    pending.delete(id);
    const local = locals.get(id);
    if (local === undefined) {
      return;
    }
    locals.delete(id);
    local.destroy();
  };

  const dial = async (port: number) =>
    new Promise<tls.TLSSocket>((resolve, reject) => {
      const connected = tls.connect({ host: HttpConstants.loopback, port, rejectUnauthorized: false }, () => {
        connected.off(`error`, reject);
        resolve(connected);
      });
      connected.once(`error`, reject);
    });

  const flushPending = (id: number, local: tls.TLSSocket) => {
    const chunks = pending.get(id) ?? [];
    pending.delete(id);
    for (const chunk of chunks) {
      local.write(chunk);
    }
  };

  const openStream = async (id: number, port: number) => {
    opening.add(id);
    try {
      const local = await dial(port);
      if (!opening.has(id)) {
        local.destroy();

        return;
      }
      opening.delete(id);
      locals.set(id, local);
      flushPending(id, local);
      local.on(`data`, (chunk: Buffer | string) => tunnel?.sendData(id, Buffer.from(chunk)));
      local.on(`close`, () => {
        if (!locals.has(id)) {
          return;
        }
        locals.delete(id);
        tunnel?.sendControl({ id, type: `close` });
      });
      local.on(`error`, () => {
        closeLocal(id);
        tunnel?.sendControl({ id, type: `close` });
      });
    } catch {
      opening.delete(id);
      pending.delete(id);
      tunnel?.sendControl({ id, type: `close` });
    }
  };

  const attach = () => {
    const next = TunnelSocket(new ws(url), {
      onClose: () => {
        for (const id of locals.keys()) {
          closeLocal(id);
        }
        tunnel = undefined;
        if (stopped) {
          return;
        }
        cancelReconnect?.();
        cancelReconnect = Timer.timeout(() => {
          if (!stopped) {
            attach();
          }
        }, reconnectMs);
      },
      onControl: message => {
        if (message.type === `open`) {
          void openStream(message.id, message.port);

          return;
        }
        if (message.type === `close`) {
          closeLocal(message.id);
        }
      },
      onData: (id, chunk) => {
        const local = locals.get(id);
        if (local !== undefined) {
          local.write(chunk);

          return;
        }
        if (opening.has(id)) {
          const chunks = pending.get(id) ?? [];
          chunks.push(chunk);
          pending.set(id, chunks);
        }
      },
      onError: () => next.close(),
      onOpen: () => {
        next.sendControl({ key, type: `auth` });
        next.sendControl({ port: HttpConstants.httpsPort, type: `ready` });
      },
    });
    tunnel = next;
  };

  const stop = () => {
    stopped = true;
    cancelReconnect?.();
    cancelReconnect = undefined;
    for (const id of locals.keys()) {
      closeLocal(id);
    }
    tunnel?.close();
    tunnel = undefined;
  };

  attach();

  return { stop };
};

export type TunnelClient = ReturnType<typeof TunnelClient>;
