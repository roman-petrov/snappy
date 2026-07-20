// cspell:word aitunnel
/* eslint-disable @typescript-eslint/no-unsafe-type-assertion */
import type { Db, DbUser } from "@snappy/db";
import type { FastifyInstance } from "fastify";

import { HttpStatus } from "@snappy/core";
import { setImmediate } from "node:timers/promises";
import { describe, expect, it, vi } from "vitest";

import type { Balance } from "../Balance";
import type { BetterAuth } from "../BetterAuth";

import { AppLog } from "../AppLog";
import { Session } from "../Session";
import { Mock } from "../test/Mock";
import { AiTunnelProxy } from "./AiTunnelProxy";
import { PayloadProxy, type PayloadProxyConfig } from "./PayloadProxy";

vi.mock(`../Session`, () => ({ Session: { resolve: vi.fn() } }));

vi.mock(`@snappy/config`, () => ({ Config: { aiTunnelKey: () => `test-ai-tunnel-key` } }));

vi.mock(`@snappy/log`, () => {
  const channel = () => ({ error: vi.fn(), info: vi.fn(), warn: vi.fn() });
  const root = { ai: channel(), auth: channel(), payment: channel() };

  return { Log: { ...root, withFields: () => root } };
});

vi.mock(`./PayloadProxy`, () => ({ PayloadProxy: vi.fn() }));

const proxyPath = `/api/ai-tunnel/resource`;
const tunnelKey = `test-ai-tunnel-key`;
const upstreamUrl = `https://api.aitunnel.ru`;

type MockTunnel = { balance: Balance; betterAuth: BetterAuth; db: ReturnType<typeof Db>; dbUser: DbUser };

const withUsage = (costRub: number, name?: string) => ({
  ...(name === undefined ? {} : { model: name }),
  usage: { cost_rub: costRub },
});

const mockTunnel = (userId = `user-1`): MockTunnel => ({
  balance: {
    creditFromTopUp: vi.fn(),
    debitForLlm: vi.fn().mockResolvedValue(undefined),
    isLlmBlocked: vi.fn().mockResolvedValue(false),
    read: vi.fn(),
    rpc: {},
  } as unknown as Balance,
  betterAuth: {} as BetterAuth,
  db: Mock.createDb(),
  dbUser: Mock.createDbUser(userId),
});

const setup = async ({
  authorized = true,
  blocked = false,
}: { authorized?: boolean; blocked?: boolean } = {}): Promise<{ api: MockTunnel; config: PayloadProxyConfig }> => {
  vi.mocked(PayloadProxy).mockClear();
  vi.mocked(Session.resolve).mockReset();
  const api = mockTunnel();
  const log = AppLog();
  vi.mocked(Session.resolve).mockResolvedValue(authorized ? { dbUser: api.dbUser, log } : undefined);
  vi.mocked(api.balance.isLlmBlocked).mockResolvedValue(blocked);

  await AiTunnelProxy({} as FastifyInstance, { balance: api.balance, betterAuth: api.betterAuth, db: api.db });

  const config = vi.mocked(PayloadProxy).mock.calls.at(-1)?.[1];
  if (config === undefined) {
    throw new Error(`PayloadProxy was not called`);
  }

  return { api, config };
};

