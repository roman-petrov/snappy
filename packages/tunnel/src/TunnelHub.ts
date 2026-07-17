/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable init-declarations */
/* eslint-disable no-empty-function */
/* eslint-disable unicorn/no-null */
import type { FastifyInstance, FastifyReply } from "fastify";

import { HttpStatus } from "@snappy/core";
import { Socket } from "@snappy/rpc/socket";
import { Duplex } from "node:stream";

import { type TunnelFetchInit, TunnelHttp } from "./TunnelHttp";
import { TunnelSocket } from "./TunnelSocket";

export type TunnelHubConfig = { key: string };

type Session = { defaultPort: number; tunnel: TunnelSocket };

export const TunnelHub = ({ key }: TunnelHubConfig) => {
  let session: Session | undefined;
  let nextId = 1;
  const streams = new Map<number, Duplex>();

  const dropSession = (tunnel: TunnelSocket) => {
    if (session?.tunnel === tunnel) {
      session = undefined;
    }
    for (const [, stream] of streams) {
      stream.destroy();
    }
    streams.clear();
  };

  const accept = (socket: Parameters<typeof Socket.node>[0]) => {
    let authenticated = false;

    const tunnel = TunnelSocket(Socket.node(socket), {
      onClose: () => dropSession(tunnel),
      onControl: message => {
        if (!authenticated) {
          if (message.type !== `auth` || message.key !== key) {
            tunnel.close();

            return;
          }
          authenticated = true;

          return;
        }
        if (message.type === `close`) {
          const stream = streams.get(message.id);
          if (stream === undefined) {
            return;
          }
          streams.delete(message.id);
          stream.push(null);
          stream.destroy();

          return;
        }
        if (message.type === `ready`) {
          if (session !== undefined && session.tunnel !== tunnel) {
            session.tunnel.close();
          }
          session = { defaultPort: message.port, tunnel };
        }
      },
      onData: (id, chunk) => streams.get(id)?.push(chunk),
    });
  };

  const connect = () => {
    const active = session;
    if (active === undefined) {
      throw new Error(`tunnel client offline`);
    }
    const id = nextId;
    nextId += 1;

    const stream = new Duplex({
      read() {},
      write(chunk: Buffer | string, _encoding, callback) {
        if (session?.tunnel !== active.tunnel) {
          callback(new Error(`tunnel client offline`));

          return;
        }
        active.tunnel.sendData(id, Buffer.from(chunk));
        callback();
      },
    });
    stream.on(`close`, () => {
      if (!streams.has(id)) {
        return;
      }
      streams.delete(id);
      if (session?.tunnel === active.tunnel) {
        active.tunnel.sendControl({ id, type: `close` });
      }
    });
    streams.set(id, stream);
    active.tunnel.sendControl({ id, port: active.defaultPort, type: `open` });

    return stream;
  };

  const fetch = async (path: string, init: TunnelFetchInit = {}) => TunnelHttp.fetch(connect, path, init);

  const proxy = async (reply: FastifyReply, path: string, init: TunnelFetchInit = {}) => {
    const response = await fetch(path, init).catch(() => undefined);
    if (response === undefined) {
      await reply.status(HttpStatus.badGateway).send();

      return;
    }
    await reply.status(response.status).send(Buffer.from(await response.arrayBuffer()));
  };

  const online = () => session !== undefined;

  const register = async (app: FastifyInstance, path: string) => {
    await Socket.fastify(app);
    await app.register(scoped => {
      scoped.get(path, { websocket: true }, accept);
    });

    return { online, proxy };
  };

  return { online, proxy, register };
};

export type TunnelHub = ReturnType<typeof TunnelHub>;
