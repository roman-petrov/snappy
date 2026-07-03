import { Config } from "@snappy/config";
import { describe, expect, it, vi } from "vitest";

import { Balance } from "./Balance";
import { Mock } from "./test/Mock";

const { creditFromSignUp, creditFromTopUp, debitForLlm, isLlmBlocked, read } = Balance;

describe(`read`, () => {
  it(`returns balance from user`, async () => {
    const user = Mock.createDbUser();
    vi.mocked(user.balance.read).mockResolvedValue(42.5);

    await expect(read(user)).resolves.toBe(42.5);
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
    vi.mocked(user.balance.read).mockResolvedValue(balance);

    await expect(isLlmBlocked(user)).resolves.toBe(blocked);
  });
});

describe(`creditFromSignUp`, () => {
  it(`credits sign-up bonus`, async () => {
    const user = Mock.createDbUser();

    await creditFromSignUp(user);

    expect(user.balance.credit).toHaveBeenCalledWith(Config.balance.signUpBonusRub, { source: `signUp` });
  });
});

describe(`creditFromTopUp`, () => {
  it(`credits user balance`, async () => {
    const user = Mock.createDbUser();
    const meta = { yooKassaPaymentId: `pay-1` };

    await creditFromTopUp(user, 199, meta);

    expect(user.balance.credit).toHaveBeenCalledWith(199, meta);
  });
});

describe(`debitForLlm`, () => {
  it(`debits user balance with chargedRub in meta`, async () => {
    const user = Mock.createDbUser();
    const meta = { call: `chat`, model: `gpt-4` };

    await debitForLlm(user, 1.5, meta);

    expect(user.balance.debit).toHaveBeenCalledWith(1.5, { ...meta, chargedRub: 1.5 });
  });
});