describe(`AiTunnelProxy`, () => {
  it(`registers PayloadProxy with prefix and upstream url`, async () => {
    await setup();

    expect(PayloadProxy).toHaveBeenCalledWith(
      {},
      expect.objectContaining({ prefix: `/api/ai-tunnel`, upstream: upstreamUrl }),
    );
  });

  describe(`gate`, () => {
    it(`returns unauthorized when there is no session user`, async () => {
      const { config } = await setup({ authorized: false });

      await expect(config.gate?.({})).resolves.toStrictEqual({
        allow: false,
        body: { status: `unauthorized` },
        status: HttpStatus.unauthorized,
      });
    });

    it(`returns balanceBlocked when balance check fails`, async () => {
      const { api, config } = await setup({ blocked: true });

      await expect(config.gate?.({})).resolves.toStrictEqual({
        allow: false,
        body: { status: `balanceBlocked` },
        status: HttpStatus.ok,
      });
      expect(api.balance.isLlmBlocked).toHaveBeenCalledWith(api.dbUser);
    });

    it(`allows request with dbUser state`, async () => {
      const { api, config } = await setup();
      const result = await config.gate?.({});

      expect(result).toMatchObject({ allow: true, state: { billingDone: false, dbUser: api.dbUser } });
      expect(result !== undefined && `state` in result ? result.state : undefined).toHaveProperty(`log`);
    });
  });

  describe(`headers`, () => {
    it(`rewrites authorization and host, drops cookie`, async () => {
      const { config } = await setup();

      expect(
        config.headers?.({ authorization: `Bearer client-token`, cookie: `a=b`, host: `localhost:3000` }),
      ).toStrictEqual({ authorization: `Bearer ${tunnelKey}`, host: `api.aitunnel.ru` });
    });
  });

  describe(`onPayload`, () => {
    it(`debits usage.cost_rub with call URL and model`, async () => {
      const { api, config } = await setup();
      const state = { billingDone: false, dbUser: api.dbUser, log: AppLog() };

      config.onPayload(withUsage(12.5, `name-a`), proxyPath, state);
      await setImmediate();

      expect(api.balance.debitForLlm).toHaveBeenCalledExactlyOnceWith(api.dbUser, 12.5, {
        call: proxyPath,
        model: `name-a`,
      });
    });

    it(`uses empty model when model is absent`, async () => {
      const { api, config } = await setup();
      const state = { billingDone: false, dbUser: api.dbUser, log: AppLog() };

      config.onPayload(withUsage(3), proxyPath, state);
      await setImmediate();

      expect(api.balance.debitForLlm).toHaveBeenCalledWith(api.dbUser, 3, { call: proxyPath, model: `` });
    });

    it(`does not debit when usage.cost_rub is not a number`, async () => {
      const { api, config } = await setup();
      const state = { billingDone: false, dbUser: api.dbUser, log: AppLog() };

      config.onPayload({ usage: { cost_rub: `0.43` } }, proxyPath, state);
      await setImmediate();

      expect(api.balance.debitForLlm).not.toHaveBeenCalled();
    });

    it(`does not debit on payloads without usage.cost_rub`, async () => {
      const { api, config } = await setup();
      const state = { billingDone: false, dbUser: api.dbUser, log: AppLog() };

      config.onPayload({ value: `ok` }, proxyPath, state);
      await setImmediate();

      expect(api.balance.debitForLlm).not.toHaveBeenCalled();
    });

    it(`debits only once after billing flag is set`, async () => {
      const { api, config } = await setup();
      const state = { billingDone: false, dbUser: api.dbUser, log: AppLog() };

      config.onPayload(withUsage(1), proxyPath, state);
      await setImmediate();
      config.onPayload(withUsage(9), proxyPath, state);
      await setImmediate();

      expect(api.balance.debitForLlm).toHaveBeenCalledExactlyOnceWith(api.dbUser, 1, { call: proxyPath, model: `` });
    });

    it(`debits on every billable payload that starts before billing flag is set`, async () => {
      const { api, config } = await setup();
      const state = { billingDone: false, dbUser: api.dbUser, log: AppLog() };

      config.onPayload(withUsage(1), proxyPath, state);
      config.onPayload(withUsage(9), proxyPath, state);
      await setImmediate();

      expect(api.balance.debitForLlm).toHaveBeenCalledTimes(2);
      expect(api.balance.debitForLlm).toHaveBeenNthCalledWith(1, api.dbUser, 1, { call: proxyPath, model: `` });
      expect(api.balance.debitForLlm).toHaveBeenNthCalledWith(2, api.dbUser, 9, { call: proxyPath, model: `` });
    });
  });
});
