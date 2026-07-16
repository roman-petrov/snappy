/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-let */
/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-try-statements */
/* eslint-disable init-declarations */
/* eslint-disable no-continue */
import type { FastifyInstance, FastifyRequest } from "fastify";
import type { WebSocket } from "ws";

import { _ } from "@snappy/core";

import type { RpcApi } from "../Endpoint";

import { Procedure, type RpcApiTree, type RpcProcedure } from "../Procedure";
import { Protocol, type RpcErrorCode } from "../Protocol";
import { Socket } from "../socket";
import { Hub } from "./Hub";

export type ContextFor<T> = [ContextsOf<T>] extends [never] ? object : object & UnionToIntersection<ContextsOf<T>>;

export type RegisterConfig<TContext extends object, TModules extends object> = {
  app: FastifyInstance;
  context: (input: { req: FastifyRequest }) => Promise<TContext | undefined> | TContext | undefined;
  modules: TModules;
  path: string;
  userId: (context: TContext) => string | undefined;
};

type ContextsOf<T> = T extends { authenticate: (context: infer C) => unknown }
  ? C
  : T extends object
    ? { [K in keyof T]: ContextsOf<T[K]> }[keyof T]
    : never;

type UnionToIntersection<TUnion> = (TUnion extends unknown ? (part: TUnion) => void : never) extends (
  part: infer TIntersection,
) => void
  ? TIntersection
  : never;

const sharedHub = Hub();

const rpcApi = <const T extends object>(tree: T): RpcApi<T> => {
  if (`rpc` in tree) {
    return tree.rpc as RpcApi<T>;
  }

  const result: Record<string, unknown> = {};

  for (const [key, value] of _.entries(tree)) {
    if (value instanceof Object) {
      result[key as string] = rpcApi(value);
    }
  }

  return result as RpcApi<T>;
};

const resolve = (tree: RpcApiTree, path: string): RpcProcedure | undefined => {
  const parts = path.split(`.`);
  let node: RpcApiTree | RpcProcedure = tree;
  for (const part of parts) {
    if (Procedure.isProcedure(node)) {
      return undefined;
    }
    const next: RpcApiTree[string] | undefined = node[part];
    if (next === undefined) {
      return undefined;
    }
    node = next;
  }

  return Procedure.isProcedure(node) ? node : undefined;
};

const bindLive = (tree: RpcApiTree, hub: Hub, prefix = ``) => {
  for (const [key, node] of _.entries(tree)) {
    const path = prefix === `` ? key : `${prefix}.${key}`;
    if (Procedure.isProcedure(node)) {
      const source = node.liveSource;
      if (source === undefined) {
        continue;
      }

      source.live((userId, data) => {
        hub.push(userId, path, data);
      });

      continue;
    }

    bindLive(node, hub, path);
  }
};

const run = async (
  procedure: RpcProcedure,
  context: unknown,
  input: unknown,
): Promise<{ auth: unknown; data: unknown; input: unknown } | { error: { code: RpcErrorCode; message?: string } }> => {
  const auth = procedure.authenticate(context);
  if (auth === undefined) {
    return { error: { code: `UNAUTHORIZED` } };
  }
  let parsed: unknown = input;
  if (procedure.input !== undefined) {
    const result = procedure.input.safeParse(input ?? {});
    if (!result.success) {
      return { error: { code: `BAD_REQUEST`, message: result.error.message } };
    }
    parsed = result.data;
  }
  try {
    const data = await procedure.handle({ auth, ctx: context, input: parsed });

    return { auth, data, input: parsed };
  } catch (error) {
    return { error: { code: `INTERNAL`, message: error instanceof Error ? error.message : undefined } };
  }
};

export const Register = async <TContext extends object, TModules extends object>({
  app,
  context: buildContext,
  modules,
  path,
  userId,
}: RegisterConfig<TContext, TModules>) => {
  const api = rpcApi(modules) as RpcApi<TModules> & RpcApiTree;
  bindLive(api, sharedHub);
  await Socket.fastify(app);

  await app.register(plugin => {
    plugin.get(path, { websocket: true }, (socket: WebSocket, httpRequest) => {
      const connection = Socket.node(socket);
      let boundUserId: string | undefined;
      let closed = false;

      const contextPromise = Promise.resolve(buildContext({ req: httpRequest })).then(context => {
        if (context !== undefined) {
          const resolvedUserId = userId(context);
          if (!closed && resolvedUserId !== undefined) {
            boundUserId = resolvedUserId;
            sharedHub.add(resolvedUserId, connection);
          }
        }

        return context;
      });

      connection.on(`close`, () => {
        closed = true;
        if (boundUserId !== undefined) {
          sharedHub.remove(boundUserId, connection);
        }
      });

      connection.on(`message`, (message, isBinary) => {
        if (isBinary) {
          return;
        }
        const text = _.isString(message)
          ? message
          : Buffer.isBuffer(message)
            ? message.toString(`utf8`)
            : Buffer.from(message as ArrayBuffer).toString(`utf8`);

        const wire = Protocol.parse(text);
        if (wire === undefined || `ok` in wire || `type` in wire) {
          return;
        }

        void (async () => {
          const context = await contextPromise;
          if (closed) {
            return;
          }
          if (context === undefined) {
            connection.send(Protocol.stringify({ error: { code: `UNAUTHORIZED` }, id: wire.id, ok: false }));

            return;
          }
          const procedure = resolve(api, wire.path);
          if (procedure === undefined) {
            connection.send(
              Protocol.stringify({ error: { code: `BAD_REQUEST`, message: `unknown path` }, id: wire.id, ok: false }),
            );

            return;
          }

          const result = await run(procedure, context, wire.input);
          if (`error` in result) {
            connection.send(Protocol.stringify({ error: result.error, id: wire.id, ok: false }));

            return;
          }

          connection.send(Protocol.stringify({ data: result.data, id: wire.id, ok: true }));

          if (Procedure.isLive(procedure) && procedure.liveSource === undefined && boundUserId !== undefined) {
            sharedHub.push(boundUserId, wire.path, result.data);
          }
        })();
      });
    });
  });
};
