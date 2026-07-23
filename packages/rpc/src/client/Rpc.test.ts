/* @vitest-environment node */
/* eslint-disable unicorn/prefer-includes-over-repeated-comparisons */
/* eslint-disable @typescript-eslint/require-await */
import { describe, expect, expectTypeOf, it, vi } from "vitest";

import type { RpcProcedure } from "../Procedure";

import { Rpc as Contract } from "../contract/Rpc";

const state = vi.hoisted(() => {
  type Fake = {
    close: ReturnType<typeof vi.fn>;
    onReconnect: ReturnType<typeof vi.fn>;
    open: ReturnType<typeof vi.fn>;
  };

  const clients: Fake[] = [];

  return { clients };
});

vi.mock(`../Client`, () => ({
  Client: () => {
    const fake = { close: vi.fn(), onReconnect: vi.fn(() => () => undefined), open: vi.fn() };
    state.clients.push(fake);

    return new Proxy(fake, {
      get: (target, prop) => {
        if (prop === `close` || prop === `onReconnect` || prop === `open`) {
          return target[prop];
        }

        return new Proxy(() => undefined, {
          apply: async () => undefined,
          get: (_t, key) => {
            if (key === `on`) {
              return () => () => undefined;
            }

            return new Proxy(() => undefined, { apply: async () => undefined, get: () => undefined });
          },
        });
      },
    });
  },
}));

const rpcModule = await import(`./Rpc`);
const connect = rpcModule.Rpc;

type Modules = { root: { rpc: { read: object } } };

