/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable init-declarations */
import type { FastifyInstance } from "fastify";

import websocket from "@fastify/websocket";
import { _, Timer } from "@snappy/core";
import ws, { type WebSocket as NodeWebSocket } from "ws";

import type { SocketRaw } from "./SocketRaw";

export type SocketReconnectConfig = {
  delayMs?: number;
  onSocket: (socket: SocketRaw) => (() => void) | undefined;
  url: string;
};

const registered = new WeakSet<FastifyInstance>();

const node = (socket: NodeWebSocket): SocketRaw => {
  const close = () => socket.close();

  const on: SocketRaw[`on`] = (event, listener) => {
    if (event === `message`) {
      socket.on(`message`, (raw, isBinary) => {
        listener(raw, isBinary);
      });

      return;
    }
    socket.on(event, listener as () => void);
  };

  const send = (data: Buffer | string) => socket.send(data);

  return { close, on, send };
};

const fastify = async (app: FastifyInstance) => {
  if (registered.has(app)) {
    return;
  }
  registered.add(app);
  await app.register(websocket);
};

const reconnect = ({ delayMs = 2 * _.second, onSocket, url }: SocketReconnectConfig) => {
  let stopped = false;
  let cancel: (() => void) | undefined;
  let detach: (() => void) | undefined;
  let current: SocketRaw | undefined;

  const attach = () => {
    const socket = node(new ws(url));
    current = socket;
    let cleaned = false;

    const cleanup = () => {
      if (cleaned) {
        return;
      }
      cleaned = true;
      detach?.();
      detach = undefined;
    };

    const schedule = () => {
      cleanup();
      current = undefined;
      if (stopped) {
        return;
      }
      cancel?.();
      cancel = Timer.timeout(() => {
        if (!stopped) {
          attach();
        }
      }, delayMs);
    };

    socket.on(`close`, schedule);
    socket.on(`error`, () => socket.close());
    detach = onSocket(socket);
  };

  const stop = () => {
    stopped = true;
    cancel?.();
    cancel = undefined;
    detach?.();
    detach = undefined;
    current?.close();
    current = undefined;
  };

  attach();

  return { stop };
};

export type SocketReconnect = ReturnType<typeof reconnect>;

export const Socket = { fastify, node, reconnect };
