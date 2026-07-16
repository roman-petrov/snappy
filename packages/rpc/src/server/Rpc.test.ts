/* @vitest-environment node */

/* eslint-disable @typescript-eslint/require-await */
import fastify, { type FastifyInstance } from "fastify";
import { describe, expect, it } from "vitest";
import ws from "ws";
import { z } from "zod";

import { Rpc as Contract } from "../contract/Rpc";
import { Protocol } from "../Protocol";
import { Rpc } from "./Rpc";

type Context = { id: string | undefined };

const scope = Contract.scope(({ id }: Context) => (id === undefined ? undefined : { id }));

const listen = async (mount: (app: FastifyInstance) => Promise<void>) => {
  const app = fastify();
  await mount(app);
  await app.listen({ host: `127.0.0.1`, port: 0 });
  const address = app.server.address();
  const port = address instanceof Object ? address.port : 0;

  return { app, port };
};

const connect = async (port: number, path: string) =>
  new Promise<ws>((resolve, reject) => {
    const socket = new ws(`ws://127.0.0.1:${port}${path}`);
    socket.once(`open`, () => {
      resolve(socket);
    });
    socket.once(`error`, reject);
  });

const asText = (raw: ws.RawData) => {
  if (typeof raw === `string`) {
    return raw;
  }
  if (Buffer.isBuffer(raw)) {
    return raw.toString(`utf8`);
  }
  if (Array.isArray(raw)) {
    return Buffer.concat(raw).toString(`utf8`);
  }

  return Buffer.from(new Uint8Array(raw)).toString(`utf8`);
};

const request = async (socket: ws, message: { id: string; input?: unknown; path: string }) => {
  const pending = new Promise<unknown>((resolve, reject) => {
    const onMessage = (raw: ws.RawData) => {
      const wire = Protocol.parse(asText(raw));
      if (wire === undefined || !(`ok` in wire) || wire.id !== message.id) {
        return;
      }
      socket.off(`message`, onMessage);
      if (wire.ok) {
        resolve(wire.data);
      } else {
        reject(Object.assign(new Error(wire.error.code), wire.error));
      }
    };
    socket.on(`message`, onMessage);
  });
  socket.send(Protocol.stringify(message));

  return pending;
};

const nextEvent = async (socket: ws) =>
  new Promise<{ data: unknown; path: string; seq: number }>((resolve, reject) => {
    const onMessage = (raw: ws.RawData) => {
      const wire = Protocol.parse(asText(raw));
      if (wire === undefined || !(`type` in wire)) {
        return;
      }
      socket.off(`message`, onMessage);
      resolve({ data: wire.data, path: wire.path, seq: wire.seq });
    };
    socket.on(`message`, onMessage);
    socket.once(`error`, reject);
  });

describe(`mount`, () => {
  it(`answers query mut auth input and unknown path`, async () => {
    const root = {
      rpc: {
        boom: scope.query(async () => {
          throw new Error(`boom`);
        }),
        bump: scope.mut(async ({ id }) => id),
        echo: scope.query(z.object({ n: z.number() }), async ({ input }) => input.n),
        read: scope.query(async ({ id }) => id),
      },
    };

    const contract = Contract.define<{ root: typeof root }>()({ path: `/rpc` });

    const { app, port } = await listen(async appInstance =>
      Rpc.mount(appInstance, contract, {
        context: (): Context => ({ id: `1` }),
        modules: { root },
        userId: ({ id }) => id,
      }),
    );

    const socket = await connect(port, `/rpc`);

    await expect(request(socket, { id: `1`, path: `root.read` })).resolves.toBe(`1`);
    await expect(request(socket, { id: `2`, input: { n: 3 }, path: `root.echo` })).resolves.toBe(3);
    await expect(request(socket, { id: `3`, path: `root.bump` })).resolves.toBe(`1`);

    await expect(request(socket, { id: `4`, input: { n: `x` }, path: `root.echo` })).rejects.toMatchObject({
      code: `BAD_REQUEST`,
    });
    await expect(request(socket, { id: `5`, path: `root.boom` })).rejects.toMatchObject({ code: `INTERNAL` });
    await expect(request(socket, { id: `6`, path: `missing` })).rejects.toMatchObject({ code: `BAD_REQUEST` });

    socket.close();
    await app.close();
  });

  it(`rejects when connection context has no user`, async () => {
    const root = { rpc: { read: scope.query(async ({ id }) => id) } };
    const contract = Contract.define<{ root: typeof root }>()({ path: `/rpc` });

    const { app, port } = await listen(async appInstance =>
      Rpc.mount(appInstance, contract, {
        context: (): Context => ({ id: undefined }),
        modules: { root },
        userId: ({ id }) => id,
      }),
    );

    const socket = await connect(port, `/rpc`);

    await expect(request(socket, { id: `1`, path: `root.read` })).rejects.toMatchObject({ code: `UNAUTHORIZED` });

    socket.close();
    await app.close();
  });

  it(`rejects when connection context is undefined`, async () => {
    const root = { rpc: { read: scope.query(async ({ id }) => id) } };
    const contract = Contract.define<{ root: typeof root }>()({ path: `/rpc` });

    const { app, port } = await listen(async appInstance =>
      Rpc.mount(appInstance, contract, { context: () => undefined, modules: { root }, userId: ({ id }) => id }),
    );

    const socket = await connect(port, `/rpc`);

    await expect(request(socket, { id: `1`, path: `root.read` })).rejects.toMatchObject({ code: `UNAUTHORIZED` });

    socket.close();
    await app.close();
  });

  it(`pushes live mut results`, async () => {
    const root = { rpc: { bump: scope.mut(async ({ id }) => `${id}-x`) } };
    const contract = Contract.define<{ root: typeof root }>()({ path: `/rpc` });

    const { app, port } = await listen(async appInstance =>
      Rpc.mount(appInstance, contract, {
        context: (): Context => ({ id: `1` }),
        modules: { root },
        userId: ({ id }) => id,
      }),
    );

    const socket = await connect(port, `/rpc`);
    const event = nextEvent(socket);

    await expect(request(socket, { id: `1`, path: `root.bump` })).resolves.toBe(`1-x`);
    await expect(event).resolves.toMatchObject({ data: `1-x`, path: `root.bump` });

    socket.close();
    await app.close();
  });

  it(`builds context once per connection`, async () => {
    const root = { rpc: { read: scope.query(async ({ id }) => id) } };
    const contract = Contract.define<{ root: typeof root }>()({ path: `/rpc` });
    let builds = 0;

    const { app, port } = await listen(async appInstance =>
      Rpc.mount(appInstance, contract, {
        context: (): Context => {
          builds += 1;

          return { id: `1` };
        },
        modules: { root },
        userId: ({ id }) => id,
      }),
    );

    const socket = await connect(port, `/rpc`);

    await expect(request(socket, { id: `1`, path: `root.read` })).resolves.toBe(`1`);
    await expect(request(socket, { id: `2`, path: `root.read` })).resolves.toBe(`1`);
    await expect(request(socket, { id: `3`, path: `root.read` })).resolves.toBe(`1`);

    expect(builds).toBe(1);

    socket.close();
    await app.close();
  });
});
