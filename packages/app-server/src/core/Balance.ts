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
    amountRub: number,
    log: { amount?: number | string; currency?: string; paymentId: string },
  ) => user.balance.creditTopUp(amountRub, { ...log, type: `topup` });

  const creditFromSignUp = async (user: DbUser) =>
    user.balance.credit(Config.balance.signUpBonusRub, { source: `signUp` });

  const debitForLlm = async (user: DbUser, costRub: number, meta: { call: string; model: string }) => {
    const rub = _.round(costRub * (1 + Config.balance.llmCommission), 2);
    await user.balance.debit(rub, { ...meta, chargedRub: rub, costRub });
  };

  const rpc = doc(db.balance, async ({ dbUser }) => read(dbUser));

  return { creditFromSignUp, creditFromTopUp, debitForLlm, isLlmBlocked, read, rpc };
};

export type Balance = ReturnType<typeof Balance>;
