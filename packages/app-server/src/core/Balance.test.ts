import { Config } from "@snappy/config";
import { describe, expect, it, vi } from "vitest";

import { Balance } from "./Balance";
import { Mock } from "./test/Mock";

const { creditFromSignUp, creditFromTopUp, debitForLlm, isLlmBlocked, read } = Balance(Mock.createDb());

describe(`read`, () => {
  it(`returns balance snapshot from user`, async () => {
    const user = Mock.createDbUser();
    vi.mocked(user.balance.read).mockResolvedValue({ balance: 42.5, id: user.id });

    await expect(read(user)).resolves.toStrictEqual({ balance: 42.5, id: user.id });
    expect(user.balance.read).toHaveBeenCalledTimes(1);
  });
});

describe(`isLlmBlocked`, () => {
  it.each([
    { balance: 0, blocked: true, name: `zero balance` },
    { balance: -0.01, blocked: true, name: `negative balance` },
    { balance: -100, blocked: true, name: `large negative balance` },
    { balance: 0.01, blocked: false, name: `small positive balance` },
    { balance: 100, blocked: false, name: `large positive balance` },
  ])(`$name`, async ({ balance, blocked }) => {
    const user = Mock.createDbUser();
    vi.mocked(user.balance.read).mockResolvedValue({ balance, id: user.id });

    await expect(isLlmBlocked(user)).resolves.toBe(blocked);
  });
});

describe(`creditFromSignUp`, () => {
  it(`credits sign-up bonus`, async () => {
    const user = Mock.createDbUser();

    await creditFromSignUp(user);

    expect(user.balance.credit).toHaveBeenCalledWith(Config.balance.signUpBonus, { source: `signUp` });
  });
});

describe(`creditFromTopUp`, () => {
  it(`credits user balance with payment log in one call`, async () => {
    const user = Mock.createDbUser();
    const log = { amount: `199.00`, currency: `RUB`, paymentId: `pay-1` };

    await creditFromTopUp(user, 199, log);

    expect(user.balance.creditTopUp).toHaveBeenCalledWith(199, { ...log, type: `topup` });
  });
});

describe(`debitForLlm`, () => {
  it(`debits cost with llm commission`, async () => {
    const user = Mock.createDbUser();
    const meta = { call: `chat`, model: `gpt-4` };

    await debitForLlm(user, 1.5, meta);

    expect(user.balance.debit).toHaveBeenCalledWith(1.88, { ...meta, charged: 1.88, cost: 1.5 });
  });
});
