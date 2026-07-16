/* eslint-disable functional/no-expression-statements */
import type { Db, DbUser } from "@snappy/db";

import { Config } from "@snappy/config";
import { _ } from "@snappy/core";

import { RpcScope } from "./RpcContract";

export const Balance = (db: Db) => {
  const { doc } = RpcScope;
  const read = async (user: DbUser) => user.balance.read();
  const isLlmBlocked = async (user: DbUser) => (await read(user)).balance <= 0;

  const creditFromTopUp = async (
    user: DbUser,
    amount: number,
    log: { amount?: number | string; currency?: string; paymentId: string },
  ) => user.balance.creditTopUp(amount, { ...log, type: `topup` });

  const creditFromSignUp = async (user: DbUser) =>
    user.balance.credit(Config.balance.signUpBonus, { source: `signUp` });

  const debitForLlm = async (user: DbUser, cost: number, meta: { call: string; model: string }) => {
    const charged = _.round(cost * (1 + Config.balance.llmCommission), 2);
    await user.balance.debit(charged, { ...meta, charged, cost });
  };

  const rpc = doc(db.balance, async ({ dbUser }) => read(dbUser));

  return { creditFromSignUp, creditFromTopUp, debitForLlm, isLlmBlocked, read, rpc };
};

export type Balance = ReturnType<typeof Balance>;