describe(`Rpc`, () => {
  it(`starts signed out without opening`, async () => {
    state.clients.length = 0;
    const contract = Contract.define<Modules>()({ path: `/rpc` });

    const api = await connect(contract, {
      auth: { signedIn: async () => false, signIn: async () => ({ status: `ok` }), signOut: async () => undefined },
      onOpen: vi.fn(),
    });

    expect(api.auth()).toBe(false);
    expect(state.clients[0]?.open).not.toHaveBeenCalled();
  });

  it(`stays signed out and closes when initial adopt fails`, async () => {
    state.clients.length = 0;
    const contract = Contract.define<Modules>()({ path: `/rpc` });

    const api = await connect(contract, {
      auth: { signedIn: async () => true, signIn: async () => ({ status: `ok` }), signOut: async () => undefined },
      onOpen: () => {
        throw new Error(`onOpen failed`);
      },
    });

    expect(api.auth()).toBe(false);
    expect(state.clients[0]?.close).toHaveBeenCalledWith();
  });

  it(`adopts when signed in and on successful signIn`, async () => {
    state.clients.length = 0;
    const onOpen = vi.fn();
    const contract = Contract.define<Modules>()({ path: `/rpc` });

    const api = await connect(contract, {
      auth: { signedIn: async () => true, signIn: async () => ({ status: `ok` }), signOut: async () => undefined },
      onOpen,
    });

    expect(api.auth()).toBe(true);
    expect(state.clients[0]?.open).toHaveBeenCalledTimes(1);
    expect(onOpen).toHaveBeenCalledTimes(1);

    await api.auth.signOut();

    expect(api.auth()).toBe(false);
    expect(state.clients[0]?.close).toHaveBeenCalledTimes(1);

    await api.auth.signIn();

    expect(api.auth()).toBe(true);
    expect(state.clients[0]?.close).toHaveBeenCalledTimes(1);
    expect(state.clients[0]?.open).toHaveBeenCalledTimes(2);
    expect(onOpen).toHaveBeenCalledTimes(2);
  });

  it(`closes the probe socket when the session is signed out`, async () => {
    state.clients.length = 0;
    const contract = Contract.define<Modules>()({ path: `/rpc` });

    await connect(contract, {
      auth: { signedIn: async () => false, signIn: async () => ({ status: `ok` }), signOut: async () => undefined },
    });

    expect(state.clients[0]?.open).not.toHaveBeenCalled();
    expect(state.clients[0]?.close).toHaveBeenCalledTimes(1);
  });

  it(`sync adopts when session becomes true`, async () => {
    state.clients.length = 0;
    let session = false;
    const contract = Contract.define<Modules>()({ path: `/rpc` });

    const api = await connect(contract, {
      auth: { signedIn: async () => session, signIn: async () => ({ status: `fail` }), signOut: async () => undefined },
    });

    expect(api.auth()).toBe(false);

    session = true;
    await api.auth.sync();

    expect(api.auth()).toBe(true);
    expect(state.clients[0]?.open).toHaveBeenCalledTimes(2);
  });

  it(`keeps signed out when signOut wins over in-flight sync probe`, async () => {
    state.clients.length = 0;
    const contract = Contract.define<Modules>()({ path: `/rpc` });
    const gate = Promise.withResolvers<boolean>();
    const probe = { n: 0 };

    const api = await connect(contract, {
      auth: {
        signedIn: async () => {
          probe.n += 1;
          if (probe.n === 1) {
            return false;
          }

          return gate.promise;
        },
        signIn: async () => ({ status: `fail` }),
        signOut: async () => undefined,
      },
    });

    const syncing = api.auth.sync();
    await api.auth.signOut();
    gate.resolve(true);
    await syncing;

    expect(api.auth()).toBe(false);
    expect(state.clients[0]?.close).toHaveBeenCalledWith();
  });

  it(`closes the probe socket when sync session read fails`, async () => {
    state.clients.length = 0;
    let session = false;
    const contract = Contract.define<Modules>()({ path: `/rpc` });

    const api = await connect(contract, {
      auth: {
        signedIn: async () => {
          if (!session) {
            return false;
          }
          throw new Error(`probe failed`);
        },
        signIn: async () => ({ status: `fail` }),
        signOut: async () => undefined,
      },
    });

    const [client] = state.clients;
    client?.close.mockClear();
    session = true;

    await api.auth.sync();

    expect(api.auth()).toBe(false);
    expect(client?.close).toHaveBeenCalledWith();
  });

  it(`closes the probe socket when sync adopt fails`, async () => {
    state.clients.length = 0;
    let session = false;
    const contract = Contract.define<Modules>()({ path: `/rpc` });

    const api = await connect(contract, {
      auth: { signedIn: async () => session, signIn: async () => ({ status: `fail` }), signOut: async () => undefined },
      onOpen: () => {
        throw new Error(`onOpen failed`);
      },
    });

    const [client] = state.clients;
    client?.close.mockClear();
    session = true;

    await api.auth.sync();

    expect(api.auth()).toBe(false);
    expect(client?.close).toHaveBeenCalledWith();
  });

  it(`keeps signed out when signOut wins over in-flight signIn adopt`, async () => {
    state.clients.length = 0;
    const contract = Contract.define<Modules>()({ path: `/rpc` });
    const box: { api?: Awaited<ReturnType<typeof connect>> } = {};

    box.api = await connect(contract, {
      auth: { signedIn: async () => false, signIn: async () => ({ status: `ok` }), signOut: async () => undefined },
      onOpen: () => {
        void box.api?.auth.signOut();
      },
    });

    await box.api.auth.signIn();

    expect(box.api.auth()).toBe(false);
    expect(state.clients[0]?.close).toHaveBeenCalledWith();
  });

  it(`closes the socket before HTTP sign-out`, async () => {
    state.clients.length = 0;
    const order: string[] = [];
    const contract = Contract.define<Modules>()({ path: `/rpc` });

    const api = await connect(contract, {
      auth: {
        signedIn: async () => true,
        signIn: async () => ({ status: `ok` }),
        signOut: async () => {
          order.push(`http`);
        },
      },
    });

    const [client] = state.clients;
    client?.close.mockImplementation(() => {
      order.push(`socket`);
    });

    await api.auth.signOut();

    expect(order).toStrictEqual([`socket`, `http`]);
    expect(api.auth()).toBe(false);
  });

  describe(`signedIn`, () => {
    it(`receives RPC auth so session can be read`, async () => {
      state.clients.length = 0;

      type AuthModules = { auth: { rpc: { session: RpcProcedure<object, object, undefined, unknown> } } };

      const contract = Contract.define<AuthModules>()({ path: `/rpc` });

      const api = await connect(contract, {
        auth: {
          signedIn: async client =>
            client.auth
              .session()
              .then(() => true)
              .catch(() => false),
          signIn: async () => ({ status: `ok` }),
          signOut: async () => undefined,
        },
      });

      expect(api.auth()).toBe(true);
    });
  });

  describe(`signIn`, () => {
    it(`does not reopen when already signed in`, async () => {
      state.clients.length = 0;
      const contract = Contract.define<Modules>()({ path: `/rpc` });

      const api = await connect(contract, {
        auth: { signedIn: async () => true, signIn: async () => ({ status: `ok` }), signOut: async () => undefined },
      });

      const [client] = state.clients;
      client?.open.mockClear();
      client?.close.mockClear();

      await expect(api.auth.signIn()).resolves.toStrictEqual({ status: `ok` });

      expect(api.auth()).toBe(true);
      expect(client?.open).not.toHaveBeenCalled();
      expect(client?.close).not.toHaveBeenCalled();
    });

    it(`adopts without a second session read`, async () => {
      state.clients.length = 0;
      const readSession = vi.fn(async () => false);
      const contract = Contract.define<Modules>()({ path: `/rpc` });

      const api = await connect(contract, {
        auth: { signedIn: readSession, signIn: async () => ({ status: `ok` }), signOut: async () => undefined },
      });

      readSession.mockClear();

      await expect(api.auth.signIn()).resolves.toStrictEqual({ status: `ok` });

      expect(readSession).not.toHaveBeenCalled();
      expect(api.auth()).toBe(true);
      expect(state.clients[0]?.open).toHaveBeenCalledTimes(1);
    });

    it(`keeps signed out when adopt fails`, async () => {
      state.clients.length = 0;
      const contract = Contract.define<Modules>()({ path: `/rpc` });

      const api = await connect(contract, {
        auth: { signedIn: async () => false, signIn: async () => ({ status: `ok` }), signOut: async () => undefined },
      });

      const [client] = state.clients;
      client?.close.mockClear();
      client?.open.mockImplementationOnce(() => {
        throw new Error(`disconnected`);
      });

      await expect(api.auth.signIn()).rejects.toThrow(`disconnected`);

      expect(api.auth()).toBe(false);
      expect(client?.close).toHaveBeenCalledWith();
    });

    it(`adopts again after a failed signIn`, async () => {
      state.clients.length = 0;
      const contract = Contract.define<Modules>()({ path: `/rpc` });

      const api = await connect(contract, {
        auth: { signedIn: async () => false, signIn: async () => ({ status: `ok` }), signOut: async () => undefined },
      });

      const [client] = state.clients;
      client?.open.mockImplementationOnce(() => {
        throw new Error(`disconnected`);
      });

      await expect(api.auth.signIn()).rejects.toThrow(`disconnected`);
      await expect(api.auth.signIn()).resolves.toStrictEqual({ status: `ok` });

      expect(api.auth()).toBe(true);
      expect(client?.open).toHaveBeenCalledTimes(2);
    });
  });

  describe(`types`, () => {
    it(`exposes auth methods and is not thenable`, async () => {
      const contract = Contract.define<Modules>()({ path: `/rpc` });

      const api = await connect(contract, {
        auth: { signedIn: async () => false, signIn: async () => ({ status: `ok` }), signOut: async () => undefined },
      });

      expectTypeOf(api.auth.signIn).toBeFunction();
      expectTypeOf(api.auth.signOut).returns.toEqualTypeOf<Promise<void>>();
      expectTypeOf(api.auth.sync).returns.toEqualTypeOf<Promise<void>>();

      await expect(Promise.resolve(api)).resolves.toBe(api);

      expectTypeOf(api.auth).toBeFunction();
    });
  });
});
