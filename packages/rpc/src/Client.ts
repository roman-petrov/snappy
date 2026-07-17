/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-promise-reject */
/* eslint-disable init-declarations */
import { _, Timer } from "@snappy/core";

import type { RpcApiTree } from "./Procedure";
import type { RpcClient as RpcClientType } from "./Types";

import { Protocol } from "./Protocol";
import { Browser } from "./socket/Browser";

export type ClientConfig = { path: string };

type Pending = { reject: (error: Error) => void; resolve: (data: unknown) => void };

export const Client = <TApi extends RpcApiTree>({ path }: ClientConfig): RpcClientType<TApi> => {
  const pending = new Map<string, Pending>();
  const listeners = new Map<string, Set<(data: unknown) => void>>();
  const sequences = new Map<string, number>();
  const reconnectListeners = new Set<() => void>();
  let socket: ReturnType<typeof Browser.wrap> | undefined;
  let ready = false;
  let nextId = 0;
  let opened = false;
  let stopped = false;
  let everConnected = false;
  let cancelReconnect: (() => void) | undefined;
  const queue: string[] = [];
  const url = () => `${globalThis.location.protocol === `https:` ? `wss:` : `ws:`}//${globalThis.location.host}${path}`;

  const flush = () => {
    if (!ready || socket === undefined) {
      return;
    }
    for (const message of queue) {
      socket.send(message);
    }
    queue.length = 0;
  };

  const send = (message: string) => {
    if (ready && socket !== undefined) {
      socket.send(message);

      return;
    }
    queue.push(message);
  };

  const connect = () => {
    if (socket !== undefined || !opened) {
      return;
    }
    const connection = Browser.wrap(new WebSocket(url()));
    socket = connection;
    ready = false;

    connection.on(`open`, () => {
      ready = true;
      flush();
      if (everConnected) {
        sequences.clear();
        for (const listener of reconnectListeners) {
          listener();
        }
      }
      everConnected = true;
    });

    connection.on(`message`, (message, isBinary) => {
      if (isBinary || !_.isString(message)) {
        return;
      }
      const wire = Protocol.parse(message);
      if (wire === undefined) {
        return;
      }
      if (`type` in wire && wire.type === `event`) {
        const lastSeq = sequences.get(wire.path) ?? 0;
        if (wire.seq <= lastSeq) {
          return;
        }
        sequences.set(wire.path, wire.seq);
        for (const listener of listeners.get(wire.path) ?? []) {
          listener(wire.data);
        }

        return;
      }
      if (`ok` in wire) {
        const request = pending.get(wire.id);
        if (request === undefined) {
          return;
        }
        pending.delete(wire.id);
        if (wire.ok) {
          request.resolve(wire.data);
        } else {
          request.reject(new Error(wire.error.message ?? wire.error.code));
        }
      }
    });

    connection.on(`close`, () => {
      socket = undefined;
      ready = false;
      queue.length = 0;
      if (!opened) {
        pending.clear();

        return;
      }
      for (const [, request] of pending) {
        request.reject(new Error(`disconnected`));
      }
      pending.clear();
      cancelReconnect?.();
      cancelReconnect = Timer.timeout(() => {
        if (opened) {
          connect();
        }
      }, 2 * _.second);
    });

    connection.on(`error`, () => connection.close());
  };

  const open = () => {
    stopped = false;
    opened = true;
    connect();
  };

  const close = () => {
    stopped = true;
    opened = false;
    everConnected = false;
    cancelReconnect?.();
    cancelReconnect = undefined;
    pending.clear();
    queue.length = 0;
    const current = socket;
    socket = undefined;
    ready = false;
    listeners.clear();
    sequences.clear();
    reconnectListeners.clear();
    current?.close();
  };

  const onReconnect = (listener: () => void) => {
    reconnectListeners.add(listener);

    return () => {
      reconnectListeners.delete(listener);
    };
  };

  const call = async (route: string, input: unknown) => {
    if (stopped) {
      throw new Error(`disconnected`);
    }
    if (!opened) {
      open();
    }
    connect();
    nextId += 1;
    const requestId = String(nextId);

    return new Promise<unknown>((resolve, reject) => {
      pending.set(requestId, { reject, resolve });
      send(Protocol.stringify({ id: requestId, input, path: route }));
    });
  };

  const on = (route: string, listener: (data: unknown) => void) => {
    const routeListeners = listeners.get(route) ?? new Set();
    routeListeners.add(listener);
    listeners.set(route, routeListeners);

    return () => {
      routeListeners.delete(listener);
      if (routeListeners.size === 0) {
        listeners.delete(route);
      }
    };
  };

  const proxy = (prefix: string): unknown =>
    new Proxy(() => undefined, {
      apply: async (_target, _thisArg, args) => call(prefix, args[0]),
      get: (_target, prop) =>
        prefix === `` && prop === `open`
          ? open
          : prefix === `` && prop === `close`
            ? close
            : prefix === `` && prop === `onReconnect`
              ? onReconnect
              : prop === `on`
                ? (listener: (data: unknown) => void) => on(prefix, listener)
                : typeof prop === `symbol`
                  ? undefined
                  : proxy(prefix === `` ? prop : `${prefix}.${prop}`),
    });

  return proxy(``) as RpcClientType<TApi>;
};
